import asyncio
import os
from urllib import request

from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models.schemas import ConversationRequest, ConversationResponse, AgentMessage
from agents.student import student_respond
from agents.teacher import teacher_respond  
from services.voice import text_to_speech_b64
from agents.evaluator import evaluate_conversation

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

    try:
        for turn in range(request.num_turns):
            is_opening = (turn == 0)

            # Teacher speaks first
            teacher_text = await teacher_respond(
               request.topic, 
               request.student_level, 
               conversation_history, 
               is_opening
            )
           
            messages.append(AgentMessage(role="teacher", content=teacher_text))
            conversation_history.append({"role":"assistant", "content": f"Teacher:{teacher_text}"})

            #Student responds
            student_text = await student_respond(
                request.topic, 
                request.student_level, 
                conversation_history, 
                is_opening
            )

            messages.append(AgentMessage(role="student", content=student_text))
            conversation_history.append({"role":"user", "content": f"Student:{student_text}"})

            # Generate audio clips for both teacher and student
            if request.with_audio:
                teacher_audio, student_audio = await asyncio.gather(
                    text_to_speech_b64(text=teacher_text, voice_id=TEACHER_VOICE_ID),
                    text_to_speech_b64(text=student_text, voice_id=STUDENT_VOICE_ID)
                )

                audio_clips.extend([teacher_audio, student_audio])

        # After loop finishes
        evaluation_summary = await evaluate_conversation(conversation_history,request.student_level)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    return ConversationResponse(messages=messages, audio_clips=audio_clips, evaluation=evaluation_summary)
