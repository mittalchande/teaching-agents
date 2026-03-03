import json

from services.search import search_web
from services.llm import chat,chat_with_tools
from services.wikipedia import search_wikipedia

TEACHER_PROMPT = """
You are a expert, enthusiatic and patient teacher who is trying to help a student learn a new topic with voice conversations. 

Rules you must follow:
- Keep every response concise and to the point, with a maximum of 3 sentences.
- Always endyour response with exactly one question to the student, to encourage them to think and engage in the conversation.
- Adapts your language complexity to the student's level of understanding, starting with simple explanations and gradually increasing complexity as the student learns.
- Never repeat same information you have already provided, unless the student asks for clarification or you think it is necessary to reinforce a concept.
- Never use bullet points or lists — speak in natural sentences as if talking out loud.
- Do not start your response with 'Teacher:' or any role label. Just respond directly.
- Be warm and polite, and always encourage the student to ask questions and express their thoughts.
"""


TOOLS = [
    {
        "type":"function",
        "function":{
            "name":"web_search",
            "description":"Search the web for current, up to date information about a topic. Use this for recent events or facts that may have changed.",
            "parameters": {
                "type":"object",
                "properties":{
                    "query":{
                        "type":"string",
                        "description":"The search query"
                    }
                
                },
                "required": ["query"]
            }
        }
    },
    {
        "type":"function",
        "function":{
            "name":"wikipedia",
            "description":"Get a structured summary from Wikipedia. Always use this for any scientific, historical, or educational topic to ensure accuracy.",
            "parameters": {
                "type":"object",
                "properties":{
                    "topic":{
                        "type":"string",
                        "description":"The topic to look up"
                    }
                
                },
                "required": ["topic"]
            }
        }
    }
]



async def teacher_respond(topic:str, student_level:str, conversation_history:list[dict], is_opening:bool = False) -> str:
    if is_opening:
        user_message = ( f"Start teaching a student about {topic} at a {student_level} level."
                        "Open witth a interesting hook and end with your first question to the student.")
    else:
        user_message = ( f"Continue teaching the student about {topic} at a {student_level} level."
                        "Respond to what the student just said and move the lesson forward.")
        
    messages = [
        *conversation_history,
        {"role": "user", "content": user_message}
    ]

    
    # Step 1 : Send to GPT with tools available
    response = await chat_with_tools(TEACHER_PROMPT, messages, TOOLS)

    #Step 2 : Check if GPT wants to call a tool
    if response.stop_reason == "tool_use":
        tool_name = response.tool_name
        tool_args = response.tool_args

    
        #Step 3: Run the tool
        if tool_name == "web_search":
            tool_result = search_web(tool_args["query"])
        elif tool_name  == "wikipedia":
            tool_result = search_wikipedia(tool_args["topic"])
        else:
            tool_result = "Tool not found"


        #Step 4: Send result back to GPT
        messages.append({
            "role": "assistant",
            "content": None,
            "tool_calls": [
                {
                    "id": response.tool_call_id,
                    "type": "function",
                    "function": {
                        "name": response.tool_name,
                        "arguments": json.dumps(response.tool_args)
                    }
                }
            ]
        })
        messages.append({"role":"tool", "content": tool_result, "tool_call_id": response.tool_call_id})
        
        #Step 5: Get final response
        return await chat(TEACHER_PROMPT, messages)

    # If no tool needed, return directly
    return response.text

