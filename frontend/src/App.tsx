import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from "react-markdown";

interface AgentMessage {
  role: "teacher" | "student";
  content: string;
}

interface ConversationResponse {
  messages: AgentMessage[];
  audio_clips: string[];
  evaluation: string;
}

function b64ToAudio(b64: string): HTMLAudioElement {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: "audio/mpeg" });
  return new Audio(URL.createObjectURL(blob));
}

async function playClipsInSequence(clips: string[]) {
  for (const clip of clips) {
    const audio = b64ToAudio(clip);
    await new Promise<void>((resolve) => {
      audio.onended = () => resolve(); // audio finished normally
      audio.onerror = () => resolve(); // audio failed, skip and continue
      audio.play().catch(() => resolve()); // play() itself failed, skip
    });
  }
}

function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  );
  const [numTurns, setNumTurns] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [evaluation, setEvaluation] = useState("");
  const [withAudio, setWithAudio] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setError("");
    setMessages([]);
    setLoading(true);
    setEvaluation("");

    try {
      const res = await fetch("http://localhost:8000/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          student_level: level,
          num_turns: parseInt(numTurns),
          with_audio: withAudio,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail ?? "Something went wrong");
      }

      const data: ConversationResponse = await res.json();
      setMessages(data.messages);
      setEvaluation(data.evaluation);

      // Play audio after messages are shown and if withAudio is true
      if (withAudio && data.audio_clips.length > 0) {
        setIsPlaying(true);
        await playClipsInSequence(data.audio_clips);
        setIsPlaying(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex overflow-hidden font-sans"
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      {/* 1. SETUP BAR (Left) */}
      <aside className="w-80 border-r border-white/10 p-6 flex flex-col shrink-0 backdrop-blur-sm bg-black/10">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
            AI Studio
          </h1>
          <p className="text-indigo-300 text-[10px] tracking-[0.2em] uppercase mt-1">
            Teacher x Student
          </p>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-2">
            <Label className="text-indigo-100 text-xs font-bold uppercase tracking-wider">
              Topic
            </Label>
            <Input
              id="topic"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/20"
              value={topic}
              placeholder="e.g. Quantum Physics"
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-indigo-100 text-xs font-bold uppercase tracking-wider">
              Level
            </Label>
            <Select
              value={level}
              onValueChange={(v) => setLevel(v as typeof level)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-indigo-100 text-xs font-bold uppercase tracking-wider">
              Turns
            </Label>
            <Select value={numTurns} onValueChange={setNumTurns}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="turns" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem value={String(n)} key={n}>
                    {n} Turns
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch
              id="enable-voice"
              checked={withAudio}
              onCheckedChange={setWithAudio}
            />
            <Label
              htmlFor="enable-voice"
              className="text-white text-xs cursor-pointer"
            >
              Enable Voice
            </Label>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
          {isPlaying && (
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest animate-pulse mb-4 text-center">
              🔊 Streaming Audio
            </p>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Generating..." : "Start Conversation"}
          </Button>
        </div>
      </aside>

      {/* 2. CHAT BAR (Middle) */}
      <section className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center pt-20">
              <p className="text-indigo-300/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                {loading ? "Processing Stream" : "Awaiting Simulation"}
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 ${msg.role === "student" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg ${
                  msg.role === "teacher" ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                {msg.role === "teacher" ? "T" : "S"}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-md ${
                  msg.role === "teacher"
                    ? "bg-blue-100 text-blue-900 rounded-tl-none"
                    : "bg-gray-100 text-gray-900 rounded-tr-none"
                }`}
              >
                <p className="font-black text-[9px] mb-1 uppercase tracking-widest opacity-50">
                  {msg.role}
                </p>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </section>

      {/* 3. EVALUATION BAR (Right) */}
      <aside className="w-96 border-l border-white/10 p-8 flex flex-col shrink-0 bg-black/20 backdrop-blur-md overflow-y-auto">
        <h2 className="text-white text-sm font-black uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">
          Evaluation
        </h2>
        {evaluation ? (
          <div className="text-indigo-50 text-[13px] prose-sm prose-invert leading-relaxed antialiased">
            <ReactMarkdown>{evaluation}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-indigo-200/20 text-xs italic">
            Run a conversation to see the evaluator agent analysis here.
          </p>
        )}
      </aside>
    </div>
  );
}

export default App;
