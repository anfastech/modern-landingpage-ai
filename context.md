# ArchitectAI - Node.js Backend Context
## Convert modern-landingpage-ai to Interactive System Design Generator

---

## 🎯 Project Overview

**Repository:** https://github.com/anfastech/modern-landingpage-ai  
**Goal:** Add ArchitectAI interactive UI + Node.js backend  
**Models:** Qwen2.5-Coder-7B (free HF Inference API)  
**Output:** Marketing landing page + working system design generator

---

## 📁 Modified Files (Exact Structure)

```
modern-landingpage-ai/
├── index.html              # ✏️ MODIFY: Replace <body> only
├── styles.css              # ✏️ MODIFY: Add new classes
├── script.js               # ✏️ MODIFY: Replace all logic
├── server.js               # ✨ CREATE: Node.js backend
├── .env                    # ✨ CREATE: HF token
├── package.json            # ✨ CREATE: Dependencies
└── README.md               # ✏️ UPDATE: Project info
```

---

## 1️⃣ `index.html` Changes

**KEEP:** Entire `<head>` section (meta, styles, links)  
**REPLACE:** Everything inside `<body>`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- KEEP YOUR EXISTING HEAD UNCHANGED -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ArchitectAI - System Design Generator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- NEW CONTENT BELOW -->
    <header class="hero">
        <h1>🏗️ ArchitectAI</h1>
        <p>Product idea → System architecture in seconds</p>
    </header>

    <main class="container">
        <!-- LEFT CARD: Input -->
        <section class="card input-card">
            <h2>📝 Your Idea</h2>
            <textarea 
                id="idea-input" 
                placeholder="Real-time chat app with video calls, marketplace for freelancers, AI-powered customer support...">
            </textarea>
            <button id="generate-btn" onclick="generateArchitecture()">
                Generate Architecture
            </button>
        </section>

        <!-- MIDDLE CARD: Config -->
        <section class="card config-card">
            <h2>⚙️ Configure</h2>
            
            <div class="control-group">
                <label>Scale Level</label>
                <input 
                    type="range" 
                    id="scale-slider" 
                    min="1" 
                    max="3" 
                    value="2"
                    oninput="updateScaleLabel()">
                <span id="scale-label">Growth (10K-100K users)</span>
            </div>
            
            <div class="control-group">
                <label>Tech Preference</label>
                <select id="tech-select">
                    <option value="monolith">Monolith (Simple)</option>
                    <option value="microservices" selected>Microservices (Scalable)</option>
                    <option value="serverless">Serverless (Minimal Ops)</option>
                </select>
            </div>

            <div class="hints">
                <p><strong>💡 Example ideas:</strong></p>
                <ul>
                    <li>Real-time collaboration like Google Docs</li>
                    <li>Content marketplace like Etsy</li>
                    <li>Project management tool</li>
                </ul>
            </div>
        </section>

        <!-- RIGHT CARD: Output -->
        <section class="card output-card">
            <h2>📊 Architecture</h2>
            
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('diagram')">Diagram</button>
                <button class="tab-btn" onclick="switchTab('components')">Components</button>
                <button class="tab-btn" onclick="switchTab('flow')">Data Flow</button>
                <button class="tab-btn" onclick="switchTab('stack')">Tech Stack</button>
                <button class="tab-btn" onclick="switchTab('scalability')">Scalability</button>
            </div>
            
            <div id="output-container">
                <p class="placeholder">👈 Fill in your idea and click Generate to see the architecture</p>
            </div>
            
            <button id="copy-btn" onclick="copyOutput()" style="display:none">
                📋 Copy Output
            </button>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
```

---

## 2️⃣ `styles.css` Changes

**KEEP:** All existing styles  
**ADD:** These new classes at the end

```css
/* ====== ArchitectAI Styles ====== */

.hero {
    text-align: center;
    margin-bottom: 3rem;
}

.hero h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero p {
    color: #888;
    font-size: 1.1rem;
}

/* Container Grid */
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

/* Card Base */
.card {
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(100, 100, 100, 0.3);
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: all 0.3s ease;
}

.card:hover {
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(30, 30, 30, 1);
}

.card h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

/* Inputs */
textarea, select, input[type="range"] {
    background: rgba(15, 15, 15, 0.8);
    border: 1px solid rgba(100, 100, 100, 0.3);
    color: #e0e0e0;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s;
}

textarea {
    min-height: 150px;
    resize: vertical;
}

textarea:focus, select:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(15, 15, 15, 1);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Control Groups */
.control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.control-group label {
    font-weight: 500;
    font-size: 0.95rem;
}

#scale-label {
    display: inline-block;
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    margin-top: 0.25rem;
}

/* Buttons */
button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
}

button:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

button:active {
    transform: translateY(0);
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Tabs */
.tabs {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(100, 100, 100, 0.3);
    margin-bottom: 1.5rem;
    overflow-x: auto;
}

.tab-btn {
    background: transparent;
    color: #888;
    border: none;
    padding: 0.75rem 1rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: all 0.3s;
}

.tab-btn:hover {
    color: #e0e0e0;
}

.tab-btn.active {
    color: #667eea;
    border-bottom-color: #667eea;
}

/* Tab Content */
.tab-content {
    display: none;
    animation: fadeIn 0.3s;
}

.tab-content.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Output */
#output-container {
    flex: 1;
    min-height: 200px;
    overflow-y: auto;
}

#output-container pre {
    background: rgba(0, 0, 0, 0.5);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 0.9rem;
    line-height: 1.6;
}

.placeholder {
    color: #888;
    text-align: center;
    padding: 2rem 0;
}

/* Hints */
.hints {
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.2);
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
}

.hints p {
    margin: 0 0 0.5rem 0;
    color: #999;
}

.hints ul {
    margin: 0;
    padding-left: 1.5rem;
}

.hints li {
    color: #999;
    margin-bottom: 0.25rem;
}

/* Responsive */
@media (max-width: 1200px) {
    .container {
        grid-template-columns: 1fr;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
}
```

---

## 3️⃣ `script.js` Changes

**REPLACE:** All content

```javascript
// ====== Config ======
const API_ENDPOINT = '/api/architecture';

const SCALE_LABELS = {
    1: 'Startup (Simple)',
    2: 'Growth (10K-100K users)',
    3: 'Enterprise (1M+ users)'
};

const SCALE_MAP = {
    1: 'startup',
    2: 'growth',
    3: 'enterprise'
};

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', () => {
    updateScaleLabel();
});

// ====== Main Functions ======

function updateScaleLabel() {
    const scale = document.getElementById('scale-slider').value;
    document.getElementById('scale-label').textContent = SCALE_LABELS[scale];
}

async function generateArchitecture() {
    const idea = document.getElementById('idea-input').value.trim();
    const scale = SCALE_MAP[document.getElementById('scale-slider').value];
    const tech = document.getElementById('tech-select').value;

    // Validation
    if (!idea) {
        showError('Please enter your product idea!');
        return;
    }

    if (idea.length < 10) {
        showError('Idea too short (min 10 characters)');
        return;
    }

    // Disable button
    const btn = document.getElementById('generate-btn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idea,
                scale,
                tech
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        window.architectureData = data;
        displayOutput(data);
        document.getElementById('copy-btn').style.display = 'block';

    } catch (error) {
        showError(`Error: ${error.message}`);
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

function displayOutput(data) {
    const container = document.getElementById('output-container');
    
    let html = `
        <div id="diagram" class="tab-content active">
            <pre>${escapeHtml(data.diagram)}</pre>
        </div>
        <div id="components" class="tab-content">
            <pre>${escapeHtml(JSON.stringify(data.components, null, 2))}</pre>
        </div>
        <div id="flow" class="tab-content">
            <pre>${escapeHtml(data.dataFlow)}</pre>
        </div>
        <div id="stack" class="tab-content">
            <pre>${JSON.stringify(data.techStack, null, 2)}</pre>
        </div>
        <div id="scalability" class="tab-content">
            <p>${escapeHtml(data.scalability)}</p>
        </div>
    `;
    
    container.innerHTML = html;
}

function switchTab(tabName) {
    // Hide all
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });

    // Show selected
    const tabEl = document.getElementById(tabName);
    if (tabEl) {
        tabEl.classList.add('active');
    }

    // Mark button active
    event.target.classList.add('active');
}

function copyOutput() {
    if (!window.architectureData) {
        showError('No output to copy');
        return;
    }

    const text = JSON.stringify(window.architectureData, null, 2);
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Architecture copied to clipboard! 📋');
    }).catch(() => {
        showError('Failed to copy');
    });
}

// ====== Helpers ======

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const container = document.getElementById('output-container');
    container.innerHTML = `<div style="color: #ff5459; padding: 2rem; text-align: center;">❌ ${message}</div>`;
    document.getElementById('copy-btn').style.display = 'none';
}

function showSuccess(message) {
    const container = document.getElementById('output-container');
    container.innerHTML = `<div style="color: #32b8c6; padding: 2rem; text-align: center;">✅ ${message}</div>`;
}
```

---

## 4️⃣ `server.js` - CREATE NEW FILE

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Config
const HF_API_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-7B-Instruct';
const HF_TOKEN = process.env.HF_API_TOKEN;

if (!HF_TOKEN) {
    console.error('ERROR: HF_API_TOKEN not set in .env');
    process.exit(1);
}

// Prompt templates
const PROMPTS = {
    startup: `You are a senior software architect. Design a MINIMAL, SIMPLE architecture for a startup.

Product Idea: {idea}
Tech Preference: {tech}

IMPORTANT: Respond with ONLY valid JSON (no markdown, no code blocks):
{
    "components": ["Frontend", "API", "Database"],
    "dataFlow": "User → Frontend → API → Database",
    "techStack": {
        "frontend": "HTML/CSS/JS",
        "backend": "Node.js/Express",
        "database": "PostgreSQL",
        "cache": "None initially"
    },
    "diagram": "Simple 3-layer architecture",
    "scalability": "Start simple - MVP focus. Add caching and queues later."
}`,

    growth: `You are a senior software architect. Design a SCALABLE architecture for 10K-100K users.

Product Idea: {idea}
Tech Preference: {tech}

IMPORTANT: Respond with ONLY valid JSON:
{
    "components": ["Web Client", "Load Balancer", "API Servers", "Cache Layer", "Database", "Message Queue"],
    "dataFlow": "Client → Load Balancer → API Servers → Cache/Database",
    "techStack": {
        "frontend": "React/Vue",
        "backend": "Node.js + Express/Fastify",
        "database": "PostgreSQL with read replicas",
        "cache": "Redis",
        "queue": "Bull/RabbitMQ (optional)"
    },
    "diagram": "Load balanced with cache layer",
    "scalability": "Horizontal scaling - multiple API servers, read replicas, Redis caching, message queue for async jobs"
}`,

    enterprise: `You are a senior software architect. Design a HIGHLY AVAILABLE enterprise architecture for 1M+ users.

Product Idea: {idea}
Tech Preference: {tech}

IMPORTANT: Respond with ONLY valid JSON:
{
    "components": ["CDN", "API Gateway", "Microservices", "Message Queue", "Cache Cluster", "Database Cluster", "Monitoring"],
    "dataFlow": "User → CDN → API Gateway → Microservices → Message Queue → Database Cluster",
    "techStack": {
        "frontend": "React + CDN (CloudFlare)",
        "backend": "Microservices (Node.js/Go/Python)",
        "database": "PostgreSQL Cluster + Redis Cluster",
        "queue": "Kafka",
        "monitoring": "Prometheus + Grafana",
        "logging": "ELK Stack"
    },
    "diagram": "Full distributed microservices with multi-region support",
    "scalability": "Multi-region deployment, horizontal scaling everywhere, circuit breakers, retry logic, distributed tracing"
}`
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/architecture', async (req, res) => {
    try {
        const { idea, scale, tech } = req.body;

        // Validation
        if (!idea || typeof idea !== 'string') {
            return res.status(400).json({ error: 'Invalid idea' });
        }

        if (idea.length < 10) {
            return res.status(400).json({ error: 'Idea too short (min 10 chars)' });
        }

        if (idea.length > 2000) {
            return res.status(400).json({ error: 'Idea too long (max 2000 chars)' });
        }

        if (!PROMPTS[scale]) {
            return res.status(400).json({ error: 'Invalid scale' });
        }

        // Build prompt
        const prompt = PROMPTS[scale]
            .replace('{idea}', idea)
            .replace('{tech}', tech);

        // Call HuggingFace API
        const hfResponse = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt }),
            timeout: 60000
        });

        if (!hfResponse.ok) {
            const error = await hfResponse.text();
            console.error('HF API error:', error);
            return res.status(500).json({ error: 'HF API error' });
        }

        const hfData = await hfResponse.json();
        const generatedText = hfData[0].generated_text;

        // Extract JSON from LLM output
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({ error: 'Could not extract JSON from response' });
        }

        const architecture = JSON.parse(jsonMatch[0]);

        res.json(architecture);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🏗️ ArchitectAI running on http://localhost:${PORT}`);
});
```

---

## 5️⃣ `package.json` - CREATE NEW FILE

```json
{
  "name": "architectai",
  "version": "1.0.0",
  "description": "Turn product ideas into system architecture using AI",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

---

## 6️⃣ `.env` - CREATE NEW FILE

```
HF_API_TOKEN=hf_YOUR_TOKEN_HERE
PORT=3000
```

Get token: https://huggingface.co/settings/tokens

---

## 7️⃣ `README.md` - UPDATE

```markdown
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
npm install

# Create .env file
echo "HF_API_TOKEN=hf_YOUR_TOKEN" > .env
```

Get your free HF token: https://huggingface.co/settings/tokens

### 2. Run

```bash
npm start
# Opens http://localhost:3000
```

### 3. Use

1. Paste your product idea (e.g., "Real-time chat app with video calls")
2. Select scale level (startup/growth/enterprise)
3. Choose tech preference (monolith/microservices/serverless)
4. Click "Generate Architecture"
5. Copy the output

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **AI Model**: Qwen2.5-Coder-7B (HuggingFace Inference API)
- **Deployment**: Railway, Render, Fly.io

## API Endpoint

```bash
POST /api/architecture
Content-Type: application/json

{
  "idea": "Real-time collaboration tool",
  "scale": "growth",
  "tech": "microservices"
}
```

Response:
```json
{
  "components": [...],
  "dataFlow": "...",
  "techStack": {...},
  "diagram": "ASCII art",
  "scalability": "..."
}
```

## Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up

# Set environment variable in Railway dashboard
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| HF_API_TOKEN | Yes | HuggingFace API token (free) |
| PORT | No | Server port (default: 3000) |

---

Made with 🏗️ by ArchitectAI Team
```

---

## 📋 Implementation Checklist

- [ ] Backup your current `index.html`, `styles.css`, `script.js`
- [ ] Replace `<body>` in `index.html` (keep `<head>`)
- [ ] Add CSS classes to `styles.css`
- [ ] Replace all of `script.js`
- [ ] Create `server.js`
- [ ] Create `package.json`
- [ ] Create `.env` with HF token
- [ ] Run `npm install`
- [ ] Test locally: `npm start`
- [ ] Deploy to Railway: `railway up`

---

## 🚀 Local Testing

```bash
# 1. Install
npm install

# 2. Setup token
echo "HF_API_TOKEN=hf_YOUR_TOKEN" > .env

# 3. Run server
npm start

# 4. Open browser
# http://localhost:3000

# 5. Test:
# - Paste: "Real-time chat with video"
# - Scale: Growth (slider at 2)
# - Tech: Microservices
# - Click: Generate
# - Wait ~10 seconds for HF API
# - See architecture output
```

---

## 🔗 Deploy Commands

### Railway
```bash
npm i -g @railway/cli
railway login
railway up
```

### Render
1. Push to GitHub
2. Connect repo to Render
3. Set `HF_API_TOKEN` env var
4. Deploy

### Fly.io
```bash
npm i -g flyctl
flyctl launch
flyctl secrets set HF_API_TOKEN=hf_YOUR_TOKEN
flyctl deploy
```

---

## 📞 Key Points

✅ No frontend build needed (use as-is)  
✅ Node.js handles HF API calls (keep token safe)  
✅ Existing styling preserved + enhanced  
✅ 3-card interactive layout  
✅ Tab-based output display  
✅ Copy to clipboard function  
✅ Mobile responsive  

---

**Status:** Ready to implement ✨  
**Estimated Time:** 30 mins to integrate  
**Testing Time:** 15 mins  
**Total:** ~45 mins  
