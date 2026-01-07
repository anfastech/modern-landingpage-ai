/** @type {import('next').NextConfig} */
const path = require('path');

// #region agent log
try {
  const fs = require('fs');
  const logPath = path.join(__dirname, '.cursor', 'debug.log');
  const entry = JSON.stringify({
    location: 'next.config.js:1',
    message: 'Loading Next.js config',
    data: { nodeEnv: process.env.NODE_ENV, cwd: process.cwd() },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'ROOT'
  }) + '\n';
  fs.appendFileSync(logPath, entry);
} catch (e) {}
// #endregion

const nextConfig = {
  // Ensure Next resolves workspace from this project, not a parent dir with another lockfile
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
