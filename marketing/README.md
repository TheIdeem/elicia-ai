# Elicia AI – Marketing Site

This is the marketing (landing) site for Elicia AI, built with Next.js and Tailwind CSS.

## Structure

- `app/` – Next.js app directory (landing page, demo request, API routes)
- `components/` – (Optional) Shared UI components
- `globals.css` – Global styles (Tailwind CSS)
- `package.json` – Project dependencies and scripts

## Getting Started

1. **Install dependencies:**
   ```bash
   cd marketing
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Deployment
Deploy separately from the main app (e.g., on Vercel as `elicia-ai.com`).

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` – Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` – Service role key (for server-side API routes)

## Notes
- The landing page is at `/`.
- The demo request form is at `/demo-request`.
- API route for demo requests: `/api/demo-request`.

---

For design inspiration, see [spara.co](https://www.spara.co/). 