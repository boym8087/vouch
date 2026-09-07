import {
  QUESTIONS,
  RESPONDENT_COLUMNS,
  RESPONDENT_FIELDS,
  findStudent,
} from "../../src/config.js";
import { band, esc, html, page } from "../../src/render.js";

const MAX_LEN = 4000;

function fail(message, status = 400) {
  return html(
    page({
      title: "That didn't send",
      band: band("That didn't send", "Almost there"),
      body: `<div class="error">${esc(message)}</div>
<p class="intro">Go back in your browser — your answers should still be there.</p>`,
    }),
    status
  );
}

async function passesTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true; // not configured yet
  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET);
  body.append("response", token || "");
  if (ip) body.append("remoteip", ip);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );
  const data = await res.json();
  return data.success === true;
}

export async function onRequestPost({ request, env }) {
  const form = await request.formData();

  const student = findStudent(form.get("subject_slug") || "");
  if (!student) return fail("That form link isn't valid anymore.");

  const ok = await passesTurnstile(
    env,
    form.get("cf-turnstile-response"),
    request.headers.get("cf-connecting-ip")
  );
  if (!ok) return fail("The spam check didn't pass. Try submitting again.");

  const read = (id) => (form.get(id) || "").toString().trim().slice(0, MAX_LEN);

  for (const f of [...RESPONDENT_FIELDS, ...QUESTIONS]) {
    if (f.required && !read(f.id)) {
      return fail(
        `"${f.label.replace(/\{name\}/g, student.name)}" needs an answer.`
      );
    }
  }

  const email = read("respondent_email");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return fail("That email address doesn't look right.");
  }

  const answers = {};
  for (const q of QUESTIONS) answers[q.id] = read(q.id);
  for (const f of RESPONDENT_FIELDS) {
    if (!RESPONDENT_COLUMNS.includes(f.id)) answers[f.id] = read(f.id);
  }

  await env.DB.prepare(
    `INSERT INTO responses
       (subject_slug, respondent_name, respondent_email, respondent_phone, answers, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      student.slug,
      read("respondent_name"),
      email,
      read("respondent_phone"),
      JSON.stringify(answers),
      new Date().toISOString()
    )
    .run();

  return html(
    page({
      title: "Thanks",
      band: band("Sent", "Thank you"),
      body: `<p class="intro">That's recorded. ${esc(
        student.name
      )} will have it for their applications. If you need to correct something, email them directly and they can pass it along.</p>`,
    })
  );
}

export function onRequestGet() {
  return Response.redirect("/", 302);
}
