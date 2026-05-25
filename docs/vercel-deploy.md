# Vercel Deploy Notes

## Current project

- GitHub repo: https://github.com/glennf/adhd-focus-name-test
- Current GitHub Pages URL: https://glennf.github.io/adhd-focus-name-test/
- Intended Vercel project type: static site, no build step
- Local path: `/Users/glenn/Projects/adhd-focus-name-test`

## What I found locally

- Vercel CLI is installed: `vercel 50.40.0`
- CLI is not logged in interactively: `vercel whoami` reports no credentials
- There appears to be a `VERCEL_TOKEN` entry in `~/.hermes/.env`, but the `.env` file cannot be safely sourced as shell because at least one value contains spaces/unquoted content. Do not print token values.

## Recommended deployment route

Use Vercel's GitHub integration instead of manual CLI deploys for this project.

Why:

- Every push to `main` deploys production automatically.
- Pull requests get preview deployments.
- No local token handling is needed.
- The current site is static and needs no build pipeline.

## Vercel project settings

When importing the GitHub repo in Vercel:

- Repository: `glennf/adhd-focus-name-test`
- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: `.`
- Install Command: leave empty
- Root Directory: `.`

## CLI alternative

If using CLI, authenticate first:

```bash
vercel login
```

Then from the project directory:

```bash
vercel link
vercel deploy
vercel deploy --prod
```

For non-interactive use with token, avoid committing `.vercel` or tokens. Use:

```bash
vercel deploy --prod --token "$VERCEL_TOKEN"
```

## After deploy

- Add the production URL to the Notion project page.
- Replace or de-emphasize the GitHub Pages URL if Vercel becomes canonical.
- Add analytics/events before inviting many respondents.

## Next data steps

1. Create variant URLs for names:
   - `/` default
   - `/?variant=klaro`
   - `/?variant=hodero`
   - `/?variant=neste`
2. Add event tracking:
   - CTA clicked
   - candidate card clicked
   - form submitted
   - selected favorite
3. Connect responses to Google Sheets, Supabase, Airtable, or Vercel Postgres.
4. Add a recall-test flow after 10 minutes or 24 hours.
