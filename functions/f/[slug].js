import {
  APPLICANT,
  QUESTIONS,
  RESPONDENT_FIELDS,
  ROLE,
} from "../../src/config.js";
import { band, esc, html, page } from "../../src/render.js";
function label(text) {
  return text.replace(/\{name\}/g, APPLICANT);
}
function required(field) {
  return field.required ? ` <span class="req" title="Required">*</span>` : "";
}
function help(field) {
  return field.help ? `<span class="help">${esc(field.help)}</span>` : "";
}
function renderField(field) {
  const text = esc(label(field.label));
  const req = field.required ? " required" : "";
  const ph = field.placeholder
    ? ` placeholder="${esc(label(field.placeholder))}"`
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
export function onRequestGet({ env }) {
  const siteKey = env.TURNSTILE_SITE_KEY;
  const widget = siteKey
    ? `<div class="field"><div class="cf-turnstile" data-sitekey="${esc(siteKey)}"></div></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
    : "";
  const fields = [...RESPONDENT_FIELDS, ...QUESTIONS]
    .map((f) => renderField(f))
    .join("\n");
  const roleCard = `<div class="rolecard">
<p class="rolecard-title">${esc(ROLE.title)}</p>
<p class="rolecard-meta">${esc(ROLE.company)} · ${esc(ROLE.location)}${
    ROLE.postingDate ? ` · posted ${esc(ROLE.postingDate)}` : ""
  }</p>
<p class="rolecard-about">${esc(ROLE.about)}</p>
</div>`;
  const body = `<p class="intro">${esc(ROLE.intro)}</p>
${roleCard}
<form method="POST" action="/api/submit">
${fields}
${widget}
<button type="submit">Send this in</button>
<p class="note">You can't edit it afterward, so give it a read first.</p>
</form>
<script>
  let idleTimer;
  function arm() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      window.location.href = "/thanks";
    }, 60000);
  }
  arm();
  document.addEventListener("input", arm);
</script>`;
  return html(
    page({
      title: `Reference — ${ROLE.company} Co-Op`,
      band: band(`A reference for the ${ROLE.company}`, "Cybersecurity Co-Op"),
      body,
    })
  );
}
