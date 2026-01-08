---
description: Check Vercel status (environment variables, dev server, deployment)
---

# Vercel Status Check

This command will check:
1. Current environment variables in Vercel
2. If the dev server is running on port 3000
3. Vercel project status and recent deployments

## Steps:

### 1. Check Environment Variables

List all environment variables in the Vercel project:
```bash
vercel env ls
```

Pull current environment variables to `.env.local`:
```bash
vercel env pull .env.local
```

### 2. Check Dev Server Status

Check if port 3000 is in use:
```bash
# On Windows (PowerShell)
netstat -ano | findstr :3000

# Or on Linux/Mac
lsof -i :3000
```

Check if `npm run dev` (which uses `vercel dev`) is running:
```bash
ps aux | grep "vercel dev" | grep -v grep
```

### 3. Check Vercel Deployments

List recent Vercel deployments:
```bash
vercel ls
```

Check current deployment info:
```bash
vercel inspect
```

### 4. Test Local Dev Server

If the dev server is running, test it:
```bash
curl http://localhost:3000/api/auth/session
```

## Notes:

- The dev server (`npm run dev`) uses `vercel dev` which provides both frontend and API routes
- If port 3000 is not responding, you may need to start the dev server with `npm run dev`
- Environment variables are managed in Vercel Dashboard and synced via `vercel env pull`
