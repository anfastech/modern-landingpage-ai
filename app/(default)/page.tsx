"use client";

import { useState, useEffect, useRef } from "react";

const SCALE_LABELS = {
  1: "Startup (Simple)",
  2: "Growth (10K-100K users)",
  3: "Enterprise (1M+ users)",
};

const SCALE_MAP = {
  1: "startup",
  2: "growth",
  3: "enterprise",
};

export default function ArchitectAI() {
  const [idea, setIdea] = useState("");
  const [scale, setScale] = useState(1);
  const [tech, setTech] = useState("monolith");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [architectureData, setArchitectureData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("diagram");
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mermaidKey, setMermaidKey] = useState(0);

  // Normalize Mermaid diagram code for rendering
  const normalizeMermaidCode = (code: string): string => {
    if (!code) return '';
    
    let normalized = code
      // Handle various escape sequences
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '  ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove markdown code block markers if present
      .replace(/^```mermaid\s*/i, '')
      .replace(/^```\s*/gm, '')
      .replace(/\s*```$/g, '')
      // Trim whitespace
      .trim();
    
    // Ensure it starts with a valid graph declaration
    if (!normalized.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph)/i)) {
      // Default to graph TD if no declaration found
      normalized = 'graph TD\n' + normalized;
    }
    
    return normalized;
  };

  // Initialize and render Mermaid diagram
  useEffect(() => {
    if (activeTab === 'diagram' && architectureData?.mermaidDiagram && mermaidRef.current) {
      const renderDiagram = async () => {
        try {
          // Dynamic import for Mermaid (client-side only)
          const mermaid = (await import('mermaid')).default;
          
          // Initialize Mermaid with secure config
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            themeVariables: {
              primaryColor: '#667eea',
              primaryTextColor: '#e0e0e0',
              primaryBorderColor: '#764ba2',
              lineColor: '#667eea',
              secondaryColor: '#764ba2',
              tertiaryColor: '#4a5568',
              background: '#0f0f0f',
              mainBkgColor: '#1a1a1a',
              secondBkgColor: '#2d2d2d',
              textColor: '#e0e0e0',
              border1: '#667eea',
              border2: '#764ba2',
              arrowheadColor: '#667eea',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px'
            },
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: 'basis',
              padding: 15,
              nodeSpacing: 50,
              rankSpacing: 50
            }
          });

          // Clear and prepare container
          if (!mermaidRef.current) return;
          
          mermaidRef.current.innerHTML = '';
          const diagramCode = normalizeMermaidCode(architectureData.mermaidDiagram);
          
          // Generate unique ID for this render
          const id = `mermaid-diagram-${Date.now()}`;
          
          // Use mermaid.render for better error handling
          const { svg } = await mermaid.render(id, diagramCode);
          mermaidRef.current.innerHTML = svg;
          
        } catch (error: any) {
          console.error('Mermaid rendering error:', error);
          if (mermaidRef.current) {
            const rawCode = architectureData.mermaidDiagram || '';
            const normalizedCode = normalizeMermaidCode(rawCode);
            mermaidRef.current.innerHTML = `
              <div class="text-amber-400 p-4 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                ⚠️ Diagram rendering failed: ${error.message || 'Unknown error'}
              </div>
              <div class="text-gray-400 text-sm mb-2">Raw Mermaid code:</div>
              <pre class="bg-gray-950/50 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap font-mono">${normalizedCode}</pre>
            `;
          }
        }
      };
      
      renderDiagram();
    }
  }, [activeTab, architectureData, mermaidKey]);

  const updateScaleLabel = () => {
    // This is handled by the state
  };

  const generateArchitecture = async () => {
    if (!idea.trim()) {
      setError("Please enter your product idea!");
      return;
    }

    if (idea.length < 10) {
      setError("Idea too short (min 10 characters)");
      return;
    }

    setLoading(true);
    setError(null);
    setArchitectureData(null);

    try {
      const response = await fetch("/api/architecture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: idea.trim(),
          scale: SCALE_MAP[scale as keyof typeof SCALE_MAP],
          tech,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setArchitectureData(data);
      setActiveTab("diagram");
      setMermaidKey(prev => prev + 1); // Force Mermaid re-render
    } catch (err: any) {
      setError(err.message || "Failed to generate architecture");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    if (!architectureData) {
      setError("No output to copy");
      return;
    }

    const text = JSON.stringify(architectureData, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      // Show success message briefly
      const originalError = error;
      setError(null);
      setTimeout(() => {
        if (!originalError) setError(null);
      }, 2000);
    }).catch(() => {
      setError("Failed to copy to clipboard");
    });
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          🏗️ ArchitectAI
        </h1>
        <p className="text-gray-400 text-lg">
          Product idea → System architecture in seconds
        </p>
      </header>

      {/* Main Container - 3 Card Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CARD: Input */}
        <section className="lg:col-span-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">📝 Your Idea</h2>
          <textarea
            id="idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Real-time chat app with video calls, marketplace for freelancers, AI-powered customer support..."
            className="w-full min-h-[150px] bg-gray-950/80 border border-gray-700 text-gray-200 p-3 rounded-lg resize-y focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-inter"
          />
          
          {/* Try This Examples */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-400">💡 Try this:</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIdea("Build a real-time collaborative document editor like Google Docs with version history and live cursors")}
                className="text-left text-xs px-3 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-purple-300 transition-colors"
              >
                📄 Real-time document editor
              </button>
              <button
                type="button"
                onClick={() => setIdea("Create a marketplace platform for freelancers to connect with clients, handle payments, and manage projects")}
                className="text-left text-xs px-3 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-purple-300 transition-colors"
              >
                💼 Freelancer marketplace
              </button>
              <button
                type="button"
                onClick={() => setIdea("Build an AI-powered customer support chatbot that can handle tickets, escalate issues, and learn from past interactions")}
                className="text-left text-xs px-3 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-purple-300 transition-colors"
              >
                🤖 AI customer support
              </button>
            </div>
          </div>

          <button
            onClick={generateArchitecture}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {loading ? "⏳ Generating..." : "Generate Architecture"}
          </button>
        </section>

        {/* MIDDLE CARD: Config */}
        <section className="lg:col-span-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">⚙️ Configure</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="scale-slider" className="font-medium text-sm">Scale Level</label>
            <input
              id="scale-slider"
              type="range"
              min="1"
              max="3"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
              aria-label="Scale level selector"
            />
            <span className="inline-block bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm mt-1">
              {SCALE_LABELS[scale as keyof typeof SCALE_LABELS]}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tech-select" className="font-medium text-sm">Tech Preference</label>
            <select
              id="tech-select"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="w-full bg-gray-950/80 border border-gray-700 text-gray-200 p-2 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              aria-label="Technology preference selector"
            >
              <option value="monolith">Monolith (Simple)</option>
              <option value="microservices">Microservices (Scalable)</option>
              <option value="serverless">Serverless (Minimal Ops)</option>
            </select>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg text-sm mt-4">
            <p className="font-semibold text-purple-300 mb-2">💡 Example ideas:</p>
            <ul className="text-gray-400 space-y-1 list-disc list-inside">
              <li>Real-time collaboration like Google Docs</li>
              <li>Content marketplace like Etsy</li>
              <li>Project management tool</li>
            </ul>
          </div>
        </section>

        {/* RIGHT CARD: Output */}
        <section className="lg:col-span-6 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">📊 Architecture</h2>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-700 overflow-x-auto">
            {["diagram", "components", "flow", "stack", "scalability"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Output Container */}
          <div className="flex-1 min-h-[300px] overflow-y-auto">
            {error && (
              <div className="text-red-400 p-4 text-center bg-red-500/10 border border-red-500/20 rounded-lg">
                ❌ {error}
              </div>
            )}

            {!error && !architectureData && !loading && (
              <p className="text-gray-500 text-center py-12">
                👈 Fill in your idea and click Generate to see the architecture
              </p>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-gray-400 mt-4">Generating architecture...</p>
              </div>
            )}

            {architectureData && !loading && (
              <div className="space-y-4">
                {activeTab === "diagram" && (
                  <div className="bg-gray-950/50 p-4 rounded-lg overflow-auto">
                    {architectureData.mermaidDiagram ? (
                      <div 
                        ref={mermaidRef} 
                        className="mermaid-container flex items-center justify-center min-h-[300px]"
                        key={mermaidKey}
                      />
                    ) : (
                      <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                        {architectureData.diagram || "No diagram available"}
                      </pre>
                    )}
                  </div>
                )}

                {activeTab === "components" && (
                  <pre className="bg-gray-950/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-300">
                    {JSON.stringify(architectureData.components, null, 2)}
                  </pre>
                )}

                {activeTab === "flow" && (
                  <pre className="bg-gray-950/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {architectureData.dataFlow || "No data flow available"}
                  </pre>
                )}

                {activeTab === "stack" && (
                  <pre className="bg-gray-950/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-300">
                    {JSON.stringify(architectureData.techStack, null, 2)}
                  </pre>
                )}

                {activeTab === "scalability" && (
                  <p className="bg-gray-950/50 p-4 rounded-lg text-gray-300 whitespace-pre-wrap">
                    {architectureData.scalability || "No scalability notes available"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Copy Button */}
          {architectureData && (
            <button
              onClick={copyOutput}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              📋 Copy Output
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
