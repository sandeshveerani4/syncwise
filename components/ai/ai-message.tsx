import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

type MessageProps = {
  message: {
    role: "user" | "assistant";
    content: string;
  };
};

export function AiMessage({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 text-sm",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* <Avatar className="h-8 w-8">
         {isUser ? (
          <>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </>
        )}
      </Avatar> */}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-3 py-2",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          <Markdown>{message.content}</Markdown>
        </div>
        {/* <span className="text-xs text-muted-foreground">{time}</span> */}
      </div>
    </div>
  );
}
