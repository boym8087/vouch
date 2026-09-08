import {
  APPLICANT,
  QUESTIONS,
  RESPONDENT_COLUMNS,
  RESPONDENT_FIELDS,
} from "../src/config.js";
import { band, esc, html, page } from "../src/render.js";

// Extra respondent fields stored in the JSON blob (applicant_name, role, ...).
const EXTRA_FIELDS = RESPONDENT_FIELDS.filter(
  (f) => !RESPONDENT_COLUMNS.includes(f.id)
);
const META_FIELDS = EXTRA_FIELDS.filter((f) => f.id !== "applicant_name");

function csvCell(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  const { results } = await env.DB.prepare(
    "SELECT * FROM responses ORDER BY created_at DESC"
  ).all();
  const rows = results.map((r) => ({ ...r, answers: JSON.parse(r.answers) }));

  if (url.searchParams.get("format") === "csv") {
    const header = [
      "applicant",
      "recommender",
      "email",
      "phone",
      "submitted",
      ...META_FIELDS.map((f) => f.id),
      ...QUESTIONS.map((q) => q.id),
    ];
    const lines = [
      header.map(csvCell).join(","),
      ...rows.map((r) =>
        [
          r.answers.applicant_name || r.subject_slug,
          r.respondent_name,
          r.respondent_email,
          r.respondent_phone,
          r.created_at,
          ...META_FIELDS.map((f) => r.answers[f.id] || ""),
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

  const entries = rows.length
    ? rows
        .map((r) => {
          const dl = QUESTIONS.filter((q) => r.answers[q.id])
            .map(
              (q) => `<dt>${esc(q.label.replace(/\{name\}/g, APPLICANT))}</dt>
<dd>${esc(r.answers[q.id])}</dd>`
            )
            .join("\n");
          const meta = META_FIELDS.filter((f) => r.answers[f.id])
            .map((f) => esc(r.answers[f.id]))
            .join(" · ");
          return `<article class="entry">
<h3>${esc(r.answers.applicant_name || r.subject_slug)}</h3>
<p class="meta">reference by ${esc(r.respondent_name)}${meta ? ` — ${meta}` : ""}</p>
<p class="meta">${esc(r.respondent_email)}${
            r.respondent_phone ? ` · ${esc(r.respondent_phone)}` : ""
          } · ${esc(r.created_at.slice(0, 16).replace("T", " "))}</p>
<dl>${dl}</dl>
</article>`;
        })
        .join("\n")
    : `<p class="intro">Nothing yet. Once someone fills out the form, it shows up here.</p>`;

  return html(
    page({
      title: "Responses",
      band: band(
        `${rows.length} response${rows.length === 1 ? "" : "s"}`,
        "Responses"
      ),
      wide: true,
      body: `<p class="toolbar"><a href="/results?format=csv">Download CSV</a></p>
${entries}`,
    })
  );
}
