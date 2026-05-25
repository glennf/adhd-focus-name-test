# Vercel Deploy Notes

## Current project

- GitHub repo: https://github.com/glennf/adhd-focus-name-test
- Vercel production URL: https://navnetest.datasmie.no/
- Vercel fallback URL: https://adhd-focus-name-test.vercel.app/
- GitHub Pages fallback URL: https://glennf.github.io/adhd-focus-name-test/
- Google Sheet responses: https://docs.google.com/spreadsheets/d/1yX8FdD74uH8sKBObjVsaQ9zL856JM8rs2LE89ycD_dY/edit
- Intended Vercel project type: static site, no build step
- Local path: `/Users/glenn/Projects/adhd-focus-name-test`

## What I found locally

- Vercel CLI is installed locally.
- `VERCEL_TOKEN` is present in `~/.hermes/.env` and was verified with `vercel whoami --token`.
- Google Sheets response storage is configured with Vercel Production environment variables. Do not print or commit OAuth secrets. Current append range: `Responses_v2!A:S`.
- Project is linked to Vercel under `datasmie/adhd-focus-name-test`.
- `.vercel/` is ignored via `.gitignore` and should not be committed.

## Recommended deployment route

Use Vercel's GitHub integration for ongoing deploys after the initial CLI link/deploy.

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

- Keep https://navnetest.datasmie.no/ as the canonical test URL.
- Keep https://adhd-focus-name-test.vercel.app/ as Vercel fallback.
- Keep the GitHub Pages URL only as fallback/history.
- Verify form submissions write to the Google Sheet before inviting respondents.
- Add analytics/events before inviting many respondents.

## Next data steps

1. Variant URLs are live for names:
   - `/?variant=hodero`
   - `/?variant=tankerydd`
   - `/?variant=hodefred`
   - `/?variant=fokusflyt`
   - `/?variant=klaresinn`
2. Response storage:
   - Google Sheet: https://docs.google.com/spreadsheets/d/1yX8FdD74uH8sKBObjVsaQ9zL856JM8rs2LE89ycD_dY/edit
   - Vercel API route: `/api/submit`
   - Browser fallback: `localStorage` key `name-test-responses`
3. Add event tracking:
   - CTA clicked
   - candidate card clicked
   - form submitted
   - selected favorite
4. Add a recall-test flow after 10 minutes or 24 hours.
