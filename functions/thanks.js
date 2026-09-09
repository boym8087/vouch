import { band, html, page } from "../src/render.js";

export function onRequestGet() {
  return html(
    page({
      title: "Security Awareness Exercise",
      band: band("Heads up", "This was a phishing exercise"),
      body: `<p class="intro">The form you just submitted was a demonstration. In a real attack, everything you entered — your name, email, phone, and answers — would now be in someone else's hands, and the "company" and job posting were fabricated to earn your trust.</p>
<p class="intro">Nothing here is a real opportunity. This is what a convincing phishing page looks like from the inside.</p>
<div class="video">
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe>
</div>
<h2>What gave it away</h2>
<ul>
<li>An unexpected request for personal detail, framed around someone you know</li>
<li>A domain that isn't the real company's</li>
<li>Pressure to submit quickly — "you can't edit this afterward"</li>
<li>No verifiable path back to a real organization</li>
</ul>`,
    })
  );
}
