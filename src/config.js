// ---------------------------------------------------------------------------
// This is the only file you need to edit to change the form.
// Edit the ROLE, add applicants to ROSTER, change QUESTIONS. Nothing else moves.
// ---------------------------------------------------------------------------

// The position these references are for. {name} becomes the applicant's name.
// Edit this freely if the role or dates change.
export const ROLE = {
  company: "SkyWorks",
  title: "Cybersecurity Winter/Spring Co-Op (Jan–June 2027)",
  location: "Irvine, CA",
  postingDate: "August 20, 2026",
  // Shown on the form so recommenders know who they're vouching to. Fictional.
  about:
    "SkyWorks is a product company based in Irvine, California. Its cybersecurity team works alongside engineering and product on regulatory readiness (including the EU Cyber Resilience Act), data-security posture, and cyber-resilience testing. This co-op is a full-time, six-month term supporting that work.",
  intro:
    "{name} is applying for the SkyWorks Cybersecurity Winter/Spring Co-Op (Jan–June 2027) in Irvine, and asked you to speak to how they'd do in it. It takes about five minutes. What you write goes to {name} and may be shared with the SkyWorks hiring team, so write it the way you'd want it read.",
};

// Each applicant gets a link: https://your-site.pages.dev/f/<slug>
// slug = the tail of the URL (lowercase, no spaces). name = shown on the form.
export const ROSTER = [
  { slug: "jordan", name: "Jordan Reyes" },
  { slug: "amara", name: "Amara Chen" },
  { slug: "diego", name: "Diego Santos" },
];

// Fields about the person giving the reference.
export const RESPONDENT_FIELDS = [
  { id: "respondent_name", label: "Your name", type: "text", required: true },
  {
    id: "respondent_role",
    label: "Your title and where you work or study",
    type: "text",
    required: true,
    placeholder: "Lecturer, Dept. of Computer Science, State University",
  },
  { id: "respondent_email", label: "Your email", type: "email", required: true },
  {
    id: "respondent_phone",
    label: "Contact number",
    type: "tel",
    required: true,
    help: "A department, office, or work number is fine — it doesn't have to be your mobile.",
  },
];

// These three map to real database columns. Any other respondent field you add
// above is stored in the JSON blob automatically — no migration needed.
export const RESPONDENT_COLUMNS = [
  "respondent_name",
  "respondent_email",
  "respondent_phone",
];

// Questions about the applicant. Types: "text", "textarea", "choice".
// These map to what this co-op screens for: initiative, critical thinking,
// communication, follow-through, and genuine security interest. Reword freely —
// answers are stored as JSON, so changing this list needs no database change.
export const QUESTIONS = [
  {
    id: "relationship",
    label: "How do you know {name}, and for how long?",
    type: "text",
    required: true,
    placeholder: "Course instructor for two semesters; supervised their capstone",
  },
  {
    id: "initiative",
    label:
      "This role hands people ambiguous assignments and expects them to move things forward without being asked. Have you seen {name} work that way?",
    type: "textarea",
    required: true,
    help: "A specific instance is worth more than a general impression.",
  },
  {
    id: "critical_thinking",
    label:
      "How would you describe {name}'s critical thinking — questioning assumptions, telling a real risk from noise?",
    type: "textarea",
    required: true,
  },
  {
    id: "communication",
    label:
      "How is {name}'s written and verbal communication, especially explaining technical detail to a non-technical audience?",
    type: "textarea",
    required: true,
  },
  {
    id: "follow_through",
    label:
      "The work is juggling many open items to closure so nothing quietly drops. How does {name} handle organization and follow-through?",
    type: "textarea",
    required: true,
  },
  {
    id: "security_interest",
    label:
      "What's the basis for {name}'s interest in cybersecurity, compliance, or risk — coursework, certs, projects, anything you've seen?",
    type: "textarea",
    required: false,
    help: "Optional.",
  },
  {
    id: "recommend",
    label: "Would you recommend {name} for this co-op?",
    type: "choice",
    required: true,
    options: [
      "Yes, without reservation",
      "Yes, with some reservations",
      "Not at this time",
      "I'd rather not say",
    ],
  },
  {
    id: "anything_else",
    label: "Anything else the hiring team should know?",
    type: "textarea",
    required: false,
    help: "Optional. A concrete example carries further than a general endorsement.",
  },
];

export function findStudent(slug) {
  return ROSTER.find((s) => s.slug === slug.toLowerCase());
}
