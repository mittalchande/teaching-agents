from services.llm import chat

EVALUATOR_PROMPT = """

You are an expert education evaluator who is evaluation the conversation between the teacher and the student

- You will be provided with the full conversation between them and the student level
- Student can be beginner, intermediate or advanced
- Evaluate the teacher on the basis of how well she explains the student based on the level of the student
- Evaluate if the teacher  encourages student to think and engage in the conversation.
- Evaluate if the teacher if warm and polite, and always encourage the student to ask questions and express their thoughts.
- Evaluate if the student stays   relevant to the topic and the teacher's explanations
- Evaluate if the student is asking good question to learn the topic 
- Evaluate student based on how well they behave with the teacher and if they are understanding the topic well.
- Rate them out of 10 on the basis of the conversation 
- Also along with rating provide the summary of your judgement
- Provide Summary in 100 words
"""

async def evaluate_conversation(conversation: list[dict], student_level: str) -> str:
    user_message = f"""Here is the conversation between the student and the teacher, and the level of the student
                    Student level:{student_level}\n\nFull Conversation: {conversation}"""

    
    messages = [
        {"role": "user", "content": user_message}
    ]

    return await chat(EVALUATOR_PROMPT, messages)