// ---------------------------------------------------------------------------
// This is the only file you need to edit to change the form.
// Add students, change questions, reorder them. Nothing else has to move.
// ---------------------------------------------------------------------------

// Each student gets a link: https://your-site.pages.dev/f/<slug>
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
    placeholder: "Lecturer, Dept. of Biology, State University",
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

// Questions about the candidate. Types: "text", "textarea", "choice".
// Add, remove, or reword freely — answers are stored as JSON, so there's no
// database change to make when this list changes.
export const QUESTIONS = [
  {
    id: "relationship",
    label: "How do you know {name}, and for how long?",
    type: "text",
    required: true,
    placeholder: "Supervised them for two semesters in the writing center",
  },
  {
    id: "strengths",
    label: "What are {name}'s strengths in a work or academic setting?",
    type: "textarea",
    required: true,
    help: "A few sentences is plenty. Concrete beats glowing.",
  },
  {
    id: "with_others",
    label: "How does {name} work with other people?",
    type: "textarea",
    required: true,
    help: "Explaining things to peers, taking direction, handling disagreement — whatever you've seen.",
  },
  {
    id: "recommend",
    label: "Would you recommend {name} for a job or TA position?",
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
    id: "example",
    label: "Anything else a hiring manager or faculty supervisor should know?",
    type: "textarea",
    required: false,
    help: "Optional. A specific example carries further than a general endorsement.",
  },
];

// These three have their own database columns. Any other respondent field you
// add above is stored in the JSON blob automatically — no migration needed.
export const RESPONDENT_COLUMNS = [
  "respondent_name",
  "respondent_email",
  "respondent_phone",
];

export function findStudent(slug) {
  return ROSTER.find((s) => s.slug === slug.toLowerCase());
}
