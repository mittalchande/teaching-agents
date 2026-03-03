import OrchestratorBadge from "./OrchestratorBadge";
import type { AgentMessage, OrchestratorDecision } from "@/types";
import React from "react";

interface ChatPanelProps {
  messages: AgentMessage[];
  orchestratorDecisions: OrchestratorDecision[];
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

const ChatPanel = ({
  messages,
  orchestratorDecisions,
  loading,
  bottomRef,
}: ChatPanelProps) => {
  return (
    <section className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar scroll-smooth">
      <div className="max-w-2xl mx-auto space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center pt-20 gap-4">
            {loading ? (
              <>
                {/* Spinner */}
                <div className="w-8 h-8 rounded-full border-2 border-indigo-300/20 border-t-indigo-400 animate-spin" />
                <p className="text-indigo-300/60 text-xs uppercase tracking-widest">
                  Generating conversation...
                </p>
              </>
            ) : (
              <p className="text-indigo-300/40 text-[10px] font-black uppercase tracking-[0.4em]">
                Awaiting Simulation
              </p>
            )}
          </div>
        )}
        {(() => {
          let turnCounter = 0;
          return messages.map((msg, i) => {
            if (msg.role === "student") turnCounter++;
            const decision =
              msg.role === "student"
                ? orchestratorDecisions.find((d) => d.turn === turnCounter)
                : null;

            return (
              <div key={i}>
                {/* existing message bubble */}
                <div
                  className={`flex items-start gap-4 ${msg.role === "student" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg ${
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

                {/* orchestrator badge after student message */}
                {decision && (
                  <OrchestratorBadge
                    decision={decision.decision}
                    hint={decision.hint}
                  />
                )}
              </div>
            );
          });
        })()}
        <div ref={bottomRef} />
      </div>
    </section>
  );
};

export default ChatPanel;
