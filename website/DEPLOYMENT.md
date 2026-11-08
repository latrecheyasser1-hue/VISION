# Cloudflare deployment

Verified live on 2026-10-26: https://vision.buildwithvision.workers.dev/

Cloudflare Worker: `vision`. Dashboard showed deployment `ed1d65a5` ready at 100%, with static assets only. Deployment completed through the dashboard folder upload flow. No custom domain is attached yet.

Public bundle: `node build-deploy.mjs` produces `deploy/` (26 files). Upload only this directory for future dashboard deployments. Local JavaScript syntax checks passed. The live homepage rendered with the approved typography/artwork and no horizontal overflow; the introductory video loaded to readyState 4 without media errors. Live browser error log was empty during this smoke check.

Custom domain purchase and attachment remain pending. GitHub continuous deployment is not configured. Administration, authentication, and client project tracking remain future work.
