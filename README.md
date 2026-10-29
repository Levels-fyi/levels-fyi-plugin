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
| Claude (web, desktop, Cowork) | **Customize** > **Plugins**, then add Levels.fyi from the directory |
| Claude Code | `/plugin install levels-fyi --marketplace Levels-fyi/levels-fyi-plugin` |
| ChatGPT | Add Levels.fyi from the plugin directory |
| Codex | `codex plugin marketplace add Levels-fyi/levels-fyi-plugin`, then install Levels.fyi |
| Cursor | **Dashboard** > **Plugins & MCPs** > **Add Marketplace** > **Import from Repo**, then enter `https://github.com/Levels-fyi/levels-fyi-plugin` |
| Any MCP client | Add `https://mcp.levels.fyi/` as a remote MCP server |
| Other agents (skills) | `npx skills add Levels-fyi/levels-fyi-plugin`, then add `https://mcp.levels.fyi/` as a remote MCP server, or let the agent connect it on first use |

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

## License

See [LICENSE](LICENSE). "Levels.fyi" and the Levels.fyi logos are trademarks of Levels.fyi.
