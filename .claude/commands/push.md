---
description: Push latest changes to GitHub (triggers Vercel auto-deploy)
---

# Push to GitHub

This command will:
1. Check current git status
2. Stage all changes
3. Create a commit with a descriptive message
4. Push to remote repository

**Note**: After pushing, Vercel will automatically deploy your changes.

Please follow these steps:

1. First, let me check the git status to see what changes need to be committed:
   ```bash
   git status
   ```

2. Show a diff of staged and unstaged changes:
   ```bash
   git diff
   git diff --staged
   ```

3. Check recent commit history to understand the commit message style:
   ```bash
   git log --oneline -10
   ```

4. Stage all relevant changes (excluding .env.local and other sensitive files):
   ```bash
   git add .
   ```

5. Review what will be committed:
   ```bash
   git status
   ```

6. Create a commit with a descriptive message following the repository's style:
   ```bash
   git commit -m "commit message here"
   ```

7. Push the changes to the remote repository:
   ```bash
   git push
   ```

**Important**: Never commit sensitive files like `.env.local`, credentials, or secrets.
