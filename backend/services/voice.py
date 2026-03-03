import os
import base64
from elevenlabs.client import AsyncElevenLabs
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def text_to_speech_b64(text:str, voice_id:str) -> str:
    audio_generated = await client.audio.speech.create(
        model="tts-1",
        voice=voice_id if voice_id else "alloy",
        input=text,
    )
   
    audio_data = audio_generated.content
    return base64.b64encode(audio_data).decode('utf-8')
   
