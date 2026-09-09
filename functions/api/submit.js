import {
  APPLICANT,
  QUESTIONS,
  RESPONDENT_COLUMNS,
  RESPONDENT_FIELDS,
  slugifyName,
} from "../../src/config.js";
import { band, esc, html, page, redirect } from "../../src/render.js";

const MAX_LEN = 4000;

// Where to send the respondent after a successful submission.
// Must be a hardcoded absolute URL — never build this from form input.
const THANKS_URL = "https://example.com/thanks";

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
  if (!env.TURNSTILE_SECRET) {
    console.warn("TURNSTILE_SECRET not set — spam check skipped");
    return true;
  }
  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET);
  body.append("response", token || "");
  if (ip) body.append("remoteip", ip);
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("turnstile verify failed", err);
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const form = await request.formData();

  const ok = await passesTurnstile(
    env,
    form.get("cf-turnstile-response"),
    request.headers.get("cf-connecting-ip")
  );
  if (!ok) return fail("The spam check didn't pass. Try submitting again.");

  const read = (id) => (form.get(id) || "").toString().trim().slice(0, MAX_LEN);

  for (const f of [...RESPONDENT_FIELDS, ...QUESTIONS]) {
    if (f.required && !read(f.id)) {
      return fail(`"${f.label.replace(/\{name\}/g, APPLICANT)}" needs an answer.`);
    }
  }

  const email = read("respondent_email");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return fail("That email address doesn't look right.");
  }

  const applicantName = read("applicant_name");

  // Everything not stored in a real column goes into the answers JSON:
  // the question answers plus extra respondent fields (applicant_name, role).
  const answers = {};
  for (const q of QUESTIONS) answers[q.id] = read(q.id);
  for (const f of RESPONDENT_FIELDS) {
    if (!RESPONDENT_COLUMNS.includes(f.id)) answers[f.id] = read(f.id);
  }

  try {
    await env.DB.prepare(
      `INSERT INTO responses
         (subject_slug, respondent_name, respondent_email, respondent_phone, answers, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        slugifyName(applicantName),
        read("respondent_name"),
        email,
        read("respondent_phone"),
        JSON.stringify(answers),
        new Date().toISOString()
      )
      .run();
  } catch (err) {
    console.error("insert failed", err);
    return fail(
      "Something went wrong saving that. Try submitting again in a moment.",
      500
    );
  }

  return redirect(https://www.youtube.com/watch?v=dQw4w9WgXcQ);
}

export function onRequestGet({ request }) {
  return redirect(new URL("/", request.url).toString(), 302);
}
