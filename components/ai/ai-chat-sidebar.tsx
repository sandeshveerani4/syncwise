"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  PlusIcon,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit3,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { DashboardIcon } from "@radix-ui/react-icons";

// Mock data for chat history
const mockChatHistory = [
  {
    id: "1",
    title: "Project planning assistance",
    date: "2 hours ago",
    isToday: true,
  },
  {
    id: "2",
    title: "GitHub issue analysis",
    date: "Yesterday",
    isToday: false,
  },
  {
    id: "3",
    title: "Meeting summary generation",
    date: "2 days ago",
    isToday: false,
  },
  { id: "4", title: "Code review help", date: "3 days ago", isToday: false },
  { id: "5", title: "Task prioritization", date: "1 week ago", isToday: false },
  {
    id: "6",
    title: "Sprint planning discussion",
    date: "1 week ago",
    isToday: false,
  },
  {
    id: "7",
    title: "Bug troubleshooting session",
    date: "2 weeks ago",
    isToday: false,
  },
  {
    id: "8",
    title: "API integration questions",
    date: "2 weeks ago",
    isToday: false,
  },
  {
    id: "9",
    title: "Performance optimization tips",
    date: "3 weeks ago",
    isToday: false,
  },
  {
    id: "10",
    title: "Deployment strategy planning and this that",
    date: "1 month ago",
    isToday: false,
  },
];

interface ChatSummary {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  messageCount: number;
}

interface ChatItemProps {
  chat: ChatSummary;
  isActive: boolean;
  onDelete: (id: string) => void;
  isCollapsed?: boolean;
}

function ChatItem({ chat, isActive, onDelete, isCollapsed }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  if (isCollapsed) {
    return (
      <div
        className={cn(
          "group relative rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 flex justify-center",
          isActive && "bg-neutral-100 dark:bg-neutral-800",
        )}
        title={chat.title}
      >
        <Link href={`/dashboard/ai/${chat.id}`}>
          <MessageSquare className="h-4 w-4 text-neutral-500" />
        </Link>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "group relative rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
        isActive && "bg-neutral-100 dark:bg-neutral-800",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Use CSS Grid for precise layout control */}
      <div className="grid grid-cols-[1fr_auto] items-center w-full gap-0">
        {/* Chat Link - takes available space minus menu button */}
        <Link
          href={`/dashboard/ai/${chat.id}`}
          className="flex items-center gap-2 p-3 min-w-0 overflow-hidden"
        >
          <span className="truncate text-neutral-900 dark:text-neutral-100 text-sm block">
            {chat.title}
          </span>
        </Link>

        {/* Menu Button - fixed width, always visible when hovered/active */}
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 mr-1 transition-opacity",
            isHovered || isActive ? "opacity-100" : "opacity-0",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={
                  "h-6 w-6 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Edit3 className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 dark:text-red-400"
                onClick={() => onDelete(chat.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

function SidebarContent({
  isCollapsed = false,
  onToggle,
}: SidebarContentProps) {
  const session = useSession();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const deleteChat = (id: string) => {
    // setChatHistory(chatHistory.filter((chat) => chat.id !== id));
  };
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ai/chats");

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      setChats(data.chats || []);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [pathname]);

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <Button
          asChild
          variant="ghost"
          className={cn(
            "justify-start gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all",
            isCollapsed ? "w-8 h-8 p-0 justify-center" : "w-full",
          )}
        >
          <Link
            href="/dashboard"
            title={isCollapsed ? "Back to Dashboard" : undefined}
          >
            <DashboardIcon className="h-4 w-4 shrink-0" />
            {!isCollapsed && (
              <span className="truncate">Back to Dashboard</span>
            )}
          </Link>
        </Button>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            AI Assistant
          </h2>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-6 w-6 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          className={cn(
            "justify-start gap-2 transition-all",
            isCollapsed ? "w-8 h-8 p-0" : "w-full",
          )}
          onClick={() => (window.location.href = "/dashboard/ai")}
        >
          <PlusIcon className={`h-4 w-4 ${isCollapsed ? "m-auto" : ""}`} />
          {!isCollapsed && <span className="truncate">New chat</span>}
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 px-2 pb-4">
          {chats.length > 0 && (
            <div>
              <div className="flex flex-col gap-2">
                {chats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={pathname === `/dashboard/ai/${chat.id}`}
                    onDelete={deleteChat}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-auto p-2 transition-all",
                isCollapsed
                  ? "w-8 justify-center"
                  : "w-full justify-start gap-2",
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-neutral-600 rounded-full shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {session.data?.user.name}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {session.data?.user.email}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function AiChatSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <SidebarContent isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-white dark:bg-neutral-800"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
