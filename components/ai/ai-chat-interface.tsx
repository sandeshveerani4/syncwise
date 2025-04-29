"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiMessage } from "@/components/ai/ai-message";
import { SendIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function AiChatInterface() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [response, setResponse] = useState<MessageType>();
  const [tool, setTool] = useState<string>();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const session = useSession();
  const [chatId, setChatId] = useState<string>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, response]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!session.data?.user) return;
    setIsLoading(true);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    let cid = chatId;

    if (!cid && messages.length === 0) {
      const res = await fetch("/api/ai", { method: "POST" });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Error while creating a new chat!",
          variant: "destructive",
        });
        return;
      }
      const { chatToken } = await res.json();
      cid = chatToken.sessionToken;
      setChatId(cid);
    }

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const ws = new WebSocket(
      `wss://${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/${session.data.user.id}/${cid}`
    );
    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data[0].kwargs.content !== undefined) {
        if (data[1]["langgraph_node"] === "agent") {
          setResponse((prev) => ({
            ...(prev as MessageType),
            content: (prev?.content ?? "") + data[0].kwargs.content,
          }));
        } else {
          setTool(data[0].kwargs.content);
        }
      }
    };
    ws.onerror = function () {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
      setIsLoading(false);
      setTool(undefined);
    };
    ws.onclose = function () {
      setIsLoading(false);
      setTool(undefined);
    };
    ws.onopen = function () {
      ws.send(input);
    };
  };

  useEffect(() => {
    if (!isLoading && response) {
      setResponse(undefined);
      setMessages((prev) => [...prev, response]);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [isLoading, response]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <Card className="flex-1 overflow-auto flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <AiMessage key={message.id} message={message} />
            ))}
            {isLoading && response && (
              <AiMessage key="final" message={response} />
            )}
            {isLoading && (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            )}
            {isLoading && tool && (
              <div className="text-sm text-neutral-500">{tool}</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              <SendIcon className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
