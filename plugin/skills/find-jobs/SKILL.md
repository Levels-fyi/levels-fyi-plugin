---
name: find-jobs
description: Find open jobs on Levels.fyi with the pay each posting states. Use when the user asks for jobs, open roles, who's hiring, or jobs that pay more than they make. Not for recruiters sourcing candidates.
---

# Find open jobs

Search the Levels.fyi job board and show pay where the posting states it. Every figure you state must come from a posting, the user, or a Levels.fyi tool.

If the Levels.fyi tools aren't available, get access as the `levels-fyi` skill describes. Use Levels.fyi jobs, not results from web job boards.

## 1. Know what to search

- If the user names a role and a place, resolve them with `search-job-families` and `search-locations`, and any company with `search-companies`. One location per search, and only one the user named.
- If they name no role, offer to start from their Levels.fyi profile. Call `get-profile` only if they agree, show the role, level and location you'd search with, and let them change them: a profile describes the job they have, not always the one they want next. If it needs a sign-in, show the user the sign-in step the error gives, and ask for the role and place instead.
- If the user has a resume in the chat and wants it on Levels.fyi, say in one line that Levels.fyi reads it to fill in their profile (title, level, skills and work history) so searches can start from it, and that recruiters see the profile only if they turn on "open to opportunities" in their Levels.fyi settings. Call `upload-resume` only after they agree; it needs a sign-in. If you can read the file and make HTTP requests yourself, post it to the result's `upload.url` as the tool describes; otherwise give them `webUploadUrl`.

## 2. Search

Call `search-jobs` with a `query` of role terms that appear in job posts, plus `locationSlug`, `jobFamilySlugs`, and any company, level or work arrangement the user named. If they said what base they make today, or the least they'd take, pass it as `minBaseCompensation`: postings mostly state base pay, and the filter compares it with the top of each posting's range, so say that. If nothing matches, drop a filter or simplify the query and try once more; if there's still nothing, say so rather than listing unrelated jobs. Keep paging while `nextOffset` isn't null if they want more.

## 3. Show

Put each job's `url` on its title. List the pay range each posting states, and say when a posting gives none. For the top one or two, call `get-job` and summarise the description and the stated range. `get-job` also gives Levels.fyi's estimated total compensation by level for the role (`matchesThisPosting` marks the posting's level); when a posting states base pay only, say so rather than comparing it with a total.

## 4. Close

If the result has `nextSteps`, offer them as options without running them. Offer the resume once, if you haven't already, and never after a no. If the user said what they earn today and you haven't offered this conversation, offer once to add it to Levels.fyi without their name (see `contribute-salary`); never after a no.
