FinNews AI – Financial News Simplifier
Tagline: Complex Financial News. Made Simple.

FinNews AI is a production-grade web application designed to make complex financial, economic, and business news effortlessly understandable for students, retail investors, beginners, and busy professionals.

🌟 Key Features
Live & Curated Financial News: Real-time business news across Markets, Economy, Technology, Banking, Global Markets, Startups, and Cryptocurrency.
AI-Powered Simplification: Employs Large Language Models (Groq Llama 3.3 70B & Google Gemini 3.8 Flash) to translate technical financial jargon into plain English without losing crucial data.
Structured Explanations:
Simplified Headlines
Executive TL;DR
What Happened? (Objective facts)
Why It Matters (Impact on interest rates, loans, jobs, stock portfolios)
Key Takeaway Bullets
Jargon Buster (Key financial terms with simple definitions)
Interactive Custom Simplifier: Paste any complex article, press release, or financial textbook snippet to get instant AI breakdowns.
Financial Term Explainer: Quick lookup for terms like Basis Points, Yield Curve, Core CPI, Quantitative Easing, and CapEx.
Zero API Key Exposure: All API keys remain isolated in backend server environments.
High Reliability & Resilience: Automatic graceful fallbacks for offline development and rate-limited API tiers.
🏗️ System Architecture
                       ┌────────────────────────────────┐
                       │        FinNews AI Client       │
                       │   (React 19 + Tailwind CSS)    │
                       └───────────────┬────────────────┘
                                       │ REST / JSON
                                       ▼
                       ┌────────────────────────────────┐
                       │     Full-Stack Server / API    │
                       │     (Express / FastAPI)        │
                       └───────┬───────────────┬────────┘
                               │               │
            ┌──────────────────▼──┐         ┌──▼─────────────────┐
            │      News Engine    │         │     AI Engine      │
            │  - NewsAPI.org      │         │  - Groq LLaMA 3.3  │
            │  - Curated Datasets │         │  - Google Gemini   │
            └─────────────────────┘         └────────────────────┘
📁 Project Structure
finnews-ai/
│
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # FastAPI application entrypoint
│   ├── config.py             # Settings and environment variables
│   ├── schemas.py            # Pydantic data models
│   ├── routes/
│   │   ├── health.py         # /api/health
│   │   ├── news.py           # /api/news & /api/news/simplified
│   │   └── ai.py             # /api/simplify
│   ├── services/
│   │   ├── news_service.py   # NewsAPI & feed handling
│   │   └── ai_service.py     # Groq & LLM simplification logic
│   └── requirements.txt      # Python dependencies
│
├── src/                      # Frontend Application (React 19 + TypeScript)
│   ├── components/
│   │   ├── Navbar.tsx        # Top navigation & status pill
│   │   ├── HeroSection.tsx   # Landing hero & market pulse preview
│   │   ├── FeatureCards.tsx  # 3 Key feature highlights
│   │   ├── HowItWorks.tsx    # 4-step visual workflow
│   │   ├── StatsBar.tsx      # Live session stats
│   │   ├── NewsGrid.tsx      # Responsive news card grid
│   │   ├── NewsCard.tsx      # Individual article card
│   │   ├── ArticleModal.tsx  # Full simplification view
│   │   ├── CustomTool.tsx    # Custom paste & simplify tool
│   │   ├── AboutSection.tsx  # Mission & tech stack overview
│   │   └── HealthModal.tsx   # Developer API status modal
│   ├── App.tsx               # Main application controller
│   ├── types.ts              # TypeScript data interfaces
│   └── main.tsx              # React mounting entrypoint
│
├── server.ts                 # Full-stack Node/Express server with Vite integration
├── server/
│   ├── aiService.ts          # Server-side Gemini & Groq simplifier
│   ├── newsService.ts        # News aggregator & filter
│   └── curatedData.ts        # Verified realistic financial news items
│
├── .env.example              # Template environment configuration
├── metadata.json             # App capabilities and metadata
├── package.json              # Node dependencies & scripts
└── README.md
⚙️ Environment Configuration
Create a .env file in the root directory:

# Optional: NewsAPI Key for live financial headlines
NEWS_API_KEY="your_news_api_key_here"

# Optional: Groq API Key for high-speed Llama 3.3 70B simplification
GROQ_API_KEY="your_groq_api_key_here"

# Auto-injected in Google AI Studio or set manually
GEMINI_API_KEY="your_gemini_api_key_here"
Note: If external API keys are omitted, FinNews AI seamlessly switches to its built-in realistic financial data and heuristic simplifier so that the application functions completely without crashing.

🚀 Running the Application
Option A: Full-Stack Mode (Node.js + Vite + Express)
This runs both the API server and the React frontend on port 3000:

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
npm start
Option B: Python FastAPI Backend Mode
If running the Python FastAPI backend separately:

# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install requirements
pip install -r backend/requirements.txt

# 3. Launch FastAPI server on port 8000
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
📡 REST API Endpoints
1. Health Check
GET /api/health

Response:
{
  "status": "healthy",
  "service": "FinNews AI",
  "version": "1.0.0",
  "active_ai": "Google Gemini (gemini-3.8-flash)",
  "providers": {
    "groq": false,
    "gemini": true,
    "newsapi": false
  },
  "timestamp": "2026-09-30T10:00:00.000Z"
}
2. Fetch Raw News
GET /api/news?category=Markets&search=Fed&page_size=10

Response:
{
  "status": "success",
  "total": 10,
  "category": "Markets",
  "articles": [...]
}
3. Simplify Custom Article
POST /api/simplify

Request Body:
{
  "title": "Federal Reserve Holds Benchmark Rate Steady",
  "description": "FOMC concludes meeting without rate change.",
  "content": "Full article text...",
  "source": "Bloomberg"
}
Response:
{
  "status": "success",
  "summary": {
    "simplified_headline": "US interest rates stay unchanged as inflation remains a concern.",
    "tldr": "The Federal Reserve kept borrowing costs steady at 5.25%-5.50%.",
    "what_happened": "Central bank officials decided not to change interest rates...",
    "why_it_matters": "Higher borrowing costs keep mortgages and car loans expensive...",
    "key_points": [
      "Rates remain at 20-year highs",
      "Inflation is cooling but core prices remain elevated"
    ],
    "financial_terms": [
      {
        "term": "Federal Funds Rate",
        "simple_explanation": "The baseline loan rate banks charge each other overnight."
      }
    ]
  }
}
4. Fetch & Simplify Combined
GET /api/news/simplified?category=Economy&page_size=6

🔒 Security Best Practices
Strict Server-Side Key Handling: API keys (NEWS_API_KEY, GROQ_API_KEY, GEMINI_API_KEY) are NEVER sent to the client browser or included in frontend assets.
Input Sanitization: Request bodies are type-checked and capped with length limitations.
CORS Protection: Restricted and verified headers.
Financial Safety Disclaimer: Clear educational disclaimer informing users that FinNews AI does not offer individualized financial or investment advice.
🔮 Future Enhancements
📊 Live ticker tape with interactive charts (TradingView light widgets).
🎙️ Audio podcast mode using Gemini Flash TTS for hands-free news listening.
🌐 Multi-language translation into Spanish, Hindi, German, Japanese, and Mandarin.
📑 User bookmarks and portfolio watchlists saved locally or in cloud storage.
📈 Sentiment score gauge (Bullish / Neutral / Bearish rating per article).
