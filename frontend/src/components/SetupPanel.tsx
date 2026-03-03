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
import { Switch } from "@/components/ui/switch";

interface SetupPanelProps {
  topic: string;
  setTopic: (value: string) => void;
  level: "beginner" | "intermediate" | "advanced";
  setLevel: (value: "beginner" | "intermediate" | "advanced") => void;
  numTurns: string;
  setNumTurns: (value: string) => void;
  withAudio: boolean;
  setWithAudio: (value: boolean) => void;
  loading: boolean;
  isPlaying: boolean;
  error: string;
  handleSubmit: () => void;
}

const SetupPanel = ({
  topic,
  setTopic,
  level,
  setLevel,
  numTurns,
  setNumTurns,
  withAudio,
  setWithAudio,
  loading,
  isPlaying,
  error,
  handleSubmit,
}: SetupPanelProps) => {
  return (
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
  );
};

export default SetupPanel;
