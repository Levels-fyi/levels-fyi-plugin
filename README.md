# Levels.fyi plugin for Claude, ChatGPT, Codex, Cursor and Antigravity

[![skills.sh](https://skills.sh/b/Levels-fyi/levels-fyi-plugin)](https://skills.sh/Levels-fyi/levels-fyi-plugin)

Salaries, jobs and career insights from [Levels.fyi](https://www.levels.fyi), right in your AI assistant. Benchmark
your compensation, evaluate and compare job offers, compare company levels and pay by location, search open jobs, and
add your own salary.

The plugin bundles the Levels.fyi MCP server (`https://mcp.levels.fyi/`) with skills that teach the assistant how to
use it. No account is needed to ask questions, and adding your own salary needs only an email. Sign in to read your profile or upload a resume.

This is the free version of Levels.fyi for individuals. It has pay by job family, location and company level.

## Install

| App | How |
|---|---|
| Claude (web, desktop, Cowork) | Click **Plugins** in the left sidebar, then search for Levels.fyi and install it. For the connector only, [add it in one click](https://claude.ai/new?modal=add-custom-connector&connectorName=Levels.fyi&connectorUrl=https%3A%2F%2Fmcp.levels.fyi%2F) |
| Claude Code | `claude plugin marketplace add Levels-fyi/levels-fyi-plugin && claude plugin install levels-fyi@levels-fyi` |
| ChatGPT | [Add Levels.fyi to ChatGPT](https://chatgpt.com/plugins/plugin_asdk_app_6ae3865358688191a1e33cfb669dc25a) |
| Codex | `codex plugin marketplace add Levels-fyi/levels-fyi-plugin && codex plugin add levels-fyi@levels-fyi` |
| Cursor | **Dashboard** > **Plugins & MCPs** > **Add Marketplace** > **Import from Repo**, then enter `https://github.com/Levels-fyi/levels-fyi-plugin`. For the MCP server only, [add it in one click](https://cursor.com/install-mcp?name=levels-fyi&config=eyJ1cmwiOiJodHRwczovL21jcC5sZXZlbHMuZnlpLyJ9) |
| Antigravity | Open `antigravity://customizations/marketplaces/antigravity-plugins-partners/plugins/levels-fyi` to install it from the Antigravity Marketplace, or run `agy plugin install https://github.com/Levels-fyi/levels-fyi-plugin` |
| Kiro | [![Add to Kiro](https://kiro.dev/images/add-to-kiro.svg)](https://kiro.dev/launch/mcp/add?name=levels-fyi&config=%7B%22url%22%3A%22https%3A%2F%2Fmcp.levels.fyi%2F%22%2C%22disabled%22%3Afalse%2C%22autoApprove%22%3A%5B%5D%7D) |
| Gemini | In the Gemini web app, open Settings > [Connected Apps](https://gemini.google.com/apps), click **Add a custom app** and enter `https://mcp.levels.fyi/` (personal Google account in the US) |
| Any MCP client | Add `https://mcp.levels.fyi/` as a remote MCP server, for example `claude mcp add --transport http levels-fyi https://mcp.levels.fyi/` |
| Other agents (skills) | `npx skills add Levels-fyi/levels-fyi-plugin`, then add `https://mcp.levels.fyi/` as a remote MCP server, or let the agent connect it on first use |

To check it works, ask: "Use Levels.fyi to check what a Google L5 software engineer makes in Seattle and whether Google is hiring there."

## What's inside

| Skill | What it does |
|---|---|
| [`evaluate-offer`](plugin/skills/evaluate-offer/SKILL.md) | Checks a job offer against Levels.fyi pay data for the company, level and location |
| [`compare-offers`](plugin/skills/compare-offers/SKILL.md) | Compares two or more offers side by side, yearly and over four years |
| [`benchmark-my-pay`](plugin/skills/benchmark-my-pay/SKILL.md) | Benchmarks your current pay, a raise, a promotion or a comp statement against your company's levels |
| [`contribute-salary`](plugin/skills/contribute-salary/SKILL.md) | Adds your salary or offer to Levels.fyi, after you confirm a preview |

See [plugin/README.md](plugin/README.md) for example prompts and what data the plugin sends.

## For employers

Levels.fyi has paid products for compensation, HR and recruiting teams:

- **[API and MCP](https://www.levels.fyi/api-access).** 40 tools for Claude, ChatGPT, Cursor or your own agents, with
  more filters for precise compensation benchmarking, full results and competitive intelligence on other companies.
  Also available as a REST API, or a CLI on request.
- **[Compensation Data](https://www.levels.fyi/offerings/data).** Benchmarks and the Data Explorer for setting and
  reviewing pay bands, with percentiles refreshed daily.
- **[Interactive Offers](https://www.levels.fyi/offerings/interactive-offers).** Offer letters that candidates
  actually understand.

[Book a demo](https://www.levels.fyi/api-access) or email [sales@levels.fyi](mailto:sales@levels.fyi).

## Development

`listing.json` is the single source for every listing. The build generates the manifests in `plugin/` and the
marketplaces from it. Edit the skills in `plugin/skills/`.

```bash
npm run build:strict   # generate plugin/, the marketplaces and CHANGELOG.md
npm run validate       # run Claude's directory checks
```

## Privacy and support

- Privacy policy: https://www.levels.fyi/about/privacy.html
- Terms of service: https://www.levels.fyi/about/terms.html
- Support: https://levelsfyi.notion.site/Levels-fyi-Support-Docs-28c80c57d9ae8141ae6efaa1a2f322b2 or [team@levels.fyi](mailto:team@levels.fyi)

## License

The code and skills in this repository are MIT licensed: see [LICENSE](LICENSE). The license does not grant any right to use
the Levels.fyi name or logos, which are trademarks of Levels.fyi, or to use the Levels.fyi service and its data, which
the [Levels.fyi Terms of Service](https://www.levels.fyi/about/terms.html) govern.
