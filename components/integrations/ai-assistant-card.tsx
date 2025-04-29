import { Card } from "@/components/ui/card";
import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function AiAssistantCard() {
  return (
    <Link href="/dashboard/ai" className="block group mb-6">
      <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] w-full">
        <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 p-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-4 md:p-5 flex-shrink-0">
                <RocketIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>

              <div className="flex-grow space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  AI Assistant
                </h2>
                <p className="text-white/90 text-sm md:text-base max-w-3xl">
                  Get instant help, generate content, analyze data, and automate
                  tasks with your personal AI assistant.
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white group-hover:bg-white/30 transition-colors">
                Open Assistant
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
