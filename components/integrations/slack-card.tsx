import { Card } from "@/components/ui/card";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function SlackCard() {
  return (
    <Link href="/dashboard/ai?q=Slack: " className="block group">
      <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full">
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 h-full">
          <div className="flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-white/20 p-2">
                  <ChatBubbleIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Slack</h3>
              </div>
            </div>

            <p className="text-sm text-white/90 flex-grow">
              Stay on top of important conversations and turn messages into
              tasks.
            </p>

            <div className="flex items-center mt-2">
              <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white group-hover:bg-white/30 transition-colors">
                View Details
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
