import asyncio
import os
from urllib import request

from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models.schemas import ConversationRequest, ConversationResponse, AgentMessage, OrchestratorDecision
from agents.student import student_respond
from agents.teacher import teacher_respond  
from services.voice import text_to_speech_b64
from agents.evaluator import evaluate_conversation
from agents.orchestrator import orchestrate

load_dotenv()

app = FastAPI(title="Teaching Agent API")

app.add_middleware(
    CORSMiddleware,     
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],        
    allow_headers=["*"]
)

TEACHER_VOICE_ID = os.getenv("TEACHER_VOICE_ID", "nova")   # fallback to nova
STUDENT_VOICE_ID = os.getenv("STUDENT_VOICE_ID", "echo")   # fallback to echo

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/conversation")
async def run_conversation(request:ConversationRequest):
    messages : list[AgentMessage] = []
    conversation_history : list[dict] = []
    audio_clips : list[str] = []
    orchestrator_hint = ""
    orchestrator_decisions: list[OrchestratorDecision] = []

    try:
        for turn in range(request.num_turns):
            is_opening = (turn == 0)
        
            # Teacher speaks first
            teacher_text = await teacher_respond(
               request.topic, 
               request.student_level, 
               conversation_history, 
               is_opening,
               orchestrator_hint
            )
           
            messages.append(AgentMessage(role="teacher", content=teacher_text))
            conversation_history.append({"role": "assistant", "content": teacher_text})

            #Student responds
            student_text = await student_respond(
                request.topic, 
                request.student_level, 
                conversation_history, 
                is_opening
            )

            messages.append(AgentMessage(role="student", content=student_text))
            conversation_history.append({"role":"user", "content":student_text})

            # Call orchestrator
            routing = await orchestrate(conversation_history, request.student_level)
            decision = routing["decision"]
            hint = routing["hint"]
            orchestrator_hint = hint
            orchestrator_decisions.append(OrchestratorDecision(decision=decision,hint=orchestrator_hint,turn=turn +1))


            # Generate audio clips for both teacher and student
            if request.with_audio:
                teacher_audio, student_audio = await asyncio.gather(
                    text_to_speech_b64(text=teacher_text, voice=TEACHER_VOICE_ID),
                    text_to_speech_b64(text=student_text, voice=STUDENT_VOICE_ID)
                )

                audio_clips.extend([teacher_audio, student_audio])

            if decision == "end":
                break

        # After loop finishes
        evaluation_summary = await evaluate_conversation(conversation_history,request.student_level)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    return ConversationResponse(messages=messages, audio_clips=audio_clips, evaluation=evaluation_summary,orchestrator_decisions=orchestrator_decisions)
