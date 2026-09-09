export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

export function page({ title, band: bandMarkup, body, wide = false }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Karla:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
${bandMarkup}
<main class="sheet${wide ? " results-wide" : ""}">
${body}
</main>
</body>
</html>`;
}

export function band(eyebrow, heading) {
  return `<header class="band"><div class="band-inner">
<p>${esc(eyebrow)}</p>
<h1>${esc(heading)}<span class="mark" aria-hidden="true"></span></h1>
</div></header>`;
}

export function html(markup, status = 200) {
  return new Response(markup, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function redirect(location, status = 303) {
  return new Response(null, {
    status,
    headers: {
      location,
      "cache-control": "no-store",
    },
  });
}
