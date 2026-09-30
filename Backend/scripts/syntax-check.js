const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const sourceRoot = path.join(__dirname, '..');
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules') continue;
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && fullPath.endsWith('.js')) files.push(fullPath);
  }
}

walk(sourceRoot);

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || `Syntax error in ${file}\n`);
    process.exit(result.status || 1);
  }
}

console.log(`Backend syntax check passed for ${files.length} JavaScript files.`);
