import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Mic, MicOff, Settings } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export function AICompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { data: history, refetch: refetchHistory } = trpc.aiCompanion.getHistory.useQuery(
    { limit: 50 },
    { enabled: isOpen }
  );

  const { data: settings, refetch: refetchSettings } = trpc.aiCompanion.getSettings.useQuery(
    undefined,
    { enabled: isOpen }
  );

  const chatMutation = trpc.aiCompanion.chat.useMutation({
    onSuccess: () => {
      refetchHistory();
      setMessage("");
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });

  const updateSettingsMutation = trpc.aiCompanion.updateSettings.useMutation({
    onSuccess: () => {
      refetchSettings();
      toast.success("Settings updated");
    },
  });

  const saveTranscriptionMutation = trpc.aiCompanion.saveVoiceTranscription.useMutation({
    onSuccess: () => {
      toast.success("Voice saved and analyzed");
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        
        // Save transcription
        if (settings?.voiceListeningEnabled) {
          saveTranscriptionMutation.mutate({
            transcript,
            duration: 0,
          });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings?.voiceListeningEnabled]);

  // Auto-start listening if enabled
  useEffect(() => {
    if (settings?.voiceListeningEnabled && recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
      }
    }
  }, [settings?.voiceListeningEnabled]);

  const handleSend = () => {
    if (!message.trim()) return;
    chatMutation.mutate({ message: message.trim() });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        toast.error("Failed to start listening");
      }
    }
  };

  const messages: Message[] = history?.map((h) => ({
    role: h.role as "user" | "assistant",
    content: h.content,
    createdAt: h.createdAt.toISOString(),
  })) || [];

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">AI Companion</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">Start a conversation with your AI companion</p>
                  <p className="text-xs mt-2">I know everything about you and I'm here to help</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={toggleListening}
                disabled={!settings?.voiceListeningEnabled}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || chatMutation.isPending}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isListening && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Listening... (all conversations are saved and analyzed)
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Companion Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Voice Listening</Label>
                <p className="text-sm text-muted-foreground">
                  Always listen and analyze conversations
                </p>
              </div>
              <Switch
                checked={settings?.voiceListeningEnabled ?? true}
                onCheckedChange={(checked) =>
                  updateSettingsMutation.mutate({ voiceListeningEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Proactive Insights</Label>
                <p className="text-sm text-muted-foreground">
                  Get insights without asking
                </p>
              </div>
              <Switch
                checked={settings?.proactiveInsightsEnabled ?? true}
                onCheckedChange={(checked) =>
                  updateSettingsMutation.mutate({ proactiveInsightsEnabled: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Personality Style</Label>
              <Select
                value={settings?.personalityStyle ?? "balanced"}
                onValueChange={(value: any) =>
                  updateSettingsMutation.mutate({ personalityStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supportive">Supportive</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="challenging">Challenging</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={settings?.preferredLanguage ?? "en"}
                onValueChange={(value) =>
                  updateSettingsMutation.mutate({ preferredLanguage: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
