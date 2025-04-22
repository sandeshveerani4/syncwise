"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiMessage } from "@/components/ai/ai-message";
import { SendIcon, Mic, PlusIcon, SettingsIcon, Loader2 } from "lucide-react";

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const ws = new WebSocket("ws://localhost:8000/ws/124");
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
      setIsLoading(false);
      setTool(undefined);
    };
    ws.onclose = function () {
      setIsLoading(false);
      setTool(undefined);
    };
    ws.onopen = function () {
      setIsLoading(true);
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
      <Tabs defaultValue="chat" className="flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent
          value="chat"
          className="flex-1 overflow-auto flex flex-col mt-0"
        >
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
                {isLoading && tool && <div className="text-sm">{tool}</div>}
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
                {/* <Button variant="outline" size="icon" disabled={isLoading}>
                  <Mic className="h-4 w-4" />
                </Button> */}
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
        </TabsContent>

        <TabsContent value="tasks" className="flex-1 overflow-hidden mt-0">
          <Card className="h-full p-6">
            <h3 className="text-lg font-medium mb-4">AI-Generated Tasks</h3>
            <p className="text-muted-foreground">
              Tasks generated from your conversations will appear here. Start
              chatting with the AI to create tasks.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="flex-1 overflow-hidden mt-0">
          <Card className="h-full p-6">
            <h3 className="text-lg font-medium mb-4">AI Insights</h3>
            <p className="text-muted-foreground">
              The AI will analyze your workflow and provide insights to help you
              improve productivity.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
