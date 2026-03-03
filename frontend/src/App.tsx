import { useEffect, useRef, useState } from "react";
import "./App.css";
import EvaluationPanel from "./components/EvaluationPanel";
import SetupPanel from "./components/SetupPanel";
import ChatPanel from "./components/ChatPanel";
import type {
  AgentMessage,
  ConversationResponse,
  OrchestratorDecision,
} from "@/types";

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
  const [numTurns, setNumTurns] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [evaluation, setEvaluation] = useState("");
  const [withAudio, setWithAudio] = useState(false);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  );
  const [orchestratorDecisions, setOrchestratorDecisions] = useState<
    OrchestratorDecision[]
  >([]);
  const bottomRef = useRef<HTMLDivElement>(null);

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
      setOrchestratorDecisions(data.orchestrator_decisions);

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
      <SetupPanel
        topic={topic}
        setTopic={setTopic}
        level={level}
        setLevel={setLevel}
        numTurns={numTurns}
        setNumTurns={setNumTurns}
        withAudio={withAudio}
        setWithAudio={setWithAudio}
        isPlaying={isPlaying}
        error={error}
        loading={loading}
        handleSubmit={handleSubmit}
      />

      {/* 2. CHAT BAR (Middle) */}
      <ChatPanel
        messages={messages}
        orchestratorDecisions={orchestratorDecisions}
        loading={loading}
        bottomRef={bottomRef}
      />

      {/* 3. EVALUATION BAR (Right) */}
      <EvaluationPanel evaluation={evaluation} />
    </div>
  );
}

export default App;
