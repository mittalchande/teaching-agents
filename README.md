A sophisticated educational platform powered by Agentic RAG and Multi-Agent Orchestration. This studio simulates a classroom environment where specialized AI agents collaborate to provide personalized learning experiences with integrated voice synthesis.

🌟 Key Features
Agentic RAG Architecture: Unlike standard RAG, this system uses agents to intelligently search, verify, and synthesize information from sources like Wikipedia and web search before delivering content.

Tri-Agent Orchestration:

Teacher Agent: Orchestrates the lesson plan and delivers primary instruction.

Student Agent: Simulates learner personas to test the clarity of instruction.

Evaluator Agent: Critiques the interaction to ensure educational goals are met.

Voice Synthesis: Integrated audio feedback for a more immersive and accessible learning experience.

Modern Full-Stack: Built with FastAPI for high-performance agentic logic and React/Vite with shadcn/ui for a sleek, responsive interface.

🛠️ Tech Stack
Backend: Python, FastAPI, OpenAI GPT-4o-mini, Anthropic Claude.

Frontend: TypeScript, React, Vite, Tailwind CSS, shadcn/ui.

Tools: Agentic RAG (Search/Wikipedia tools), ElevenLabs (Voice Synthesis).

🚀 Getting Started
Clone the repo:

Bash
git clone https://github.com/mittalchande/teaching-agents.git
Environment Setup:
Create a .env in the backend/ directory (refer to .gitignore for security best practices):

Plaintext
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
Run Backend: pip install -r requirements.txt && uvicorn main:app --reload

Run Frontend: npm install && npm run dev
