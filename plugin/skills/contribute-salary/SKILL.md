---
name: contribute-salary
description: Add the user's own salary or offer to Levels.fyi, after a preview. Use when they ask to add, share or submit their pay or an offer, or say yes after you offer. Not for other people's pay or estimates.
---

# Add the user's salary to Levels.fyi

Help the user add their own pay or an offer they received, using `add-salary-submission`. No account is needed. The user sees a preview first; without a sign-in they give an email, which Levels.fyi uses to send an optional verification request and to stop duplicate entries, and never publishes. Signing in is optional and ties the entry to their account.

This needs the connected Levels.fyi tools. If they aren't available, ask the user to connect Levels.fyi in their app's plugin or connector settings, and don't submit any other way.

## Ground rules

- Only the user's own pay or an offer they received. Never another person's pay, a number you estimated or took from Levels.fyi data, a range from a job posting, a hypothetical, or a test entry.
- Every number must come from the user's words or from a document they shared.
- A recruiter, hiring manager or HR person asking about candidates' or employees' pay is not sharing their own: don't offer this.
- "I make…" or "they offered me…" is a reason to offer once, not to add. Offer at most once per conversation, and never again after a no.
- One submission per job or offer. Never resubmit a confirmed one.

## 1. Gather what the preview needs

If the user shared an offer letter, comp statement or pay stub, take the details from it, list what you read so they can correct it, and ask only for what's missing. Otherwise ask for everything below that is still missing in one message, rather than field by field:

1. **Company, role and title.** Resolve with `search-companies` and `search-job-families`. Use `companyName` only when `search-companies` finds nothing. The title is the job title as the user states it.
2. **City.** Use `search-locations` with `type: "city"`; a metro, state or country won't work here.
3. **Offer or current pay?** For current pay, also ask how long they have been at the company (`yearsAtCompany`).
4. **Base salary,** its currency and period (`baseSalaryTimeUnit`, usually yearly).
5. **Years of experience** and **work arrangement** (remote, hybrid or office).

Set `source` yourself: `user_document` when the numbers come from a letter or pay stub the user shared, otherwise `user_stated`.

Don't call `add-salary-submission` until you have all of these. These help too, and the preview's `notProvided` lists the ones still missing:

- **Level.** The company's own level name from `get-company-levels`; companies with a ladder require it.
- **Stock.** For an offer: the total grant and the vesting schedule. For current pay: the stock value they receive per year.
- **Bonus.** For an offer: the target, as an amount or a percent of base. For current pay: the bonus they actually receive per year.
- **Sign-on and relocation,** and the **offer date** (`sourceDate`): offers only. For current pay, put sign-on and relocation in `otherDetails`.

For stock options, set `stockType` to `option` and send `totalOptionsGranted` (or `avgAnnualOptionsGranted` for current pay), `optionStrikePrice` and `optionPreferredPrice` (the latest price investors paid), with their currency. Don't put a dollar value on the options yourself.

Put nothing identifying in `otherDetails`: no names, managers, emails or links.

## 2. Turn a vesting description into a schedule

`vestingSchedule` has one entry per year: `percent` of the grant vesting that year, and `occurrences` (how many times it vests that year).

- "4 years, 1-year cliff, then quarterly": `[{percent:25, occurrences:1}, {percent:25, occurrences:4}, {percent:25, occurrences:4}, {percent:25, occurrences:4}]`
- "4 years, vests monthly": four entries of `{percent:25, occurrences:12}`
- "5/15/40/40": `[{percent:5, ...}, {percent:15, ...}, {percent:40, ...}, {percent:40, ...}]`, with occurrences as the user describes

If the user doesn't know, `get-vesting-schedules` shows the company's usual schedule. Confirm it with them before using it.

## 3. Preview, then confirm

1. Call `add-salary-submission` with `confirm: false`. Nothing is added by this call.
2. If the call returns an error, ask the user for what it names (a level for a company with a ladder, a city rather than a metro), then call `confirm: false` again.
3. If `notProvided` lists anything, ask for all of it in one message, and say they can skip any of it. Each answer must come from the user; never fill a gap from Levels.fyi data or a guess. If they give more, call `confirm: false` again.
4. When the result has `confirmPrompt`, say it word for word, then ask whether to add it. Don't add your own claims or counts. If there's no `confirmPrompt`, something required is still missing: ask for it, and preview again.
5. If the user asks something ("is this traceable?", "who sees it?"), answer once from the result's `privacy` and `hesitation` facts, then say `hesitation.choice`. "Not sure", "maybe later" or silence is a no: stop for this conversation, and don't call the tool again unless they come back and ask.
6. On a yes, if the result had `emailRequired`, ask for their email: Levels.fyi uses it only to send the optional verification request and to stop duplicate entries, and never shows it. Pass it as `email`. Never use it for anything else.
7. If the user asks for enhanced anonymity, set `anonymise: true` and call `confirm: false` again so the preview shows it. It hides company, title, level and team while few similar entries exist; the pay still counts.
8. Only after a clear yes to the latest preview, call again with the same arguments and `confirm: true`.

If `confirm: true` fails, fix what the error names, call `confirm: false` again and get a yes to that preview. Never call `confirm: true` again after a success.

## 4. After submitting

Reply in this form, leaving out the bracketed part when the result has no `placement`:

> Added, thank you. [Your total pay is {placement.vsMedian} against the {company} {level} median of {placement.medianTotalCompensation}, from {placement.submissions} entries.] Levels.fyi will email you shortly asking for an offer letter or pay stub; that's optional and only verifies the entry. It goes live after automated checks; some entries are held for review.

Without `placement`, say nothing about where their pay sits. Offer the result's `nextSteps` once, as options, without running them. Share the link the tool returns, then carry on with whatever the user was doing.
