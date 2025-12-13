# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Niche Mining** is an authentication portal and marketing landing page for a suite of SEO keyword mining tools. This is NOT the actual SEO mining tool itself - it's a centralized hub that:
- Markets three different SEO mining "agents" (Google, Yandex, Bing) for different search engines and markets
- Provides centralized Google OAuth authentication
- Manages user sessions and passes authentication tokens to separate sub-project applications
- Explains the "Blue Ocean" keyword methodology (finding low-competition, high-value SEO opportunities)

## Common Commands

```bash
# Development (supports both frontend and API routes)
npm run dev              # Uses vercel dev - enables both Vite frontend and /api/* routes

# Frontend only (without API routes)
npm run dev:vite         # Pure Vite dev server, faster but no /api/* access

# Production build
npm run build            # Vite build to dist/

# Preview production build
npm run preview          # Serve dist/ locally

# Setup (first time)
vercel link              # Link to Vercel project
vercel env pull .env.local   # Pull environment variables from Vercel
```

**Important**: Use `npm run dev` (not `npm run dev:vite`) when testing authentication flows or any API endpoints, as API routes only work with `vercel dev`.

## Environment Variables

Required variables (obtain from Vercel Dashboard or `.env.local`):

```
POSTGRES_URL           # Vercel Postgres connection string
GOOGLE_CLIENT_ID       # Google OAuth client ID
GOOGLE_CLIENT_SECRET   # Google OAuth client secret
GOOGLE_REDIRECT_URI    # OAuth callback URL (e.g., http://localhost:3000/api/auth/google/callback)
JWT_SECRET             # Secret for signing JWT tokens
GEMINI_API_KEY        # (Optional) Gemini API key for future features
```

## Architecture Overview

### Frontend (React SPA)
- **Entry point**: `index.tsx` → `App.tsx`
- **Routing**: Hash-based routing (`window.location.hash`), no React Router
- **State management**: React Context API (`contexts/AuthContext.tsx`)
- **Styling**: Tailwind CSS loaded from CDN (not bundled)
- **i18n**: Manual implementation in `constants.ts` (EN/CN), no library

### Backend (Vercel Serverless Functions)
- **Location**: `/api` directory
- **Pattern**: Each file exports a default `handler(req, res)` function
- **Database**: Custom `pg` (node-postgres) implementation with tagged template literals
- **Authentication**: Custom JWT implementation using `jose` library (no NextAuth)

### Database Pattern

The codebase uses a **custom database abstraction** instead of standard Vercel Postgres pooling:

```typescript
// api/lib/db.ts
import { sql } from '../lib/db';

// Usage (parameterized queries via template literals)
const user = await sql<User>`
  SELECT * FROM users WHERE email = ${email}
`;
```

**Key details**:
- Creates a new `pg.Client` per query (acceptable in serverless)
- Auto-parameterizes values (prevents SQL injection)
- Returns `{ rows: T[] }` format
- Database tables auto-initialize on first use via `initUsersTable()`

### Authentication Flow

```
1. User clicks "Login" → /api/auth/google/login
2. Generates state (CSRF) → Redirects to Google OAuth
3. Google callback → /api/auth/google/callback
4. Exchanges code for access token → Fetches user info
5. Calls findOrCreateUser() → Generates JWT (24h expiry)
6. Redirects to frontend with ?token=xxx
7. Frontend saves to localStorage + HttpOnly cookies
8. Auto-refreshes session every 30 minutes
```

**Cross-app authentication**: When users select an SEO tool, the app:
1. Checks authentication status
2. Opens sub-project URL with token: `https://[tool].vercel.app/?token=xxx`
3. Sub-project validates token via `/api/auth/verify` endpoint (CORS enabled)

### Key Files

**Backend Core**:
- `api/lib/db.ts` - Database operations, User table schema
- `api/lib/auth.ts` - JWT token generation/verification
- `api/lib/google-oauth.ts` - Google OAuth helpers
- `api/auth/google/login.ts` - Initiates OAuth flow
- `api/auth/google/callback.ts` - Handles OAuth callback
- `api/auth/session.ts` - Gets current user session
- `api/auth/verify.ts` - Token verification for sub-projects (CORS enabled)

**Frontend Core**:
- `App.tsx` - Main app component with page routing
- `contexts/AuthContext.tsx` - Global auth state
- `components/ToolSelector.tsx` - SEO tool cards (main conversion point)
- `constants.ts` - All i18n translations (large file, 31KB)

**Configuration**:
- `vercel.json` - Vercel deployment config with API rewrites
- `vite.config.ts` - Vite config with `@/` alias and port 3000

## Database Schema

**users table** (PostgreSQL):
```sql
id           UUID PRIMARY KEY (auto-generated)
email        VARCHAR(255) UNIQUE NOT NULL
name         VARCHAR(255)
picture      VARCHAR(500)
google_id    VARCHAR(255) UNIQUE NOT NULL
created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
last_login_at TIMESTAMP

-- Indexes
idx_users_email      ON users(email)
idx_users_google_id  ON users(google_id)
```

**Database initialization**: Tables are created automatically on first user login. Can also manually initialize via `/api/init-db`.

## Security Considerations

1. **SQL Injection**: Prevented via parameterized queries in `sql` template function
2. **CSRF**: Protected via `state` parameter in OAuth flow
3. **XSS**: React auto-escapes, no `dangerouslySetInnerHTML` usage
4. **Token storage**: Dual storage (localStorage + HttpOnly cookies)
5. **CORS**: Only enabled on `/api/auth/verify` for sub-project validation
6. **Secrets**: All sensitive values in Vercel environment variables

**Potential concern**: JWT tokens passed via URL query params (`?token=xxx`) may leak in browser history/server logs. Consider using postMessage API for production.

## Important Patterns

### API Route Structure
```typescript
// api/[name].ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Authentication check (if needed)
  const token = req.headers.authorization?.replace('Bearer ', '');
  // ... verify token

  // 3. Business logic
  // ...

  // 4. Error handling
  try {
    // ...
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Component i18n Pattern
```typescript
import { TRANSLATIONS } from '@/constants';

const Hero = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return <h1>{t.hero.title}</h1>;
};
```

### Database Query Pattern
```typescript
import { sql, User } from '@/api/lib/db';

// Type-safe parameterized query
const result = await sql<User>`
  SELECT * FROM users WHERE email = ${email}
`;
const user = result.rows[0];
```

## Deployment Architecture

```
Main App (this repo)
├── Frontend → Vercel CDN (static assets from dist/)
├── API Routes → Vercel Serverless Functions
└── Database → Vercel Postgres

Sub-Projects (separate deployments)
├── google-seo-agents.vercel.app   # Google search agent
├── yandex-seo-agents.vercel.app   # Yandex search agent
└── bing-seo-agents.vercel.app     # Bing search agent

All sub-projects authenticate via this app's /api/auth/verify endpoint
```

## Common Development Scenarios

### Adding a new API endpoint
1. Create file in `/api` directory (e.g., `api/new-endpoint.ts`)
2. Export default async handler function
3. Use `sql` template for database queries
4. Return JSON responses via `res.status(200).json(...)`

### Modifying authentication logic
- Token generation: `api/lib/auth.ts`
- Google OAuth: `api/lib/google-oauth.ts`
- User database operations: `api/lib/db.ts`
- Auth flow: `api/auth/google/*.ts`

### Adding new translations
- Edit `constants.ts` file
- Add keys to both `en` and `cn` objects
- TypeScript will catch missing translations

### Styling changes
- Components use inline Tailwind classes
- Tailwind is loaded from CDN (see `index.html`)
- No build-time purging of unused classes

## Notes

- **No ORM**: Direct SQL with custom query builder
- **No auth library**: Custom JWT implementation instead of NextAuth/Passport
- **No router library**: Hash-based routing via `window.location.hash`
- **Serverless-first**: All backend code is stateless serverless functions
- **i18n**: Manual implementation, translations in `constants.ts`
