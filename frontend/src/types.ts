export interface AgentMessage {
    role: "teacher" | "student";
    content: string;
}

export interface OrchestratorDecision {
    turn: number;
    decision: string;
    hint: string;
}

export interface ConversationResponse {
    messages: AgentMessage[];
    audio_clips: string[];
    evaluation: string;
    orchestrator_decisions: OrchestratorDecision[];
}