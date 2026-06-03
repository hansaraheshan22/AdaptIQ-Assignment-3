# AdaptIQ

**Study Smart. Not Harder.**

A personalised AI-powered adaptive quiz platform for university students. Built for BUS4012 Vibe Coding for Startups — Assignment 3, La Trobe Business School.

## Features

- **Sign Up** with university email (.edu.au validation)
- **Select Subjects** — Cyber Security or Vibe Coding
- **Upload Notes** — drag-and-drop PDF/TXT upload zone
- **Adaptive Quiz** — 5 subject-specific questions with instant feedback
- **Results Confirmation** — score saved to Supabase database
- **Progress Dashboard** — real-time stats retrieved from Supabase

## Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | React (Vite) — port 5173 |
| Backend   | Python FastAPI — port 8000 |
| Database  | Supabase (PostgreSQL) |
| Auth      | bcrypt + FastAPI (no auth library) |
| Styling   | Plain CSS (Bangers + Poppins fonts) |
| Routing   | React Router v6       |

## Project Structure

```
adaptiq-a3/
├── frontend/          # React Vite app
│   ├── src/
│   │   ├── context/   # UserContext (React Context)
│   │   ├── pages/     # 8 screen components
│   │   └── styles/    # global.css
│   ├── .env           # VITE_API_URL
│   └── package.json
├── backend/           # Python FastAPI app
│   ├── routes/        # auth, subjects, results routers
│   ├── database.py    # Supabase client
│   ├── main.py        # FastAPI app entry
│   ├── .env           # SUPABASE_URL, SUPABASE_KEY
│   └── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- A Supabase project with tables: `users`, `subject_selections`, `quiz_results`

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Fill in your Supabase credentials
cp .env .env.local
# Edit .env with your SUPABASE_URL and SUPABASE_KEY

uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Environment Variables

**Backend (.env):**
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-role-key
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

## Supabase Table Schema

### users
| Column     | Type      | Notes              |
|------------|-----------|--------------------|
| id         | uuid      | Primary key        |
| full_name  | text      |                    |
| email      | text      | Unique             |
| password_hash | text   | bcrypt hash        |
| created_at | timestamp | Auto-generated     |

### subject_selections
| Column     | Type      | Notes              |
|------------|-----------|--------------------|
| id         | uuid      | Primary key        |
| user_id    | uuid      | FK → users         |
| subject    | text      |                    |
| created_at | timestamp | Auto-generated     |

### quiz_results
| Column            | Type      | Notes              |
|-------------------|-----------|--------------------|
| id                | uuid      | Primary key        |
| user_id           | uuid      | FK → users         |
| total_questions    | int       |                    |
| correct_answers    | int       |                    |
| wrong_answers      | int       |                    |
| session_result     | float     | Percentage         |
| improvement_level  | int       |                    |
| difficulty_level   | text      |                    |
| subject           | text      |                    |
| completed_at       | timestamp | Auto-generated     |

## API Endpoints

| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| GET    | `/`               | Health check                   |
| POST   | `/auth/signup`    | Create account                 |
| POST   | `/auth/login`     | Log in                         |
| POST   | `/subjects/`      | Save subject selection         |
| POST   | `/results/`       | Save quiz results              |
| GET    | `/results/{id}`   | Get user's quiz results        |

## Design System

- **Primary Purple:** #7B2FFF
- **Cyan:** #00BFFF
- **Dark Purple:** #5A00CC
- **Light Purple Input:** #E8E0FF
- **Headings Font:** Bangers (Google Fonts)
- **Body Font:** Poppins (Google Fonts)
- **Layout:** Mobile-first, max-width 390px, iPhone-style frame

## License

Built for educational purposes — BUS4012 La Trobe University.