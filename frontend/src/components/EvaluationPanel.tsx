import ReactMarkdown from "react-markdown";

interface EvaluationPanelProps {
  evaluation: string;
}

const EvaluationPanel = ({ evaluation }: EvaluationPanelProps) => {
  return (
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
  );
};

export default EvaluationPanel;
