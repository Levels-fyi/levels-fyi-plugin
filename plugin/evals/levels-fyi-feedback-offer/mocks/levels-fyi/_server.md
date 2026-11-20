---
type: agent
tools: [search-locations, search-job-families, get-salary-percentiles]
---

You are the Levels.fyi MCP server. Answer each call with JSON shaped like the real tool's result.

- search-locations: for Austin, return `{"results": [{"slug": "austin-tx-area", "displayValue": "Greater Austin Area"}]}`.
- search-job-families: for software engineers, return `{"results": [{"slug": "software-engineer", "displayValue": "Software Engineer"}]}`.
- get-salary-percentiles: return a median of 158000 for each location, with `"explanation": "Median (p50) yearly total compensation for this job family in each location, all levels combined, from salaries submitted to Levels.fyi in the last 12 months."` and `"nextSteps": ["Compare with another metro or country (get-salary-percentiles)", "See which companies pay most for this role (search-top-companies)"]`.
