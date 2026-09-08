import {
  QUESTIONS,
  RESPONDENT_FIELDS,
  ROLE,
  findStudent,
} from "../../src/config.js";
import { band, esc, html, page } from "../../src/render.js";

function label(text, name) {
  return text.replace(/\{name\}/g, name);
}

function required(field) {
  return field.required
    ? ` <span class="req" title="Required">*</span>`
    : "";
}

function help(field) {
  return field.help ? `<span class="help">${esc(field.help)}</span>` : "";
}

function renderField(field, name) {
  const text = esc(label(field.label, name));
  const req = field.required ? " required" : "";
  const ph = field.placeholder
    ? ` placeholder="${esc(label(field.placeholder, name))}"`
    : "";

  if (field.type === "choice") {
    const options = field.options
      .map(
        (opt, i) => `<label class="choice">
  <input type="radio" name="${esc(field.id)}" value="${esc(opt)}" id="${esc(field.id)}-${i}"${req}>
  <span>${esc(opt)}</span>
</label>`
      )
      .join("\n");
    return `<fieldset class="field">
<legend>${text}${required(field)}</legend>
${help(field)}
${options}
</fieldset>`;
  }

  const control =
    field.type === "textarea"
      ? `<textarea id="${esc(field.id)}" name="${esc(field.id)}"${req}${ph}></textarea>`
      : `<input type="${esc(field.type)}" id="${esc(field.id)}" name="${esc(field.id)}"${req}${ph}>`;

  return `<div class="field">
<label for="${esc(field.id)}">${text}${required(field)}</label>
${help(field)}
${control}
</div>`;
}

export function onRequestGet({ params, env }) {
  const student = findStudent(params.slug || "");

  if (!student) {
    return html(
      page({
        title: "Link not found",
        band: band("Hmm", "This link doesn't match anyone"),
        body: `<p class="intro">Double-check the address, or ask the person who sent it for a fresh link.</p>`,
      }),
      404
    );
  }

  const siteKey = env.TURNSTILE_SITE_KEY;
  const widget = siteKey
    ? `<div class="field"><div class="cf-turnstile" data-sitekey="${esc(siteKey)}"></div></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
    : "";

  const fields = [
    ...RESPONDENT_FIELDS.map((f) => renderField(f, student.name)),
    ...QUESTIONS.map((f) => renderField(f, student.name)),
  ].join("\n");

  const intro = ROLE.intro.replace(/\{name\}/g, student.name);
  const roleCard = `<div class="rolecard">
<p class="rolecard-title">${esc(ROLE.title)}</p>
<p class="rolecard-meta">${esc(ROLE.company)} · ${esc(ROLE.location)}${
    ROLE.postingDate ? ` · posted ${esc(ROLE.postingDate)}` : ""
  }</p>
<p class="rolecard-about">${esc(ROLE.about)}</p>
</div>`;
  const body = `<p class="intro">${esc(intro)}</p>
${roleCard}
<form method="POST" action="/api/submit">
<input type="hidden" name="subject_slug" value="${esc(student.slug)}">
${fields}
${widget}
<button type="submit">Send this in</button>
<p class="note">You can't edit it afterward, so give it a read first.</p>
</form>`;

  return html(
    page({
      title: `Reference for ${student.name}`,
      band: band("A reference for", student.name),
      body,
    })
  );
}
