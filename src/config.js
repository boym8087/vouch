// ---------------------------------------------------------------------------
// This is the only file you need to edit to change the form.
// Edit the ROLE, change QUESTIONS, adjust the recommender fields. One form now
// serves every applicant — the recommender types in who they're recommending.
// ---------------------------------------------------------------------------

// The position these references are for. Fictional company, fictional posting.
export const ROLE = {
  company: "SkyWorks",
  title: "Cybersecurity Winter/Spring Co-Op (Jan–June 2027)",
  location: "Irvine, CA",
  postingDate: "August 20, 2026",
  // Shown on the form so recommenders know who they're vouching to.
  about:
    "SkyWorks is a cybersecurity company based in Irvine, California. Its cybersecurity team works alongside engineering and product on regulatory readiness (including the EU Cyber Resilience Act), data-security posture, and cyber-resilience testing. This co-op is a full-time, six-month term supporting that work.",
  intro:
    "You've been asked to give a reference for a student applying to the SkyWorks Cybersecurity Winter/Spring Co-Op (Jan–June 2027) in Irvine. It takes about five minutes. What you write goes to the student and may be shared with the SkyWorks hiring team, so write it the way you'd want it read.",
};

// Word used in the questions in place of a specific name, since one form now
// covers every applicant.
export const APPLICANT = "the applicant";

// Fields about the person giving the reference — plus who they're recommending.
export const RESPONDENT_FIELDS = [
  {
    id: "applicant_name",
    label: "Who are you recommending?",
    type: "text",
    required: true,
    help: "The student's full name, as it appears on their application.",
    placeholder: "Student Name",
  },
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

// These map to real database columns. Any other respondent field you add above —
// including applicant_name — is stored in the JSON blob automatically.
export const RESPONDENT_COLUMNS = [
  "respondent_name",
  "respondent_email",
  "respondent_phone",
];

// Questions about the applicant. Types: "text", "textarea", "choice".
// {name} is replaced with APPLICANT ("the applicant") at display time.
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
      "How would you describe {name}'s critical thinking?",
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
      "The job has many different projects in various stages of development at once. How does {name} handle organization and follow-through?",
    type: "textarea",
    required: true,
  },
  {
    id: "security_interest",
    label:
      "What's the basis for {name}'s interest in cybersecurity, compliance, or risk, coursework, certs, projects, anything you've seen?",
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

// Turn an applicant's typed name into a slug for grouping in the database.
export function slugifyName(name) {
  return (
    (name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "applicant"
  );
}
