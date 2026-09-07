# Vouch — a short-run reference form on Cloudflare Pages

A form for collecting job / TA references. Each person you're vouching for gets
their own link; responses land in a private database you can read and export.
Runs on Cloudflare's free tier — fine for a week of this.

```
src/config.js          ← the only file you edit to change students or questions
functions/f/[slug].js  ← renders each person's form
functions/api/submit.js← validates and stores a submission
functions/results.js   ← your private view + CSV export
public/                ← styles, landing page
schema.sql             ← one table
wrangler.toml          ← project + database config
```

## Deploying it

**No terminal, all in the browser — see [DEPLOY.md](./DEPLOY.md).**
That's the recommended path: upload to GitHub, create the database in the
dashboard, connect the repo to Pages. Cloudflare hosts and rebuilds it; nothing
runs on your computer. Start there.

The terminal-based path is in the appendix at the bottom if you'd rather use
`wrangler`.

## Changing the form after people weigh in

Edit `src/config.js` — on GitHub, in the browser, with the pencil icon. Add a
question to `QUESTIONS`, reword one, drop one, reorder them, or add a person to
`ROSTER`. Commit, and Cloudflare redeploys within a minute. Answers are stored
as JSON, so there's no migration and older responses keep whatever they had.
`{name}` in any label is replaced with the person's name.

The same goes for `RESPONDENT_FIELDS`. Name, email and phone have real database
columns (listed in `RESPONDENT_COLUMNS`); anything else you add there is written
into the JSON blob and shows up on the results page and in the CSV on its own.

## Reading and exporting responses

`/results` lists every submission and filters by person. It has a **Download
CSV** link. You can also run `SELECT * FROM responses;` in the D1 Console in the
dashboard. Lock `/results` down with Cloudflare Access before sharing any links
(covered in DEPLOY.md, Part 6) — it's public otherwise.

## When the week is over

The database holds real names, emails and phone numbers. Export what you need,
then delete the Pages project and the D1 database (DEPLOY.md has the steps).
Don't leave it running.

---

## Appendix — deploying from a terminal instead

Needs Node.js 22+ and installs `wrangler` locally. Only do this if you'd rather
not use the browser flow.

```bash
npm install -g wrangler
wrangler login

# 1. Make the database, then paste the printed id into wrangler.toml
wrangler d1 create vouch-db

# 2. Create the table on the remote database
wrangler d1 execute vouch-db --remote --file=./schema.sql

# 3. Ship it
wrangler pages deploy
```

Local preview with a working database:

```bash
wrangler d1 execute vouch-db --local --file=./schema.sql
wrangler pages dev
```

Read the data from your machine:

```bash
wrangler d1 execute vouch-db --remote --command "SELECT * FROM responses"
```

Spam protection (Turnstile): create a widget in the dashboard, then
`wrangler pages secret put TURNSTILE_SECRET` for the secret key, and add
`TURNSTILE_SITE_KEY` as a plaintext variable under the project's Settings →
Variables. The widget appears on the next deploy.
