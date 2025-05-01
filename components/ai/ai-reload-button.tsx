"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

function AiReloadButton() {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => window.location.reload()}
    >
      <RefreshCw className="h-4 w-4" />
      New Chat
    </Button>
  );
}

export default AiReloadButton;
