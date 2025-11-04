import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export function VoiceListener() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const processMutation = trpc.aiCompanion.processVoiceInput.useMutation({
    onSuccess: () => {
      toast.success("Voice input processed");
      setIsProcessing(false);
    },
    onError: (error) => {
      toast.error("Failed to process: " + error.message);
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setIsProcessing(true);
        await processMutation.mutateAsync({ transcript });
      };

      recognitionRef.current.onerror = (error: any) => {
        console.error("Voice recognition error:", error);
        if (error.error === "no-speech") {
          // Ignore no-speech errors in continuous mode
          return;
        }
        setIsListening(false);
        toast.error("Voice recognition error");
      };

      recognitionRef.current.onend = () => {
        // Auto-restart if still supposed to be listening
        if (isListening && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Ignore if already started
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Voice listening stopped");
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Voice listening started - I'm listening...");
      } catch (e) {
        toast.error("Failed to start voice recognition");
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleListening}
      className={`relative ${isListening ? "text-red-500" : "text-muted-foreground"}`}
      title={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
      {isProcessing && (
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      )}
    </Button>
  );
}
