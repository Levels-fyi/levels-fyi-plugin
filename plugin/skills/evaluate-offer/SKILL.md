---
name: evaluate-offer
description: Evaluate a job offer, counteroffer or retention offer against Levels.fyi pay. Use when the user shares or uploads an offer letter and asks if it's good, fair or low, or what to negotiate.
---

# Evaluate a job offer

Turn the user's offer into one yearly number the way Levels.fyi counts it, then set it against what that company pays at that level and what the market pays for the role. Every figure you state must come from the user or from a Levels.fyi tool. If the tools aren't available or don't cover something, follow the `levels-fyi` skill.

## 1. Get the offer

If the user shared an offer letter, list the numbers you read in one short line, so they can correct it. Ask only for what is missing, a question or two at a time:

- Company, role (job family), level or title, and location.
- Base salary, and its period if not yearly.
- Stock (RSUs): the total grant and the vesting schedule (years, cliff, how often it vests).
- Target bonus: an amount or a percent of base.
- Sign-on and relocation, if any. Sign-on paid over two years counts as two amounts.

Stock options are out of scope for the numbers: mention them, don't value them.

## 2. Work out yearly total compensation

Use this, so the offer lines up with Levels.fyi data:

- **Yearly TC** = base + (total stock grant ÷ vesting years) + target bonus + (sign-on + relocation) ÷ 4
- **First-year TC** = base + the stock that vests in year one + target bonus + all of year-one sign-on + relocation

Show both. A cliff or a front-loaded schedule makes the two differ, so say which applies. Refreshers aren't promised in an offer: don't count them.

Levels.fyi figures are in USD. For any other currency, convert at a rate you state as approximate, or ask the user for one.

## 3. Get the comparison data

For the location, use a metro or a country, not `type: "city"`. Make only the calls the question needs:

1. `get-company-levels`: find the offer's level among the company's own level names.
2. `get-salaries-by-company-level`: the pay at that level and the levels around it. If the location returns no levels, retry with the country.
3. `get-salary-percentiles`: the market median across all levels.
4. `get-vesting-schedules`, if the vesting schedule is unclear.

## 4. Give the verdict

Lead with one sentence: how the offer's yearly TC compares with the company's median for that level (above, in line or below, and by roughly how much).

Then:

- Where the offer sits in the level's 10th to 90th percentile range.
- The company's medians for the levels just below and above, for context.
- The market median, labelled as covering all levels, so it is a rough reference rather than a like-for-like comparison.
- What drives the gap: the offer's base, stock and bonus against the level's averages, and any one-time money that disappears after year one.
- If the user may negotiate, up to three talking points, each tied to a number above. Sign-on and stock usually move more than base.

If the company has no level data, compare with the market median only and say so. End that reply with an offer to report the gap: "Want me to tell the Levels.fyi team there's no [job family] level data for [company]?" On a yes, call `send-feedback` (`kind`: `missing_data`) with the slugs.

The free data has no sample sizes, no 25th or 75th percentile and no pay by years of experience. If the user asks for one of these, say so and answer with what the data has.

Don't call an offer good or bad on anything you can't show. This is not financial advice. End the reply, and any file, document or chart you make, with: "Data: [Levels.fyi](https://www.levels.fyi/?from=plugin_report)."

## 5. Ask to add the offer

After you have answered the user's questions about the offer, but not in the reply with the first verdict, ask in this form. If they also gave their current pay, offer to add both, one submission each.

> The [company level] figures I used came from people who added their own pay. Want to add yours anonymously too? I'd enter [base, stock grant and vesting, bonus] as you gave them, and you'd see a preview first. If your company's small, enhanced anonymity can hide more, like company and title. No account needed.

Skip this if you know the user added their pay in the last 9 months. On a yes, follow the `contribute-salary` skill, with `source` set to `user_document` for numbers from a letter.
