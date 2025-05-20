import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MessageProps = {
  message: {
    role: "user" | "assistant";
    content: string;
  };
};

function Pre({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const [copyOk, setCopyOk] = useState(false);
  const { toast } = useToast();
  console.log(children);

  const handleClick = () => {
    if (children) {
      try {
        navigator.clipboard.writeText((children as any).props.children);

        setCopyOk(true);
        setTimeout(() => {
          setCopyOk(false);
        }, 500);
      } catch {
        toast({
          title: "Error",
          description: "Error while copying the code",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex w-full items-center justify-end">
        <Button
          variant={"outline"}
          onClick={handleClick}
          size={"sm"}
          className="text-xs h-7 px-2"
        >
          {copyOk ? "Copied!" : "Copy code"}
        </Button>
      </div>
      {children}
    </div>
  );
}

export function AiMessage({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 text-sm",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg p-3 w-full overflow-auto",
            isUser ? "bg-neutral-700" : "bg-muted"
          )}
        >
          {isUser ? (
            message.content
          ) : (
            <Markdown
              components={{
                pre: Pre,
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline ? (
                    <SyntaxHighlighter
                      customStyle={{ borderRadius: "10px" }}
                      style={vscDarkPlus}
                      language={match ? match[1] : "html"}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
