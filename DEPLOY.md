# Deploying Vouch — browser only, no terminal

This gets the form online using only a web browser: GitHub in one tab, the
Cloudflare dashboard in another. Nothing runs on your computer. Set aside about
30 minutes the first time.

You'll do it in this order:

1. Put the code on GitHub
2. Create the database and its table
3. Point the code at the database
4. Connect the repo to Cloudflare Pages and deploy
5. Test it
6. Lock down the results page (do this before sharing any links)
7. Optional: spam protection, custom domain

Checkpoints (**✓**) tell you what you should be seeing before you move on. If a
checkpoint doesn't match, jump to Troubleshooting at the bottom.

---

## Before you start

- A **Cloudflare account** — you already have one; it's the dashboard in your
  screenshot.
- A **GitHub account** — free. If you don't have one, go to
  [github.com](https://github.com) and sign up. It takes two minutes and a
  confirmed email.
- The **vouch project folder** unzipped somewhere you can find it in Finder.

---

## Part 1 — Put the code on GitHub

GitHub is where your code lives. Cloudflare watches it and redeploys whenever it
changes, which is how you'll edit the questions later without any tools.

1. Signed in to GitHub, click the **+** at the top right → **New repository**.
2. Repository name: `vouch`. Leave it **Private** (this code has your roster in
   it — no reason to make it public). Don't add a README or any other file;
   you want it empty. Click **Create repository**.
3. On the next page you'll see a mostly empty repo. Find the link that says
   **uploading an existing file** (it's in the quick-setup text), or use
   **Add file → Upload files**.
4. Open Finder next to the browser. Select **everything inside** the vouch
   folder — all the files *and* the `functions`, `public`, and `src` subfolders
   — and drag them onto the upload drop zone in the browser. GitHub keeps the
   folder structure when you drag folders in.
5. Scroll down, leave the commit message as-is, and click **Commit changes**.

**✓** Your repo page now lists `README.md`, `schema.sql`, `wrangler.toml`, and
the `functions`, `public`, and `src` folders. Click into `functions`, then `f` —
you should see `[slug].js` sitting inside. If that nested file is there, the
upload worked. (If the `functions/f` folder is missing, see Troubleshooting.)

---

## Part 2 — Create the database

This is the SQLite database that stores each submission. Cloudflare calls it D1,
and you can set it up entirely in the dashboard.

1. In the Cloudflare dashboard's left sidebar, click **Storage & databases**,
   then **D1**.
2. Click **Create** (or **Create database**). Name it exactly `vouch-db` and
   confirm.
3. You're now on the database's page. Click the **Console** tab.
4. Open `schema.sql` from your project folder in any text editor, copy all of
   it, paste it into the console, and run it (the button is usually **Execute**
   or **Run**).

**✓** The console reports success with no errors. If you click the **Tables**
tab, you'll see a `responses` table.

### Copy the database ID — you need it in the next part

On the database's page (the **Settings** tab, or shown near the top) there's a
**Database ID** — a long string like `a1b2c3d4-....`. Copy it and keep it on your
clipboard or paste it somewhere for a moment. This is how the code finds this
exact database.

---

## Part 3 — Point the code at the database

Right now the code has a placeholder where the database ID goes. You'll fix that
by editing one file directly on GitHub — no download needed.

1. Back on your GitHub repo, click `wrangler.toml` to open it.
2. Click the **pencil icon** (top right of the file) to edit.
3. Find this line:

   ```
   database_id = "PASTE_YOUR_DATABASE_ID_HERE"
   ```

   Replace `PASTE_YOUR_DATABASE_ID_HERE` with the ID you copied — keep the
   quotation marks around it. It should end up looking like:

   ```
   database_id = "a1b2c3d4-1234-5678-9abc-def012345678"
   ```

4. Click **Commit changes** (green button), then confirm.

**✓** The `wrangler.toml` on GitHub now shows your real database ID, not the
placeholder. This file is what wires your code's `env.DB` to the database, so
the ID has to match exactly — no dashboard binding step is needed because it's
all declared here.

---

## Part 4 — Connect the repo and deploy

Now Cloudflare pulls the code from GitHub, builds it, and puts it online.

1. In the Cloudflare sidebar, go to **Compute** → **Workers & Pages** (this is
   where Pages projects live).
2. Click **Create application** → the **Pages** tab → **Connect to Git**.
3. Authorize GitHub when prompted. You can grant access to just the `vouch`
   repository rather than all of them. Then select `vouch` and click **Begin
   setup**.
4. On the build settings screen:
   - **Project name**: `vouch` (this becomes your URL, `vouch.pages.dev`).
   - **Production branch**: `main`.
   - **Framework preset**: None.
   - **Build command**: leave empty.
   - **Build output directory**: `public`.
5. Click **Save and Deploy**. The first build takes a minute or two.

**✓** When it finishes you get a live URL like `https://vouch.pages.dev`. The
project also now appears in Workers & Pages, and the D1 database in Storage &
databases shows this project as connected.

---

## Part 5 — Test it

1. Visit `https://vouch.pages.dev/f/jordan` (swap `jordan` for any slug in your
   roster — the starters are `jordan`, `amara`, `diego`).
2. Fill the form out with junk and submit. You should land on a "Thank you"
   page.
3. Visit `https://vouch.pages.dev/results`. Your test submission should be
   listed.

**✓** Both pages load and your test response shows up under `/results`. Delete
the test row later from the D1 Console with:
`DELETE FROM responses WHERE respondent_email = 'the-address-you-typed';`

If the form shows an error instead of a thank-you page, it's almost always the
database ID — see Troubleshooting.

---

## Part 6 — Lock down the results page (important)

Until you do this, **anyone who guesses `/results` can read every submission** —
names, emails, and work phone numbers. Do it before you send a single link.

1. In the sidebar, open **Zero Trust** (it may open in a new tab the first time
   and ask you to pick a team name — any name is fine, the free plan covers
   this).
2. Go to **Access** → **Applications** → **Add an application** →
   **Self-hosted**.
3. Give it a name like `vouch results`. For the application URL, set the domain
   to `vouch.pages.dev` and the path to `results`.
4. Add a policy: name it `me`, action **Allow**, and add a rule with selector
   **Emails** → your own email address.
5. Save.

**✓** Open `vouch.pages.dev/results` in a private/incognito window. You should be
asked to verify your email before the page loads. The form pages (`/f/...`) stay
open to everyone, which is what you want.

---

## Part 7 — Optional extras

### Spam protection (Turnstile)

The form works without this, but a link passed around openly attracts bots.

1. In the dashboard, search **Turnstile** (top search bar) and add a widget for
   `vouch.pages.dev`. It gives you a **Site key** and a **Secret key**.
2. In your Pages project → **Settings** → **Variables and Secrets**:
   - Add a **plaintext variable** named `TURNSTILE_SITE_KEY` with the site key.
   - Add a **secret** named `TURNSTILE_SECRET` with the secret key.
3. Redeploy: in the project's **Deployments** tab, open the latest deployment's
   menu and choose **Retry deployment** (or just commit any small change on
   GitHub). The spam check appears on the form automatically.

### A link that looks like yours

Since `bmitsuyasu.com` is already on this account, you can serve the form from a
subdomain instead of `pages.dev`:

1. Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter something like `refs.bmitsuyasu.com`. Cloudflare adds the DNS record
   for you since the domain is already here.

Links then read `refs.bmitsuyasu.com/f/jordan`. Purely cosmetic — the
`pages.dev` URL keeps working either way.

---

## Editing the form later

This is the payoff of the GitHub setup. To change questions or add a student:

1. On GitHub, open `src/config.js` and click the pencil to edit in the browser.
2. Change a question, add one to `QUESTIONS`, or add a line to `ROSTER`.
3. **Commit changes.**

Cloudflare notices the commit and redeploys within a minute. Answers are stored
as JSON, so changing questions never breaks old responses — they keep whatever
they had.

---

## When the project is done

The database holds real personal data. Don't leave it running once you've
collected what you need.

1. Export: `/results` has a **Download CSV** link. You can also run
   `SELECT * FROM responses;` in the D1 Console and copy the output.
2. Delete the Pages project: Workers & Pages → vouch → Settings → **Delete
   project**.
3. Delete the database: Storage & databases → D1 → vouch-db → **Delete**.
4. Optionally delete or make-private the GitHub repo (Settings → Danger Zone).

---

## Troubleshooting

**The `functions/f` folder didn't upload to GitHub.**
Some browsers drop nested folders on drag. Fix it in the browser: on the repo,
**Add file → Create new file**, and in the filename box type
`functions/f/[slug].js` — typing the slashes creates the folders. Paste the
file's contents from your local copy, and commit. Do the same for any other
missing file.

**The form shows "that didn't send" or an error after submitting.**
Almost always the database ID. Recheck that the `database_id` in `wrangler.toml`
on GitHub exactly matches the Database ID on the D1 page in Cloudflare, quotes
included. Fix it, commit, and the site redeploys. Confirm the `responses` table
exists (D1 → vouch-db → Tables).

**The deployment failed to build.**
Open the failed deployment in the Pages project to read the log. The usual cause
is the build output directory — it must be `public`, with the build command left
empty.

**`/results` is empty but I submitted a test.**
Make sure you submitted on the same deployment you're viewing, and that the slug
you used exists in `ROSTER`. Try submitting once more and refreshing `/results`.

**Turnstile shows an error on the form.**
The site key (plaintext variable) and secret key (secret) can't be swapped, and
both must be set. Recheck the two values in Settings → Variables and Secrets,
then redeploy.
