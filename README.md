## Multi-Agent Teaching Studio

A sophisticated educational platform powered by Agentic RAG and Multi-Agent Orchestration. This studio simulates a classroom environment where specialized AI agents collaborate to provide personalized learning experiences with integrated voice synthesis.

## Key Features
Agentic RAG Architecture: Unlike standard RAG, this system uses agents to intelligently search, verify, and synthesize information from sources like Wikipedia and web search before delivering content.

Tri-Agent Orchestration:

Teacher Agent: Orchestrates the lesson plan and delivers primary instruction.

Student Agent: Simulates learner personas to test the clarity of instruction.

Evaluator Agent: Critiques the interaction to ensure educational goals are met.

Voice Synthesis: Integrated audio feedback for a more immersive and accessible learning experience.

Modern Full-Stack: Built with FastAPI for high-performance agentic logic and React/Vite with shadcn/ui for a sleek, responsive interface.


## Tech Stack & Features
- Agentic RAG: Implemented via autonomous tool use where agents interact with wikipedia.py and search.py to ground lessons in factual data.

- Multi-Agent Orchestration: A specialized hierarchy featuring Teacher, Student, and Evaluator agents collaborating in a feedback loop.

- Voice Synthesis: Integrated audio generation to provide an interactive, multi-modal learning experience.

- Backend: Python/FastAPI architecture designed for agentic workflows.

- Frontend: Built with React, Vite, and shadcn/ui for a professional-grade dashboard.


## Getting Started
Clone the repo:

```bash
git clone https://github.com/mittalchande/teaching-agents.git


Environment Setup:
Create a .env in the backend/ directory (refer to .gitignore for security best practices):

Plaintext
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
Run Backend: pip install -r requirements.txt && uvicorn main:app --reload

Run Frontend: npm install && npm run dev
```

