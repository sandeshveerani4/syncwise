"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiMessage } from "@/components/ai/ai-message";
import { SendIcon, Loader2, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { useSearchParams } from "next/navigation";

export type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: string[];
};

export function AiChatInterface() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [response, setResponse] = useState<MessageType>();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const session = useSession();
  const [chatId, setChatId] = useState<string>();
  const searchParams = useSearchParams();

  useEffect(() => {
    setInput(searchParams.get("q") || "");
  }, [searchParams]);

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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/${session.data.user.id}/${cid}`,
    );
    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data[0].kwargs.content !== undefined) {
        setResponse((prev) => ({
          ...(prev as MessageType),
          ...(data[1]["langgraph_node"] === "agent"
            ? { content: (prev?.content ?? "") + data[0].kwargs.content }
            : {
                toolCalls: [...(prev?.toolCalls ?? []), data[0].kwargs.content],
              }),
        }));
      }
    };
    ws.onerror = function () {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
      setIsLoading(false);
    };
    ws.onclose = function () {
      setIsLoading(false);
    };
    ws.onopen = function () {
      ws.send(input);
    };
  };

  useEffect(() => {
    if (!isLoading && response) {
      setMessages((prev) => [
        ...prev,
        { ...response, id: Date.now().toString() },
      ]);
      setResponse(undefined);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [isLoading, response]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-grow flex flex-col h-screen">
      {messages.length === 0 && !isLoading && !response && (
        <div className="h-full w-full flex flex-col gap-4 items-center justify-center text-neutral-500 text-center">
          <div>Type something to interact with the integrated services.</div>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-[700px] px-2">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center py-1 px-2 text-sm text-neutral-300"
              onClick={() => {
                setInput("List GitHub branches");
              }}
            >
              List GitHub branches
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center py-1 px-2 text-sm text-neutral-300"
              onClick={() => {
                setInput("List Slack channels");
              }}
            >
              List Slack channels
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center py-1 px-2 text-sm text-neutral-300"
              onClick={() => {
                setInput("List Jira tasks");
              }}
            >
              List Jira tasks
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center py-1 px-2 text-sm text-neutral-300"
              onClick={() => {
                setInput("List upcoming calendar events");
              }}
            >
              List upcoming calendar events
            </Button>
          </div>
        </div>
      )}
      <ScrollArea className="flex-1 overflow-auto px-4">
        <div key={"permMessages"} className="space-y-4 my-4">
          {messages.map((message) => (
            <AiMessage key={`realMessage-${message.id}`} message={message} />
          ))}
        </div>
        {isLoading && response && <AiMessage key="final" message={response} />}
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        {isLoading && response?.toolCalls && response.toolCalls.length > 0 && (
          <div className="text-sm text-neutral-500 max-h-10 max-w-full text-ellipsis overflow-hidden">
            <strong>Tool:</strong>{" "}
            {response.toolCalls[response.toolCalls.length - 1]}
          </div>
        )}
        <div key={"tempMessage"} ref={messagesEndRef} />
      </ScrollArea>
      <div className="p-4">
        <div className="flex items-center gap-2 p-1 pr-3 rounded-2xl bg-neutral-800">
          <Textarea
            autoFocus
            ref={inputRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1} // ← start off at 3 lines tall
            className="resize-none max-h-[200px] !border-none bg-transparent"
            style={{ boxShadow: "none" }}
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-full w-8 h-8"
            disabled={isLoading || !input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
