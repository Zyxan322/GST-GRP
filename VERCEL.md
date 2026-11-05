# Deploying to Vercel

Import this repository into Vercel and use the repository root as the project root.
Vercel's `VERCEL=1` build environment selects Nitro's Vercel preset automatically;
the existing `npm run build` command generates the Vercel deployment output.

Use Node.js 24 for the Vercel project to match the generated serverless runtime.
Configure these environment variables in Vercel project settings to enable the
server-side features:

| Variable          | Required          | Purpose                                                  |
| ----------------- | ----------------- | -------------------------------------------------------- |
| `CHAT_API_KEY`    | For chat          | API key for the OpenAI-compatible chat provider          |
| `CHAT_BASE_URL`   | No                | Provider URL; defaults to Google's Gemini-compatible API |
| `CHAT_MODEL`      | No                | Provider model; defaults to `gemini-2.5-flash`           |
| `RESEND_API_KEY`  | For inquiry email | Resend API key used to deliver contact form submissions  |
| `INQUIRY_TO`      | No                | Recipient address; defaults to `sales@gstsaudi.com`      |
| `INQUIRY_FROM`    | No                | Verified Resend sender address                           |
| `ALLOWED_ORIGINS` | No                | Additional comma-separated origins allowed by API CORS   |

Keep provider and email credentials in Vercel's server-side environment variables;
do not use `VITE_` prefixes for secrets. After setting variables, redeploy so they
are available to the deployment.
