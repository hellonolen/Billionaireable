import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Transcripts() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const { data: transcripts, refetch } = trpc.aiCompanion.getHistory.useQuery({
    limit: 1000,
  });

  const deleteMutation = trpc.aiCompanion.deleteConversation.useMutation({
    onSuccess: () => {
      toast.success("Conversation deleted");
      refetch();
    },
  });

  const exportMutation = trpc.aiCompanion.exportTranscripts.useMutation({
    onSuccess: (data) => {
      // Download as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transcripts-${new Date().toISOString()}.json`;
      a.click();
      toast.success("Transcripts exported");
    },
  });

  // Group by date
  const groupedTranscripts = transcripts?.reduce((acc, t) => {
    const date = new Date(t.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, typeof transcripts>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Conversation Transcripts</h1>
            <p className="text-muted-foreground mt-2">
              All your interactions with the AI companion
            </p>
          </div>
          <Button
            onClick={() => exportMutation.mutate()}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>

        {!transcripts || transcripts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No conversations yet. Start talking to your AI companion!
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTranscripts || {}).map(([date, messages]) => (
              <Card key={date} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{date}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const firstId = messages[0]?.id;
                      if (firstId) {
                        deleteMutation.mutate({ conversationId: firstId });
                      }
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <span className="text-xs font-medium opacity-70">
                              {msg.role === "user" ? "You" : "AI Companion"}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
