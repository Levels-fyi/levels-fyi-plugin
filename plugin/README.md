# Levels.fyi

Salaries, jobs and career insights from 1M+ salaries shared on Levels.fyi, across 100+ roles. Ask in your own words ("What does a Google L5 make?", "Is my Stripe offer good?", "Remote PM jobs over $200k"). Benchmark your pay, check a raise, promotion or merit cycle, evaluate and compare offers and counteroffers, compare company levels, locations and vesting schedules, and search open jobs. Share an offer letter or comp statement and it reads the numbers for you. No account needed to ask questions, and you can add your own salary with just an email. Sign in to read your profile or upload a resume. Before anything is added to Levels.fyi, you see a preview and confirm it.

## What you can do

**Salaries**

- Look up pay by company and level
- Benchmark your own pay, a raise or a promotion
- Benchmark pay by role and location
- See the newest salaries people shared

**Offers**

- Evaluate a job offer
- Compare two or more offers, or an offer and your current job

**Jobs**

- Search open jobs, with their pay ranges

**Contribute**

- Add your salary or offer to Levels.fyi, with just an email

**Your profile (sign-in needed)**

- Read your Levels.fyi profile
- Search jobs starting from your profile
- Upload your resume

## Install

- **Claude (web, desktop and Cowork)**: open **Customize**, then **Plugins**, and add Levels.fyi from the directory.
- **Claude Code**: run `/plugin install levels-fyi --marketplace Levels-fyi/levels-fyi-plugin`.
- **Codex**: run `codex plugin marketplace add Levels-fyi/levels-fyi-plugin`, then install Levels.fyi from the plugin list.
- **ChatGPT**: add Levels.fyi from the plugin directory.
- **Cursor**: in **Dashboard** > **Plugins & MCPs**, select **Add Marketplace** > **Import from Repo** and enter `https://github.com/Levels-fyi/levels-fyi-plugin`.

Then connect the Levels.fyi connector when asked. You can ask questions without signing in.

## Skills

- **benchmark-my-pay**: Benchmark the user's current pay with Levels.fyi data. Use for 'am I underpaid', raise or promotion talks, merit-cycle or comp statements, equity refreshers, and recruiter pay-expectation questions.
- **compare-offers**: Compare job offers side by side with Levels.fyi pay data. Use when the user has two or more offers, a counteroffer, or an offer and their current job, and asks which to take or which pays more.
- **contribute-salary**: Add the user's own salary or offer to Levels.fyi. Use when the user wants to share, submit or add their pay, including from an offer letter or comp statement, or says yes after you offer to add it.
- **evaluate-offer**: Evaluate a job offer, counteroffer or retention offer against Levels.fyi pay. Use when the user shares or uploads an offer letter and asks if it's good, fair or low, or what to negotiate.
- **get-started**: Show what Levels.fyi can do and suggest first questions. Use right after the plugin is installed, or when the user asks what Levels.fyi can do or how to start.
- **levels-fyi**: Answer pay and job questions with Levels.fyi data, or report wrong or missing data. Use for any salary or pay question, company pay by level, pay by city or country, RSU vesting, or open jobs.

## Try asking

- "I'm a Google L5 in Seattle making $190k base and $120k stock a year. Am I underpaid?"
- "I have a Stripe offer: $210k base, $400k RSUs over 4 years. Is it good?"
- "Find remote product manager jobs that pay at least $200k base."

## Data

The plugin has no code of its own: its skills are instructions for the assistant. To answer, the assistant sends the companies, roles, levels and locations you ask about to the Levels.fyi MCP server. It also sends what you choose to share: a salary or offer you add, with your email if you aren't signed in, or a resume you upload after signing in. If you agree, it sends a short report when you say Levels.fyi data is wrong or missing, without personal details unless you add your email for a reply. Levels.fyi handles that data under its privacy policy. The server is `https://mcp.levels.fyi/`. Each request names the app it comes from, so Levels.fyi can count use per app: an `X-Levels-Source` header with the plugin version, such as `claude-plugin/1.0.0`, or in ChatGPT and Codex a `client=openai-plugin` parameter in the server URL. It holds nothing about you.

## Links

- [Levels.fyi](https://www.levels.fyi/?from=claude_plugin)
- [Support](https://levelsfyi.notion.site/Levels-fyi-Support-Docs-28c80c57d9ae8141ae6efaa1a2f322b2)
- [Privacy policy](https://www.levels.fyi/about/privacy.html)
- [Terms of service](https://www.levels.fyi/about/terms.html)
