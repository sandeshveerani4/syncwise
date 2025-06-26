import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";

type ToolsModalProps = {
  toolCalls: string[];
  onClose: () => void;
  open?: boolean;
};

export function ToolsModal({
  toolCalls,
  onClose,
  open = true,
}: ToolsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tool Calls</DialogTitle>
          <DialogDescription>
            List of tool calls for this message.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto mt-2">
          {toolCalls.length === 0 ? (
            <div className="text-muted-foreground text-sm">No tool calls.</div>
          ) : (
            <ol className="space-y-2 m-0">
              {toolCalls.map((call, idx) => (
                <li
                  key={idx}
                  className="rounded bg-muted px-3 py-2 font-mono text-xs break-all"
                >
                  {call}
                </li>
              ))}
            </ol>
          )}
        </div>
        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
