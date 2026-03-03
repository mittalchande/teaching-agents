import json
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
from dataclasses import dataclass
from typing import Any

load_dotenv()

@dataclass
class ToolResponse:
    stop_reason:str           # "tool_use" or "end_turn"
    text: str | None          # final text if no tool needed
    tool_name: str | None     # which tool GPT wants to call
    tool_args: dict | None     # arguments GPT wants to pass
    tool_call_id: str | None  # needed to send result back
    raw: Any                  # raw tool call object for messages


client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def chat_with_tools(system_prompt:str, messages: list[dict], tools: list[dict]) -> ToolResponse:
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role":"system", "content": system_prompt},
            *messages
        ],
        tools=tools,
        max_tokens=1000,
        temperature=0.7
    )

    message = response.choices[0].message

    if message.tool_calls:
        tool_call = message.tool_calls[0]
        return ToolResponse(
            stop_reason="tool_use",
            text=None,
            tool_name=tool_call.function.name,
            tool_args=json.loads(tool_call.function.arguments),
            tool_call_id=tool_call.id,
            raw=message
        )
    
    return ToolResponse(
            stop_reason="end_turn",
            text=message.content,
            tool_name=None,
            tool_args=None,
            tool_call_id=None,
            raw=message
    )



async def chat(system_prompt: str, messages:list[dict]) -> str:
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            *messages
        ],
        max_tokens=1000,
        temperature=0.7,
    )
    return response.choices[0].message.content