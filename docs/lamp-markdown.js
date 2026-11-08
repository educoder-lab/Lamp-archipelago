/* ランプ諸島 — 簡易 Markdown → HTML（参照ページ・講座用語） */
(function (global) {
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function inline(s) {
    let t = esc(s);
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      const h = href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return '<a href="' + h + '">' + esc(text) + '</a>';
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    return t;
  }

  function renderTable(rows) {
    if (rows.length < 2) return '';
    const head = rows[0].split('|').map(c => c.trim()).filter(Boolean);
    const body = rows.slice(2);
    let html = '<table class="md-table"><thead><tr>';
    head.forEach(h => { html += '<th>' + inline(h) + '</th>'; });
    html += '</tr></thead><tbody>';
    body.forEach(row => {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      if (!cells.length) return;
      html += '<tr>';
      cells.forEach(c => { html += '<td>' + inline(c) + '</td>'; });
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  function render(markdown) {
    if (!markdown) return '';
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      if (trimmed === '') { i++; continue; }
      if (/^#{1,3}\s/.test(trimmed)) {
        const lvl = trimmed.match(/^(#+)/)[1].length;
        const text = trimmed.replace(/^#+\s*/, '');
        out.push('<h' + lvl + '>' + inline(text) + '</h' + lvl + '>');
        i++;
        continue;
      }
      if (trimmed.includes('|') && i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1].trim())) {
        const rows = [trimmed];
        i++;
        while (i < lines.length && lines[i].trim().includes('|')) {
          rows.push(lines[i].trim());
          i++;
        }
        out.push(renderTable(rows));
        continue;
      }
      if (/^```/.test(trimmed)) {
        const code = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i].trim())) {
          code.push(lines[i]);
          i++;
        }
        if (i < lines.length) i++;
        out.push('<pre class="md-code"><code>' + esc(code.join('\n')) + '</code></pre>');
        continue;
      }
      if (/^-\s/.test(trimmed)) {
        out.push('<ul class="md-list">');
        while (i < lines.length && /^-\s/.test(lines[i].trim())) {
          out.push('<li>' + inline(lines[i].trim().replace(/^-\s*/, '')) + '</li>');
          i++;
        }
        out.push('</ul>');
        continue;
      }
      const para = [trimmed];
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !/^#/.test(lines[i]) && !/^-\s/.test(lines[i].trim()) && !lines[i].trim().includes('|')) {
        para.push(lines[i].trim());
        i++;
      }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  function filterTables(root, query) {
    const q = (query || '').trim().toLowerCase();
    if (!root) return;
    root.querySelectorAll('.md-table tbody tr').forEach(tr => {
      if (!q) { tr.hidden = false; return; }
      tr.hidden = !tr.textContent.toLowerCase().includes(q);
    });
  }

  global.LampMarkdown = { render, filterTables, esc, inline };
})(typeof window !== 'undefined' ? window : globalThis);
