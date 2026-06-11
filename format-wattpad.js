const fs = require('fs');
const path = require('path');

const mdPath = "D:\\Miftakhul-Rizky\\Story\\Backstage yang Tak Pernah Diceritakan\\parts\\Part 3 - Parkiran Mobil yang Bercerita.md";
const content = fs.readFileSync(mdPath, 'utf-8');

const paragraphs = content.split(/\n\n+/);

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function processParagraph(text) {
  text = text.trim();
  if (!text) return '';
  if (text.startsWith('# ')) return '';
  if (text === '---') return '<hr>';

  let html = escapeHtml(text);

  // 1. **bold** dulu (biar ga ketuker sama *italic*)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 2. *italic* → "italic" (<em>)
  html = html.replace(/\*(.+?)\*/g, '<em>"$1"</em>');

  return html;
}

let output = '';
for (const para of paragraphs) {
  const processed = processParagraph(para);
  if (processed) {
    if (processed === '<hr>') {
      output += '<hr>\n';
    } else {
      output += `<p>${processed}</p>\n`;
    }
  }
}

const outputPath = "D:\\Miftakhul-Rizky\\App\\dashboard-sipega-new\\wwwroot\\temp\\wattpad-content.html";
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, 'utf-8');

console.log('OK: ' + output.length + ' chars');
