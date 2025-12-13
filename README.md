<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1kElYi9dhCm1IYQt69y3nKXGNOCy-BD5Q

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Link to Vercel project and pull environment variables:
   ```bash
   vercel link
   vercel env pull .env.local
   ```
   
   Or manually create `.env.local` with required environment variables.

3. Run the development server (supports both frontend and API routes):
   ```bash
   npm run dev
   ```
   
   This uses `vercel dev` which enables:
   - Frontend development with Vite
   - API routes testing at `http://localhost:3000/api/*`
   
   For frontend only (without API):
   ```bash
   npm run dev:vite
   ```
