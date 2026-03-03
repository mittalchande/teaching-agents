from pydantic import BaseModel, Field
from typing import List, Literal

class ConversationRequest(BaseModel):
    topic:str
    student_level: Literal['beginner','intermediate','advanced'] = 'beginner'
    num_turns: int = Field(default=3,ge=1,le=5)
    with_audio: bool = False

class AgentMessage(BaseModel):
    role: Literal['teacher', 'student']
    content: str

class OrchestratorDecision(BaseModel):
    turn: int
    decision: str
    hint: str

class ConversationResponse(BaseModel):
    messages: List[AgentMessage]
    audio_clips: List[str]  # List of URLs or base64-encoded audio clips
    evaluation:str
    orchestrator_decisions: List[OrchestratorDecision] = []