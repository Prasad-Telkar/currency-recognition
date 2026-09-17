const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.css');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Backgrounds
  { regex: /background:\s*#0a1020;/g, replacement: 'background: var(--surface);' },
  { regex: /background:\s*#05070d;/g, replacement: 'background: var(--bg);' },
  { regex: /background-color:\s*#0a1020;/g, replacement: 'background-color: var(--surface);' },
  
  // Specific colors mapped to new variables
  { regex: /color:\s*#bfdbfe;/g, replacement: 'color: var(--primary-light);' },
  { regex: /color:\s*#1d4ed8;/g, replacement: 'color: var(--primary);' },
  { regex: /color:\s*#5c6a83;/g, replacement: 'color: var(--muted);' },
  { regex: /color:\s*#657194;/g, replacement: 'color: var(--muted);' },
  { regex: /color:\s*#33415c;/g, replacement: 'color: var(--muted);' },
  { regex: /color:\s*#101a30;/g, replacement: 'color: var(--text);' },
  { regex: /color:\s*#17202a;/g, replacement: 'color: var(--text);' },
  { regex: /color:\s*#0a1020;/g, replacement: 'color: var(--text);' },
  { regex: /color:\s*#3a4a63;/g, replacement: 'color: var(--text);' },
  
  // Status Colors
  { regex: /background:\s*#f1f5f9;/g, replacement: 'background: var(--surface-hover);' },
  { regex: /background:\s*#f0fdf4;/g, replacement: 'background: rgba(var(--green-rgb, 22, 163, 74), 0.1);' },
  { regex: /background:\s*#fef2f2;/g, replacement: 'background: rgba(var(--danger-rgb, 239, 68, 68), 0.1);' },
  { regex: /color:\s*#b91c1c;/g, replacement: 'color: var(--danger);' },
  { regex: /color:\s*#fca5a5;/g, replacement: 'color: var(--danger);' },
  
  // Borders
  { regex: /border:\s*1px solid #d9dee5;/g, replacement: 'border: 1px solid var(--border);' },
  { regex: /border:\s*1px solid #cbd5e1;/g, replacement: 'border: 1px solid var(--border);' },
  { regex: /border-top:\s*1px solid #e2e8f0;/g, replacement: 'border-top: 1px solid var(--border);' },
  
  // Modals / Overlays
  { regex: /background:\s*#000;/g, replacement: 'background: rgba(0, 0, 0, 0.7);' }
];

let replaced = content;
replacements.forEach(r => {
  replaced = replaced.replace(r.regex, r.replacement);
});

fs.writeFileSync(filePath, replaced, 'utf8');
console.log('App.css updated with semantic variables.');
