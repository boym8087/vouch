import {
  QUESTIONS,
  RESPONDENT_COLUMNS,
  RESPONDENT_FIELDS,
  ROSTER,
} from "../src/config.js";

const EXTRA_FIELDS = RESPONDENT_FIELDS.filter(
  (f) => !RESPONDENT_COLUMNS.includes(f.id)
);
import { band, esc, html, page } from "../src/render.js";

function csvCell(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("for");

  const query = slug
    ? env.DB.prepare(
        "SELECT * FROM responses WHERE subject_slug = ? ORDER BY created_at DESC"
      ).bind(slug)
    : env.DB.prepare("SELECT * FROM responses ORDER BY created_at DESC");

  const { results } = await query.all();
  const rows = results.map((r) => ({ ...r, answers: JSON.parse(r.answers) }));

  if (url.searchParams.get("format") === "csv") {
    const header = [
      "student",
      "name",
      "email",
      "phone",
      "submitted",
      ...EXTRA_FIELDS.map((f) => f.id),
      ...QUESTIONS.map((q) => q.id),
    ];
    const lines = [
      header.map(csvCell).join(","),
      ...rows.map((r) =>
        [
          r.subject_slug,
          r.respondent_name,
          r.respondent_email,
          r.respondent_phone,
          r.created_at,
          ...EXTRA_FIELDS.map((f) => r.answers[f.id] || ""),
          ...QUESTIONS.map((q) => r.answers[q.id] || ""),
        ]
          .map(csvCell)
          .join(",")
      ),
    ];
    return new Response(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="responses.csv"',
      },
    });
  }

  const filters = [
    `<a href="/results">Everyone</a>`,
    ...ROSTER.map((s) => `<a href="/results?for=${esc(s.slug)}">${esc(s.name)}</a>`),
  ].join(" · ");

  const entries = rows.length
    ? rows
        .map((r) => {
          const dl = QUESTIONS.filter((q) => r.answers[q.id])
            .map(
              (q) => `<dt>${esc(q.label.replace(/\{name\}/g, "them"))}</dt>
<dd>${esc(r.answers[q.id])}</dd>`
            )
            .join("\n");
          return `<article class="entry">
<h3>${esc(r.respondent_name)}</h3>
${EXTRA_FIELDS.filter((f) => r.answers[f.id])
  .map((f) => `<p class="meta">${esc(r.answers[f.id])}</p>`)
  .join("")}
<p class="meta">for ${esc(r.subject_slug)} · ${esc(r.respondent_email)}${
            r.respondent_phone ? ` · ${esc(r.respondent_phone)}` : ""
          } · ${esc(r.created_at.slice(0, 16).replace("T", " "))}</p>
<dl>${dl}</dl>
</article>`;
        })
        .join("\n")
    : `<p class="intro">Nothing yet. Once someone fills out a form, it shows up here.</p>`;

  return html(
    page({
      title: "Responses",
      band: band(`${rows.length} response${rows.length === 1 ? "" : "s"}`, "Responses"),
      wide: true,
      body: `<p class="toolbar">${filters}</p>
<p class="toolbar"><a href="/results${slug ? `?for=${esc(slug)}&` : "?"}format=csv">Download CSV</a></p>
${entries}`,
    })
  );
}
