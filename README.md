# ArchitectAI - System Design Generator

Turn your product idea into a complete system architecture in seconds using AI.

## Features

✨ **3 Scale Levels** - Startup / Growth / Enterprise  
📊 **Auto-generated Architectures** - Diagrams, components, data flow  
🛠️ **Tech Stack Recommendations** - Based on scale & preference  
🎨 **Beautiful Dark UI** - Modern, responsive design  
📋 **Copy Output** - Easy sharing and documentation  

## Quick Start

### 1. Setup

```bash
# Install dependencies
pnpm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your HuggingFace token
# Get your free token at: https://huggingface.co/settings/tokens
```

### 2. Run

```bash
# Start the development server
pnpm run dev

# Open http://localhost:3000 in your browser
```

### 3. Use

1. Open http://localhost:3000 in your browser
2. Paste your product idea (e.g., "Real-time chat app with video calls")
3. Select scale level (startup/growth/enterprise)
4. Choose tech preference (monolith/microservices/serverless)
5. Click "Generate Architecture"
6. View results in tabs: Diagram, Components, Flow, Stack, Scalability
7. Copy the output for documentation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Model**: Qwen2.5-Coder-7B (HuggingFace Inference API)
- **Deployment**: Vercel (recommended)

## API Endpoint

The Next.js API route provides a REST API endpoint:

```bash
POST /api/architecture
Content-Type: application/json

{
  "idea": "Real-time collaboration tool",
  "scale": "growth",
  "tech": "microservices"
}
```

**Response:**
```json
{
  "components": ["Web Client", "Load Balancer", "API Servers", ...],
  "dataFlow": "Client → Load Balancer → API Servers → ...",
  "techStack": {
    "frontend": "React/Vue",
    "backend": "Node.js + Express",
    "database": "PostgreSQL with read replicas",
    "cache": "Redis"
  },
  "diagram": "ASCII architecture diagram",
  "scalability": "Horizontal scaling notes..."
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_API_TOKEN` | Yes | HuggingFace API token (free) |

Create a `.env` file in the root directory:
```
HF_API_TOKEN=hf_YOUR_TOKEN_HERE
```

Get your free token: https://huggingface.co/settings/tokens

## Project Structure

```
modern-landingpage-ai/
├── app/
│   ├── (default)/
│   │   └── page.tsx          # ArchitectAI main interface
│   └── api/
│       └── architecture/
│           └── route.ts     # Next.js API route for HuggingFace integration
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variable:
   - `HF_API_TOKEN` = your HuggingFace token
4. Deploy!

Vercel will automatically:
- Build your Next.js application
- Deploy both frontend and API routes
- Handle environment variables securely

## Development

### Scripts

- `pnpm run dev` - Start Next.js dev server (includes API routes)
- `pnpm run build` - Build Next.js for production
- `pnpm run start` - Start Next.js production server
- `pnpm run lint` - Run ESLint

### Troubleshooting

**HuggingFace API 503 Error:**
- The model may be sleeping. Wait 30 seconds and try again.
- Free tier has rate limits (~1 request/minute)

**Environment Variable Not Found:**
- Ensure `.env` file exists in the root directory
- Restart the dev server after creating/updating `.env`
- In production (Vercel), add the variable in the Vercel dashboard

**API Route Not Working:**
- Check that `app/api/architecture/route.ts` exists
- Verify `HF_API_TOKEN` is set correctly
- Check browser console and server logs for errors

## Security Notes

- ✅ HF token stored in `.env` (never commit)
- ✅ Environment variables are server-side only (not exposed to client)
- ✅ Input validation (10-2000 characters)
- ⚠️ DO NOT commit `.env` file to version control

## License

MIT

---

Made with 🏗️ by ArchitectAI Team
