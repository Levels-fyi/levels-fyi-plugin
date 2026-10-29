#!/usr/bin/env node
// Runs the eval suite in plugin/evals/ with `claude plugin eval`, against the real Levels.fyi MCP server.
//   npm run eval                          every case, 3 runs per arm (with and without the plugin)
//   npm run eval -- --runs 1 --case 'get-started-*'
// Extra arguments go to `claude plugin eval`. Each run uses your own Claude account.
// Keep -j at 2 or less: runs share one IP, and anonymous calls are limited to 20 a minute per IP.
//
// Only read-only tools are granted, and not get-profile, so a run can't read your profile or write anything.
// The contribute-salary cases mock the server (see their mocks/), so no run can add a real salary.

import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const READ_ONLY_TOOLS = [
  'get-permissions', 'get-salary-percentiles', 'get-salaries-by-company-level', 'search-raw-data-points',
  'get-company', 'get-company-levels', 'get-company-group', 'search-companies', 'search-companies-by-vesting',
  'search-top-companies', 'get-location', 'get-location-stats', 'search-locations', 'get-job-family',
  'search-job-families', 'search-job-titles', 'search-focus-areas', 'search-role-terms',
  'get-salary-submission-by-id', 'get-vesting-schedules', 'search-jobs', 'get-job', 'search-all',
  'get-available-filters', 'get-metric-explanation', 'get-domain-knowledge',
];
const grants = READ_ONLY_TOOLS.map(tool => `mcp__plugin_levels-fyi_levels-fyi__${tool}`);

const args = ['plugin', 'eval', join(ROOT, 'plugin'), '--allow-real-servers', '--trust-plugin', '--no-publish',
  ...process.argv.slice(2), '--allow-tools', ...grants];
const { status } = spawnSync('claude', args, { stdio: 'inherit' });
process.exit(status ?? 1);
