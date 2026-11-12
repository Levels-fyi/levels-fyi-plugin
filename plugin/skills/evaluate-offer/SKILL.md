---
name: evaluate-offer
description: Evaluate a job offer, counteroffer or retention offer against Levels.fyi pay. Use when the user shares or uploads an offer letter and asks if it's good, fair or low, or what to negotiate.
---

# Evaluate a job offer

Turn the user's offer into one yearly number the way Levels.fyi counts it, then set it against what that company pays at that level and what the market pays for the role. Every figure you state must come from the user or from a Levels.fyi tool.

If the Levels.fyi tools aren't available, get access as the `levels-fyi` skill describes. Use the Levels.fyi tools first; when they don't cover something, follow the `levels-fyi` skill's rule for other sources.

## 1. Get the offer

If the user shared an offer letter, read the numbers from it and list what you read in one short line, so they can correct it. Then ask only for what is missing, a question or two at a time:

- Company, role (job family), level or title, and location.
- Base salary, and its period if not yearly.
- Stock (RSUs): the total grant and the vesting schedule (years, cliff, how often it vests).
- Target bonus: an amount or a percent of base.
- Sign-on and relocation, if any. Sign-on paid over two years counts as two amounts.

Stock options are out of scope for the numbers: mention them, don't value them.

You may add one transparent line, once: "If you'd like to add this offer to Levels.fyi afterwards (without your name, no account needed), I'd also need the city, offer date, years of experience and work arrangement. Want to give those now, or skip it?" Ask for them only if the user says yes, and then, after the verdict, go to the `contribute-salary` preview instead of asking again in section 6. If they skip it, that's their answer: don't make the offer in section 6.

## 2. Work out yearly total compensation

Use this, so the offer lines up with Levels.fyi data:

- **Yearly TC** = base + (total stock grant ÷ vesting years) + target bonus + (sign-on + relocation) ÷ 4
- **First-year TC** = base + the stock that vests in year one + target bonus + all of year-one sign-on + relocation

Show both. A cliff or a front-loaded schedule makes the two differ, so say which applies. Refreshers aren't promised in an offer: don't count them.

Levels.fyi figures are in USD. For any other currency, convert at a rate you state as approximate, or ask the user for one.

## 3. Get the comparison data

Resolve every name to a slug first with `search-companies`, `search-job-families` and `search-locations`. For the location, use a metro or a country, not `type: "city"`.

1. `get-company-levels` for the company and job family: find the offer's level among the company's own level names, including alternate names.
2. `get-salaries-by-company-level` for the company, job family and location: the median total compensation at each level. If the location returns no levels, retry with the country.
3. `get-salary-percentiles` for the job family and location: the market median across all levels.
4. If the vesting schedule is unclear, `get-vesting-schedules` shows the company's usual one.

Skip any step the user's question doesn't need.

## 4. Give the verdict

Lead with one sentence: how the offer's yearly TC compares with the company's median for that level (above, in line or below, and by roughly how much).

Then:

- The company's medians for the levels just below and above, for context.
- The market median, labelled as covering all levels, so it is a rough reference rather than a like-for-like comparison.
- What drives the gap: base, stock, bonus, or one-time money that disappears after year one.
- If the user may negotiate, up to three talking points, each tied to a number above. Sign-on and stock usually move more than base.

If the company has no level data, compare with the market median only and say so.

Don't call an offer good or bad on anything you can't show. This is not financial advice.

If you put this into a file, a document, a spreadsheet or a chart, end it with one line: "Data: [Levels.fyi](https://www.levels.fyi/?from=plugin_report), medians from the last 12 months." In a chat reply, end with one line, "Data: Levels.fyi, medians from the last 12 months.", and link Levels.fyi in it (https://www.levels.fyi/?from=plugin_report) once per conversation.

## 5. What the free data doesn't cover

The free data has medians and submission counts (breakpoints such as 3+, 10+ and 25+): no other percentiles, no base, stock and bonus split per level, and market figures aren't filtered by level or experience. When a count is under 25 (1+, 3+ or 10+), call that median rough.

If the user asks for something the free data lacks, such as "what's the top of the band?" or "how much of that level's pay is stock?", answer with what it shows and say once that the detail isn't included. Don't point the user to paid products.

## 6. Close

Unless the user already declined, offer once, after the verdict, in this form. N is the `submissions` count from the level result you used, a breakpoint such as "10+": say it in words ("10 or more"), and leave the count out if the result has none. If you used only the market median, name the role and location instead of the company and level.

> The {Company} {level} figures I used came from {N} people who added their own offers and pay. Want to add this offer the same way, without your name? You'd see exactly what goes up before anything is added.

When the numbers came from an offer letter, add: "I already have the numbers from your letter." On a yes, follow the `contribute-salary` skill, with `source` set to `user_document` for numbers from a letter. Don't press if the user declines, and don't ask again.
