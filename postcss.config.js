// #region agent log
const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, '.cursor', 'debug.log');
function debugLog(loc, msg, data, hyp) {
  try {
    const entry = JSON.stringify({location:loc,message:msg,data:{...data,nodeEnv:process.env.NODE_ENV},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:hyp}) + '\n';
    fs.appendFileSync(logPath, entry);
  } catch(e) {}
}
debugLog('postcss.config.js:1', 'PostCSS config loading', {nodeVersion:process.version}, 'A');
// #endregion

// #region agent log
let tailwindcssPostcssModule = null;
let requireError = null;
const nodeModulesPath = path.join(__dirname, 'node_modules', '@tailwindcss', 'postcss');
const moduleExists = fs.existsSync(nodeModulesPath);
debugLog('postcss.config.js:10', 'Checking module existence', {exists:moduleExists,path:nodeModulesPath}, 'B');
try {
  tailwindcssPostcssModule = require('@tailwindcss/postcss');
  debugLog('postcss.config.js:14', 'Successfully required module', {hasDefault:!!tailwindcssPostcssModule?.default,keys:Object.keys(tailwindcssPostcssModule||{})}, 'B');
} catch (err) {
  requireError = err;
  debugLog('postcss.config.js:17', 'Failed to require module', {error:err.message,code:err.code}, 'B');
}
// #endregion

// #region agent log
debugLog('postcss.config.js:22', 'Final config state', {hasModule:!!tailwindcssPostcssModule,hasError:!!requireError}, 'C');
// #endregion

module.exports = {
  plugins: {
    // Important: value must be options, not the plugin function
    '@tailwindcss/postcss': {},
  },
};
