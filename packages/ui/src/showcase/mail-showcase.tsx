import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Archive, Inbox, Send, Trash2 } from "lucide-react";

const folders = [
  { label: "Inbox", count: 128, active: true },
  { label: "Drafts", count: 9, active: false },
  { label: "Sent", count: 0, active: false },
  { label: "Junk", count: 23, active: false },
  { label: "Trash", count: 0, active: false },
  { label: "Archive", count: 0, active: false },
];

type Thread = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  tags: string[];
  selected?: boolean;
};

const threads: Thread[] = [
  {
    id: "1",
    from: "William Smith",
    subject: "Meeting Tomorrow",
    preview: "Hi, let's sync on the roadmap…",
    time: "2d ago",
    tags: ["meeting", "work"],
  },
  {
    id: "2",
    from: "Bob Johnson",
    subject: "Weekend Plans",
    preview: "Are you free Saturday afternoon?",
    time: "3d ago",
    tags: ["personal"],
    selected: true,
  },
  {
    id: "3",
    from: "Emma Davis",
    subject: "Invoice #1042",
    preview: "Please find the attached PDF…",
    time: "1w ago",
    tags: ["important"],
  },
];

/**
 * Three-pane mail layout inspired by the Tweakcn “Mail” preview (no official Shadcn mail block in the registry).
 */
export function MailShowcase() {
  return (
    <div className="bg-background text-foreground">
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-[min(720px,85vh)] w-full max-w-[1200px] rounded-lg border md:min-h-[640px]"
      >
        <ResizablePanel defaultSize={22} minSize={16} className="flex flex-col border-r">
          <div className="p-3 font-medium">Mail</div>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-0.5 p-2">
              {folders.map((f) => (
                <Button
                  key={f.label}
                  variant={f.active ? "secondary" : "ghost"}
                  className="justify-between"
                  size="sm"
                >
                  <span className="flex items-center gap-2">
                    {f.label === "Inbox" ? <Inbox className="size-4" /> : null}
                    {f.label}
                  </span>
                  <span className="text-muted-foreground text-xs">{f.count}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={38} minSize={28}>
          <div className="flex h-full flex-col border-r">
            <div className="flex items-center justify-between gap-2 border-b p-3">
              <span className="font-semibold">Inbox</span>
              <Button variant="outline" size="sm">
                Unread
              </Button>
            </div>
            <div className="border-b p-2">
              <Input placeholder="Search" className="h-8" />
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={
                      t.selected
                        ? "border-l-primary bg-accent/40 w-full border-l-2 p-3 text-left"
                        : "hover:bg-muted/50 w-full border-l-2 border-l-transparent p-3 text-left"
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{t.from}</div>
                        <div className="text-muted-foreground text-sm">{t.subject}</div>
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                          {t.preview}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {t.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="text-muted-foreground shrink-0 text-xs">{t.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-1 border-b p-2">
              <Button variant="ghost" size="icon" aria-label="Archive">
                <Archive className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Trash">
                <Trash2 className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Send">
                <Send className="size-4" />
              </Button>
            </div>
            <div className="flex items-start gap-3 border-b p-4">
              <Avatar>
                <AvatarFallback>BJ</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">Bob Johnson</div>
                <div className="text-muted-foreground text-sm">Weekend Plans</div>
                <div className="text-muted-foreground text-xs">reply-to@example.com</div>
              </div>
              <div className="text-muted-foreground shrink-0 text-xs">Apr 10, 2023</div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <p className="text-sm leading-relaxed">
                Hi there — hope you are doing well. Let me know if Saturday works for a quick walk
                through the park. We can grab coffee afterward.
              </p>
            </ScrollArea>
            <div className="mt-auto border-t p-3">
              <div className="mb-3 flex items-center gap-2">
                <Switch id="mute" />
                <label htmlFor="mute" className="text-muted-foreground text-sm">
                  Mute this thread
                </label>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Reply to Bob Johnson…" className="flex-1" />
                <Button>Send</Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
