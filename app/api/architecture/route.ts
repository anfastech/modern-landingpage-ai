import { NextRequest, NextResponse } from 'next/server';

// Config
// Using HuggingFace Inference API
// Note: Some models may not be available. We'll try multiple models.
const HF_TOKEN = process.env.HF_API_TOKEN;

// Debug logging endpoint (from system configuration)
// Can be overridden via DEBUG_LOG_ENDPOINT environment variable
const DEBUG_LOG_ENDPOINT = process.env.DEBUG_LOG_ENDPOINT || 'http://127.0.0.1:7245/ingest/4c1531ac-ae5a-4915-9818-c49073a9234f';

// Helper function to log debug information
function debugLog(location: string, message: string, data: any, hypothesisId: string, runId: string = 'run1') {
  fetch(DEBUG_LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId,
      hypothesisId
    })
  }).catch(() => {});
}

// Prompt templates - Using simple node IDs without special characters for Mermaid compatibility
const PROMPTS = {
  startup: `You are a senior software architect. Design a MINIMAL, SIMPLE architecture for a startup.

Product Idea: {idea}
Tech Preference: {tech}

IMPORTANT: Respond with ONLY valid JSON (no markdown, no code blocks). Include a "mermaidDiagram" field with valid Mermaid flowchart syntax.

Rules for mermaidDiagram:
- Start with "graph TD" (top-down) or "graph LR" (left-right)
- Use simple alphanumeric node IDs (no spaces, no special chars)
- Format: NodeID[Label Text]
- Connect with -->
- Separate lines with actual newlines (not \\n)

Example response:
{
    "components": ["Frontend", "API", "Database"],
    "dataFlow": "User to Frontend to API to Database",
    "techStack": {
        "frontend": "HTML/CSS/JS",
        "backend": "Node.js/Express",
        "database": "PostgreSQL",
        "cache": "None initially"
    },
    "diagram": "Simple 3-layer architecture",
    "mermaidDiagram": "graph TD\n    User[User] --> Frontend[Frontend]\n    Frontend --> API[API Server]\n    API --> DB[Database]",
    "scalability": "Start simple - MVP focus. Add caching and queues later."
}`,

  growth: `You are a senior software architect. Design a SCALABLE architecture for 10K-100K users.

Product Idea: {idea}
Tech Preference: {tech}

IMPORTANT: Respond with ONLY valid JSON. Include a "mermaidDiagram" field with valid Mermaid flowchart syntax.

Rules for mermaidDiagram:
- Start with "graph TD" or "graph LR"
- Use simple alphanumeric node IDs
- Format: NodeID[Label Text]
- Connect with -->

Example response:
{
    "components": ["Web Client", "Load Balancer", "API Servers", "Cache Layer", "Database", "Message Queue"],
    "dataFlow": "Client to Load Balancer to API Servers to Cache and Database",
    "techStack": {
        "frontend": "React/Vue",
        "backend": "Node.js + Express/Fastify",
        "database": "PostgreSQL with read replicas",
        "cache": "Redis",
        "queue": "Bull/RabbitMQ"
    },
    "diagram": "Load balanced with cache layer",
    "mermaidDiagram": "graph TD\n    Client[Web Client] --> LB[Load Balancer]\n    LB --> API1[API Server 1]\n    LB --> API2[API Server 2]\n    API1 --> Cache[Redis Cache]\n    API2 --> Cache\n    Cache --> DB[PostgreSQL]\n    API1 --> Queue[Message Queue]\n    API2 --> Queue",
    "scalability": "Horizontal scaling - multiple API servers, read replicas, Redis caching, message queue for async jobs"
}`,

  enterprise: `You are a senior software architect. Design a HIGHLY AVAILABLE enterprise architecture for 1M+ users.

Product Idea: {idea}
Tech Preference: {tech}

IMPORTANT: Respond with ONLY valid JSON. Include a "mermaidDiagram" field with valid Mermaid flowchart syntax.

Rules for mermaidDiagram:
- Start with "graph TD" or "graph LR"
- Use simple alphanumeric node IDs (no parentheses, no special chars)
- Format: NodeID[Label Text]
- Connect with -->

Example response:
{
    "components": ["CDN", "API Gateway", "Microservices", "Message Queue", "Cache Cluster", "Database Cluster", "Monitoring"],
    "dataFlow": "User to CDN to API Gateway to Microservices to Message Queue to Database Cluster",
    "techStack": {
        "frontend": "React + CDN CloudFlare",
        "backend": "Microservices Node.js Go Python",
        "database": "PostgreSQL Cluster + Redis Cluster",
        "queue": "Kafka",
        "monitoring": "Prometheus + Grafana",
        "logging": "ELK Stack"
    },
    "diagram": "Full distributed microservices with multi-region support",
    "mermaidDiagram": "graph TD\n    User[User] --> CDN[CDN]\n    CDN --> Gateway[API Gateway]\n    Gateway --> Auth[Auth Service]\n    Gateway --> UserSvc[User Service]\n    Gateway --> DataSvc[Data Service]\n    Auth --> Kafka[Kafka Queue]\n    UserSvc --> Kafka\n    DataSvc --> Kafka\n    Kafka --> Redis[Redis Cluster]\n    Redis --> DB[PostgreSQL Cluster]\n    Auth --> Monitor[Monitoring]\n    UserSvc --> Monitor\n    DataSvc --> Monitor",
    "scalability": "Multi-region deployment, horizontal scaling everywhere, circuit breakers, retry logic, distributed tracing"
}`
};


export async function POST(request: NextRequest) {
  try {
    // Check for HF token
    if (!HF_TOKEN) {
      console.error('ERROR: HF_API_TOKEN not set in environment variables');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'HuggingFace API token not configured. Please set HF_API_TOKEN in your environment variables.'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { idea, scale, tech } = body;

    // Validation
    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { error: 'Invalid idea' },
        { status: 400 }
      );
    }

    if (idea.length < 10) {
      return NextResponse.json(
        { error: 'Idea too short (min 10 chars)' },
        { status: 400 }
      );
    }

    if (idea.length > 2000) {
      return NextResponse.json(
        { error: 'Idea too long (max 2000 chars)' },
        { status: 400 }
      );
    }

    if (!PROMPTS[scale as keyof typeof PROMPTS]) {
      return NextResponse.json(
        { error: 'Invalid scale. Must be: startup, growth, or enterprise' },
        { status: 400 }
      );
    }

    // Build prompt
    const prompt = PROMPTS[scale as keyof typeof PROMPTS]
      .replace('{idea}', idea)
      .replace('{tech}', tech);

    console.log(`[ArchitectAI] Generating architecture for scale: ${scale}, tech: ${tech}`);

    // #region agent log
    debugLog('route.ts:123', 'Before HF API call', {hasToken:!!HF_TOKEN,tokenLength:HF_TOKEN?.length||0,scale,tech,ideaLength:idea.length}, 'A', 'run3');
    // #endregion

    // Use chat completions format for router API
    const requestBody = {
      model: 'Qwen/Qwen2.5-Coder-7B-Instruct',
      messages: [
        { role: 'system', content: 'You are a senior software architect. Respond with ONLY valid JSON (no markdown, no code blocks).' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.6
    };

    // #region agent log
    debugLog('route.ts:135', 'Request body prepared', {promptLength:prompt.length,requestBodyKeys:Object.keys(requestBody)}, 'B');
    // #endregion

    // Call HuggingFace API using the new router chat completions endpoint
    const HF_ROUTER_URL = 'https://router.huggingface.co/v1/chat/completions';
    
    let hfResponse: Response | null = null;
    
    // #region agent log
    debugLog('route.ts:150', 'Calling HuggingFace router API', {url:HF_ROUTER_URL,model:requestBody.model}, 'E', 'run3');
    // #endregion
    
    hfResponse = await fetch(HF_ROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // #region agent log
    debugLog('route.ts:163', 'After fetch call', {url:HF_ROUTER_URL,status:hfResponse.status,statusText:hfResponse.statusText,ok:hfResponse.ok}, 'C', 'run3');
    // #endregion

    // If all endpoints failed, return error instead of hardcoded output
    if (!hfResponse || !hfResponse.ok) {
      // #region agent log
      debugLog('route.ts:187', 'All endpoints failed', {scale,tech}, 'H', 'run4');
      // #endregion
      
      let errorText = '';
      if (hfResponse) {
        try {
          errorText = await hfResponse.text();
        } catch (e) {
          errorText = `HTTP ${hfResponse.status}: ${hfResponse.statusText}`;
        }
      }
      
      return NextResponse.json(
        { 
          error: 'HuggingFace API unavailable',
          details: 'All API endpoints failed. Please check your HF_API_TOKEN and try again later. ' + (errorText ? `Last error: ${errorText.substring(0, 200)}` : '')
        },
        { status: 503 }
      );
    }

    if (!hfResponse.ok) {
      let errorText = '';
      try {
        errorText = await hfResponse.text();
      } catch (e) {
        errorText = `HTTP ${hfResponse.status}: ${hfResponse.statusText}`;
      }
      
      // #region agent log
      debugLog('route.ts:157', 'Error response received', {status:hfResponse.status,errorText:errorText.substring(0,500)}, 'D');
      // #endregion
      
      console.error('HF API error:', hfResponse.status, errorText);
      
      if (hfResponse.status === 503) {
        return NextResponse.json(
          { 
            error: 'HuggingFace model is loading. Please try again in 30 seconds.',
            details: 'The model needs to be woken up from sleep mode. This is normal for free tier models.'
          },
          { status: 503 }
        );
      }
      
      if (hfResponse.status === 401) {
        return NextResponse.json(
          { 
            error: 'HuggingFace API authentication failed',
            details: 'Invalid or missing API token. Please check your HF_API_TOKEN environment variable.'
          },
          { status: 500 }
        );
      }
      
      // Try to parse error as JSON for better error messages
      let errorDetails = errorText.substring(0, 300);
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorDetails = errorJson.error;
        }
      } catch (e) {
        // Keep the text as is
      }
      
      return NextResponse.json(
        { 
          error: 'HuggingFace API error',
          details: errorDetails || `HTTP ${hfResponse.status}: ${hfResponse.statusText}`
        },
        { status: 500 }
      );
    }

    const hfData = await hfResponse.json();
    
    // Handle chat completions response format
    let generatedText = '';
    if (hfData.choices && hfData.choices.length > 0 && hfData.choices[0].message) {
      // New chat completions format
      generatedText = hfData.choices[0].message.content;
    } else if (hfData.generated_text) {
      // Fallback for old format
      generatedText = hfData.generated_text;
    } else if (Array.isArray(hfData) && hfData.length > 0) {
      generatedText = hfData[0].generated_text || hfData[0].text || JSON.stringify(hfData[0]);
    } else if (hfData.text) {
      generatedText = hfData.text;
    } else {
      generatedText = JSON.stringify(hfData);
    }

    // Extract JSON from LLM output
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not extract JSON from response:', generatedText.substring(0, 500));
      return NextResponse.json(
        { 
          error: 'Could not extract JSON from response',
          details: 'The AI response was not in the expected format. Please try again.'
        },
        { status: 500 }
      );
    }

    let architecture;
    try {
      architecture = JSON.parse(jsonMatch[0]);
    } catch (parseError: any) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response as JSON',
          details: parseError.message
        },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!architecture.components || !architecture.techStack || !architecture.dataFlow) {
      return NextResponse.json(
        { 
          error: 'Incomplete architecture response',
          details: 'The AI response is missing required fields.'
        },
        { status: 500 }
      );
    }

    // Ensure all required fields exist
    architecture.diagram = architecture.diagram || 'Architecture diagram';
    architecture.scalability = architecture.scalability || 'Scalability notes';
    
    // If mermaidDiagram is not provided, generate a basic one from components
    if (!architecture.mermaidDiagram && architecture.components) {
      const components = Array.isArray(architecture.components) ? architecture.components : [];
      if (components.length > 0) {
        const nodes = components.map((comp: string, i: number) => {
          const id = comp.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
          return `${id}["${comp}"]`;
        }).join('\\n    ');
        const connections = components.slice(0, -1).map((comp: string, i: number) => {
          const from = components[i].replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
          const to = components[i + 1].replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
          return `${from} --> ${to}`;
        }).join('\\n    ');
        architecture.mermaidDiagram = `graph TD\\n    ${nodes}\\n    ${connections}`;
      }
    }

    return NextResponse.json(architecture);

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'ArchitectAI API is running' 
  });
}
