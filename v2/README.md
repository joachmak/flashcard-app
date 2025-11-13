# SciCard v2 - Next.js 16 Fullstack

Modern flashcard application with LaTeX, code syntax highlighting, and markdown support. Built with Next.js 16, Clerk authentication, Vercel Postgres, and Mantine UI.

## Features

- 📝 Flashcard sets with rich text support
- 🔢 LaTeX math formulas (using `~` delimiters)
- 💻 Code syntax highlighting (using ` ``` ` delimiters)
- 📄 Markdown rendering
- 🔐 Secure authentication with Clerk
- 📊 PostgreSQL database with Drizzle ORM
- ⚡ Server-side rendering with Next.js 16

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: Vercel Postgres
- **ORM**: Drizzle ORM
- **UI Library**: Mantine v7
- **Styling**: Tailwind CSS v4

## Local Development

### Prerequisites

- Node.js 20+ (or 22+)
- npm or pnpm
- A Clerk account (free tier available)
- A Vercel account (free tier available)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Clerk:**
   - Go to https://dashboard.clerk.com
   - Create a new application
   - Copy your API keys

3. **Set up Vercel Postgres:**
   - Go to https://vercel.com
   - Create a new project (or use existing)
   - Add a Postgres database in the Storage tab
   - Copy the connection strings

4. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your keys:
   ```env
   # Clerk (from dashboard.clerk.com)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Vercel Postgres (from vercel.com project settings)
   POSTGRES_URL=postgres://...
   POSTGRES_PRISMA_URL=postgres://...
   POSTGRES_URL_NON_POOLING=postgres://...
   POSTGRES_USER=...
   POSTGRES_HOST=...
   POSTGRES_PASSWORD=...
   POSTGRES_DATABASE=...
   ```

5. **Push database schema:**
   ```bash
   npm run db:push
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

7. **Open http://localhost:3000**

### Database Commands

```bash
# Push schema changes to database (for development)
npm run db:push

# Generate migrations (for production)
npm run db:generate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Deployment to Vercel

### One-Click Deploy

The easiest way to deploy is via Vercel:

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add environment variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - Postgres variables (auto-added if using Vercel Postgres)

4. **Set up database:**
   - If you haven't already, add Vercel Postgres in Storage tab
   - The environment variables will be automatically added
   - Run migrations via Vercel CLI or in a build hook

5. **Deploy:**
   - Vercel will automatically deploy on every push to main
   - Visit your deployment URL

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Project Structure

```
v2/
├── app/
│   ├── api/
│   │   └── sets/          # API routes for CRUD operations
│   ├── components/        # React components
│   │   ├── Navbar.tsx
│   │   └── SetCard.tsx
│   ├── page.tsx           # Home page (sets list)
│   ├── layout.tsx         # Root layout with Clerk & Mantine
│   └── providers.tsx      # Client providers (Mantine)
├── lib/
│   └── db/
│       ├── schema.ts      # Database schema (Drizzle)
│       ├── index.ts       # Database client
│       └── seed.ts        # Seed script
├── middleware.ts          # Clerk auth middleware
├── drizzle.config.ts      # Drizzle configuration
└── package.json
```

## Database Schema

- **sets**: Flashcard sets (title, description, userId)
- **cards**: Individual flashcards (term, definition, score, setId)
- **folders**: Optional folders for organizing sets
- **images**: Image attachments for cards

## Authentication

This app uses Clerk for authentication, which provides:
- Email/password authentication
- Social logins (Google, GitHub, etc.)
- User management
- Session management
- Security out of the box

## API Routes

- `GET /api/sets` - Get all sets for authenticated user
- `POST /api/sets` - Create a new set
- `GET /api/sets/[id]` - Get specific set with cards
- `PUT /api/sets/[id]` - Update a set
- `DELETE /api/sets/[id]` - Delete a set

## Development Tips

### Viewing your database
```bash
npm run db:studio
```
This opens Drizzle Studio at http://localhost:4983

### Adding a new table
1. Update `lib/db/schema.ts`
2. Run `npm run db:push` (dev) or `npm run db:generate` (prod)

### Debugging auth issues
- Check Clerk dashboard for user sessions
- Verify environment variables are set correctly
- Make sure middleware.ts is configured properly

## Migration from v1

This is a complete rewrite of the original React/Django app:
- Django → Next.js API Routes
- React Router → Next.js App Router
- Django ORM → Drizzle ORM
- SQLite → PostgreSQL
- JWT Auth → Clerk

## License

MIT
