"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import AiReloadButton from "./ai-reload-button";

// Mock data for chat history
// In a real app, this would come from an API call
const mockChatHistory = [
  { id: "1", title: "Project planning assistance", date: "2 hours ago" },
  { id: "2", title: "GitHub issue analysis", date: "Yesterday" },
  { id: "3", title: "Meeting summary generation", date: "2 days ago" },
  { id: "4", title: "Code review help", date: "3 days ago" },
  { id: "5", title: "Task prioritization", date: "1 week ago" },
  { id: "6", title: "Sprint planning", date: "1 week ago" },
  { id: "7", title: "Bug troubleshooting", date: "2 weeks ago" },
  { id: "8", title: "API integration questions", date: "2 weeks ago" },
  { id: "9", title: "Performance optimization", date: "3 weeks ago" },
  { id: "10", title: "Deployment strategy", date: "1 month ago" },
];

export function AiSidebar() {
  const pathname = usePathname();
  const [chatHistory, setChatHistory] = useState(mockChatHistory);

  const deleteChat = (id: string) => {
    setChatHistory(chatHistory.filter((chat) => chat.id !== id));
  };

  return (
    <Sidebar className="border-r flex-shrink-0 h-full" collapsible="none">
      <SidebarHeader className="p-4">
        <AiReloadButton />
      </SidebarHeader>
      <SidebarContent className="h-full flex-shrink-0">
        <ScrollArea className="h-full">
          <SidebarMenu className="px-2 gap-2 flex-shrink-0">
            {chatHistory.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/dashboard/ai/${chat.id}`}
                  className="pr-10 flex-shrink-0"
                >
                  <Link href={`/dashboard/ai/${chat.id}`}>
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="truncate">{chat.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {chat.date}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteChat(chat.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
