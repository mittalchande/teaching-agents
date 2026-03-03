## Multi-Agent Teaching Studio

A sophisticated educational platform powered by Agentic Tool Use and Multi-Agent Orchestration. This studio simulates a classroom environment where specialized AI agents collaborate to provide personalized learning experiences with integrated voice synthesis.

## Key Features
Agentic RAG Architecture: Unlike standard RAG, this system uses agents to autonomously search, verify, and synthesize information from sources like Wikipedia and web search to ground lessons in factual data.

Tri-Agent Orchestration:

  - Teacher Agent: Orchestrates the lesson plan and delivers primary instruction.
  
  - Student Agent: Simulates learner personas and provides a feedback loop by challenging the teacher for deeper explanations.
  
  - Evaluator Agent: Acts as an independent auditor that critiques the interaction quality after the session concludes.

Dynamic Multi-Turn Dialogue: Supports complex, stateful interactions across multiple turns, maintaining context to allow for iterative learning.

Post-Interaction Evaluation: A dedicated reflection pass where the Evaluator Agent reviews the entire conversation history to provide a pedagogical critique and learning synthesis.

Voice Synthesis: Integrated audio generation to provide an interactive and accessible multi-modal experience.

Modern Full-Stack: High-performance FastAPI backend coupled with a React/Vite and shadcn/ui frontend.


## Tech Stack & Features
Backend: Python, FastAPI.

AI Engine: OpenAI GPT-4o-mini / Anthropic.

Agent Tools: Wikipedia API, DuckDuckGo Search.

Frontend: TypeScript, React, Vite, Tailwind CSS, shadcn/ui.


## Getting Started
1. Clone the repo:

```bash
git clone https://github.com/mittalchande/teaching-agents.git
```

2. Environment Setup:
```bash 
Create a .env in the backend/ directory (refer to .gitignore for security best practices):

Plaintext
OPENAI_API_KEY=your_key_here
```

3. Launch the Studio:
```bash 

Run Backend: cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Run Frontend: cd frontend
npm install
npm run dev
```

