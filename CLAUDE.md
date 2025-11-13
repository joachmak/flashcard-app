# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SciCard is a flashcard application with support for LaTeX, code formatting, images, and markdown. It's built as a full-stack application with a React frontend and Django REST Framework backend.

**Key Features:**
- LaTeX formatting using `~` delimiters
- Code formatting with syntax highlighting (using ``` delimiters)
- Image support for flashcards
- Markdown rendering
- Spaced repetition scoring system

## Architecture

### Backend (Django)

Located in `backend/quizlet/`, this is a Django 4.0 project with Django REST Framework.

**Database:** SQLite (`temp.db` in the quizlet directory)

**Django Apps:**
- `learning` - Core flashcard functionality (sets, cards, folders, images)
- `accounts` - User authentication using SimpleJWT

**Data Models:**
- `Set`: Flashcard sets with title, description, folder relationship
- `Card`: Individual flashcards with term, definition, score, and last_practiced timestamp
- `Folder`: Optional organizational structure for sets
- `Image`: Image attachments that can belong to either term or definition side of cards

**API Endpoints:**
- `/learning/sets/` - Set CRUD operations
- `/learning/cards/` - Card CRUD operations
- `/learning/images/` - Image upload/management
- `/accounts/` - Authentication endpoints

**CORS Configuration:** Frontend allowed at `http://localhost:3000`

### Frontend (React + TypeScript)

Located in `frontend/`, this is a Create React App with TypeScript.

**Key Libraries:**
- React Router for navigation
- Mantine UI components (@mantine/core, @mantine/prism, @mantine/notifications)
- KaTeX for LaTeX rendering
- Marked for markdown parsing
- Prism.js for code syntax highlighting

**Routing Structure:**
- `/` - Home page (set list)
- `/add_set` - Create new set
- `/edit_set/:id` - Edit existing set
- `/view_set/:id` - View cards in a set
- `/practice/:id` - Practice mode for a set

**Text Parsing System:**
The `parseCardText` function in `frontend/src/utils/utils.tsx` handles special formatting:
1. Text between `~` delimiters is rendered as LaTeX using KaTeX
2. Text between ``` delimiters is rendered as code blocks with syntax highlighting
3. All other text is parsed as markdown
4. These can be nested (markdown can contain LaTeX and code blocks)

**Scoring System:**
Cards have a score (0-100) that affects practice frequency:
- Correct answer: `+35` points (capped at 100)
- Incorrect answer: `-50` points (floored at 0)

**State Management:**
- React Context (`AppContext`) stores the currently active set
- No Redux or other state management library

## Development Commands

### Backend

```bash
# Navigate to backend directory
cd backend/quizlet

# Install dependencies (create virtual environment first)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server (runs on port 8000)
python manage.py runserver

# Create superuser for admin access
python manage.py createsuperuser

# Make new migrations after model changes
python manage.py makemigrations

# Access admin panel
# http://127.0.0.1:8000/admin/
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 3000)
npm start

# Run tests
npm test

# Build for production
npm build

# Format code with prettier
npm run pretty
```

## Important Notes

**Proxy Configuration:** The frontend package.json proxies API requests to `http://127.0.0.1:8000`, so relative API URLs work in development.

**Authentication:** The app uses JWT tokens (SimpleJWT) for authentication. The REST Framework is configured to require JWT authentication by default.

**Media Files:** Uploaded images are stored in `backend/mediafiles/` (outside the quizlet directory) and served at `/media/` URL path.

**Database:** Currently using SQLite for simplicity. The database file is `backend/quizlet/temp.db`.

**Supported Code Languages:** See `frontend/src/utils/constants.ts` for the full list of supported syntax highlighting languages (33+ languages including Python, JavaScript, TypeScript, Go, etc.).
