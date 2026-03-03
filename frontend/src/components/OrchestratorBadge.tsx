const decisionColors: Record<string, string> = {
  continue: "bg-green-500/20 text-green-300",
  repeat: "bg-yellow-500/20 text-yellow-300",
  increase_difficulty: "bg-purple-500/20 text-purple-300",
  end: "bg-red-500/20 text-red-300",
};

interface OrchestratorBadgeProps {
  decision: string;
  hint: string;
}

const OrchestratorBadge = ({ decision, hint }: OrchestratorBadgeProps) => {
  const colorClass = decisionColors[decision] ?? "bg-white/10 text-white/60";
  return (
    decision && (
      <div className="flex justify-center my-2">
        <div className={`text-xs px-3 py-1 rounded-full ${colorClass}`}>
          🎯 {decision} — {hint}
        </div>
      </div>
    )
  );
};

export default OrchestratorBadge;
