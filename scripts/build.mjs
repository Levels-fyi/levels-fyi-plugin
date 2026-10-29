#!/usr/bin/env node
// Builds the Levels.fyi plugin from listing.json, package.json and plugin/skills/.
//
// Generated and committed (CI fails if they don't match a fresh build):
//   plugin/.claude-plugin/plugin.json, plugin/.mcp.json   Claude manifest and MCP server
//   plugin/plugin.json                                     OpenAI manifest (ChatGPT and Codex), also the Agent Plugins standard
//   plugin/mcp.json                                        Agent Plugins MCP server, which Antigravity also reads; the ChatGPT ZIP
//                                                          gets its own OpenAI mcp.json instead
//   plugin/.cursor-plugin/plugin.json, plugin/.cursor-mcp.json    Cursor manifest and MCP server
//   plugin/.antigravity-plugin/plugin.json, plugin/mcp_config.json   Antigravity manifest and MCP server
//   plugin/.plugin/plugin.json, plugin/.plugin/mcp.json    Open Plugin manifest and MCP server
//   plugin/README.md, plugin/LICENSE                       the listing description and the license
//   .claude-plugin/marketplace.json                        Claude Code: /plugin install levels-fyi --marketplace <repo>
//   .agents/plugins/marketplace.json                       Codex: codex plugin marketplace add <repo>
//   .cursor-plugin/marketplace.json                        Cursor: Import from Repo
//   CHANGELOG.md                                           from listing.releaseNotes
// Built for upload, not committed (attach them to a GitHub release):
//   dist/chatgpt/levels-fyi-<version>.zip                  upload to ChatGPT
//   dist/claude/levels-fyi-<version>.zip                   upload to claude.ai as a custom plugin
//   dist/claude-skills/<skill>-<version>.zip               upload one skill to claude.ai
// `--strict` fails on any warning, e.g. a TODO placeholder or a missing icon. Use it before releasing.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = join(ROOT, 'plugin');
const DIST = join(ROOT, 'dist');
const STAGE = join(DIST, '.stage');
const strict = process.argv.includes('--strict');

const readJson = path => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const writeText = (path, text) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};
const writeJson = (path, data) => writeText(path, `${JSON.stringify(data, null, 2)}\n`);

const listing = readJson('listing.json');
const { version } = readJson('package.json');
const warnings = [];
const errors = [];

// ---------- checks ----------

const PLATFORM_LIMITS = [
  ['displayName', listing.displayName, 30],
  ['shortDescription', listing.shortDescription, 30],
  ['description', listing.description, 4000],
  ['longDescription', listing.longDescription, 4000],
];
for (const [field, value, max] of PLATFORM_LIMITS) {
  if (!value) errors.push(`listing.${field} is required`);
  else if (value.length > max) errors.push(`listing.${field} is ${value.length} chars (max ${max})`);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(listing.name) || listing.name.length > 64) {
  errors.push('listing.name must be lowercase letters, numbers and single hyphens, at most 64 chars');
}
if (!/^\d+\.\d+\.\d+$/.test(version)) errors.push(`package.json version "${version}" must be semver`);
if (listing.defaultPrompts.length > 3) errors.push('OpenAI allows at most 3 defaultPrompts');
listing.defaultPrompts.forEach(p => p.length > 128 && errors.push(`defaultPrompt over 128 chars: "${p}"`));
if (listing.openai.capabilities.length > 20) errors.push('OpenAI allows at most 20 openai.capabilities');
listing.openai.capabilities.forEach(c => c.length > 120 && errors.push(`openai capability over 120 chars: "${c}"`));
if (listing.review.positive.length !== 5 || listing.review.negative.length !== 3) {
  warnings.push('OpenAI review expects 5 positive and 3 negative test cases');
}
if (listing.openai.onboardingSkill && !existsSync(join(PLUGIN, listing.openai.onboardingSkill))) {
  errors.push(`listing.openai.onboardingSkill: plugin/${listing.openai.onboardingSkill} doesn't exist`);
}
if (!listing.dataHandling) warnings.push('listing.dataHandling is missing: the README must say what data the plugin sends');

const releaseNotes = listing.releaseNotes?.[version];
if (!releaseNotes) warnings.push(`no release notes for version ${version}: add listing.releaseNotes["${version}"]`);

const placeholders = JSON.stringify(listing).match(/[^"]*TODO[^"]*/g) ?? [];
placeholders.forEach(value => warnings.push(`placeholder in listing.json: ${value}`));

for (const [key, path] of Object.entries(listing.assets)) {
  if (!existsSync(join(PLUGIN, path))) warnings.push(`missing asset ${key}: plugin/${path}`);
}
if (!existsSync(join(ROOT, 'LICENSE'))) errors.push('LICENSE is missing: the Claude directory requires one');

const skills = readdirSync(join(PLUGIN, 'skills'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();
const skillDescriptions = {};
for (const skill of skills) {
  const file = join(PLUGIN, 'skills', skill, 'SKILL.md');
  if (!existsSync(file)) {
    errors.push(`plugin/skills/${skill} has no SKILL.md`);
    continue;
  }
  const frontmatter = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const field = key => frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  if (field('name') !== skill) errors.push(`plugin/skills/${skill}: frontmatter name must equal the folder name`);
  const description = field('description');
  if (!description) errors.push(`plugin/skills/${skill}: frontmatter description is required`);
  // claude.ai's skill upload caps the description at 200 characters.
  else if (description.length > 200) errors.push(`plugin/skills/${skill}: description is ${description.length} chars (max 200)`);
  skillDescriptions[skill] = description;
}

// ---------- manifests ----------

const author = listing.author;
// Optional fields are left out while unset or still a placeholder; the TODO check above warns about them.
const optional = value => (!value || value.includes('TODO') ? undefined : value);
const license = optional(listing.license);
const repository = optional(listing.repository);
const repositorySlug = repository?.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/)?.[1];

// Attribution: links carry ?from=<app>_plugin, and MCP requests carry a header naming the app and plugin version,
// so Levels.fyi can count use per app. OpenAI rejects headers in public submissions, so its MCP URL carries
// ?client=openai-plugin instead, without a version: OpenAI can't change a submitted server's URL.
const tracked = (url, app) => {
  const link = new URL(url);
  link.searchParams.set('from', `${app}_plugin`);
  return link.toString();
};
const sourceUrl = app => {
  const url = new URL(listing.mcp.url);
  url.searchParams.set(listing.mcp.sourceParam, `${app}-plugin`);
  return url.toString();
};
const sourceHeaders = app => ({ [listing.mcp.sourceHeader]: `${app}-plugin/${version}` });
const httpMcp = app => ({
  mcpServers: { [listing.mcp.serverName]: { type: 'http', url: listing.mcp.url, headers: sourceHeaders(app) } },
});
if (!repositorySlug) warnings.push('listing.repository must be the GitHub URL of this repo');

const claudePlugin = {
  name: listing.name,
  displayName: listing.displayName,
  version,
  description: listing.description,
  author,
  homepage: tracked(listing.homepage, 'claude'),
  repository,
  license,
  keywords: listing.keywords,
  icon: listing.assets.icon,
  documentationUrl: listing.urls.documentation,
  supportUrl: listing.urls.support,
  privacyPolicyUrl: listing.urls.privacyPolicy,
  termsOfServiceUrl: listing.urls.termsOfService,
};
const claudeMcp = httpMcp('claude');
const claudeMarketplace = {
  name: listing.name,
  owner: { name: author.name, email: author.email },
  metadata: { description: listing.shortDescription },
  plugins: [{ name: listing.name, source: './plugin', description: listing.description }],
};

const openaiPlugin = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: listing.name,
  version,
  description: listing.description,
  author,
  homepage: tracked(listing.homepage, 'openai'),
  repository,
  license,
  keywords: listing.keywords,
  extensions: {
    'com.openai': {
      interface: {
        displayName: listing.displayName,
        shortDescription: listing.shortDescription,
        longDescription: listing.longDescription,
        developerName: author.name,
        category: listing.openai.category,
        capabilities: listing.openai.capabilities,
        websiteURL: tracked(listing.urls.website, 'openai'),
        supportURL: listing.urls.support,
        privacyPolicyURL: listing.urls.privacyPolicy,
        termsOfServiceURL: listing.urls.termsOfService,
        defaultPrompt: listing.defaultPrompts,
        brandColor: listing.brand.color,
        brandColorDark: listing.brand.colorDark,
        composerIcon: listing.assets.icon,
        composerIconDark: listing.assets.iconDark,
        logo: listing.assets.logo,
        logoDark: listing.assets.logoDark,
      },
      onboardingSkill: listing.openai.onboardingSkill,
      review: { test_cases: listing.review, commerce: listing.openai.commerce },
      publication: releaseNotes ? { release_notes: releaseNotes } : undefined,
    },
  },
};
// The server serves anonymous callers and signed-in ones, so auth is "mixed"; clients register themselves (DCR).
const openaiMcp = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
  mcpServers: {
    [listing.mcp.serverName]: {
      type: 'streamable-http',
      url: sourceUrl('openai'),
      extensions: {
        'com.openai': {
          auth: {
            type: 'mixed',
            client: { mode: 'dcr' },
            registrationUrl: listing.mcp.oauth.registrationUrl,
            baseScopes: listing.mcp.oauth.scopes,
          },
        },
      },
    },
  },
};
// Apps that read the Agent Plugins standard's mcp.json, Antigravity among them, get the plain URL and a source header:
// the OpenAI URL would mark them as ChatGPT, and the server would answer them as one.
const agentMcp = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
  mcpServers: {
    [listing.mcp.serverName]: { type: 'streamable-http', url: listing.mcp.url, headers: sourceHeaders('agent') },
  },
};
// Cursor, Antigravity and Open Plugin read the same skills/ folder; Cursor and Open Plugin use Claude's .mcp.json format.
const commonManifest = app => ({
  name: listing.name,
  displayName: listing.displayName,
  version,
  description: listing.description,
  author,
  homepage: tracked(listing.homepage, app),
  repository,
  license,
  keywords: listing.keywords,
});
const cursorPlugin = { ...commonManifest('cursor'), logo: listing.assets.logo, skills: './skills/', mcpServers: './.cursor-mcp.json' };
const antigravityPlugin = {
  $schema: 'https://antigravity.google/schemas/v1/plugin.json',
  ...commonManifest('antigravity'),
  logo: listing.assets.logo,
  suggestedPrompts: listing.defaultPrompts,
  skills: ['./skills'],
};
const antigravityMcp = {
  mcpServers: { [listing.mcp.serverName]: { serverUrl: listing.mcp.url, headers: sourceHeaders('antigravity') } },
};
const openPlugin = { ...commonManifest('open'), skills: './skills/', mcpServers: './.plugin/mcp.json' };
const cursorMarketplace = {
  name: listing.name,
  owner: { name: author.name },
  metadata: { description: listing.shortDescription },
  plugins: [{ name: listing.name, source: './plugin', description: listing.description }],
};

const codexMarketplace = {
  name: listing.name,
  interface: { displayName: listing.displayName },
  plugins: [
    {
      name: listing.name,
      source: { source: 'local', path: './plugin' },
      policy: { installation: 'AVAILABLE', authentication: listing.openai.authentication },
      category: listing.openai.category,
    },
  ],
};

// The listing description in Claude's directory, and what users see when they open the plugin.
const readme = `# ${listing.displayName}

${listing.longDescription}

## What you can do

${Object.entries(listing.capabilityGroups)
  .map(([group, items]) => `**${group}**\n\n${items.map(item => `- ${item}`).join('\n')}`)
  .join('\n\n')}

## Install

- **Claude (web, desktop and Cowork)**: open **Customize**, then **Plugins**, and add ${listing.displayName} from the directory.
${repositorySlug ? `- **Claude Code**: run \`/plugin install ${listing.name} --marketplace ${repositorySlug}\`.\n- **Codex**: run \`codex plugin marketplace add ${repositorySlug}\`, then install ${listing.displayName} from the plugin list.\n` : ''}- **ChatGPT**: add ${listing.displayName} from the plugin directory.
${repositorySlug ? `- **Cursor**: in **Dashboard** > **Plugins & MCPs**, select **Add Marketplace** > **Import from Repo** and enter \`https://github.com/${repositorySlug}\`.` : ''}

Then connect the ${listing.displayName} connector when asked. You can ask questions without signing in.

## Skills

${skills.map(skill => `- **${skill}**: ${skillDescriptions[skill]}`).join('\n')}

## Try asking

${listing.defaultPrompts.map(p => `- "${p}"`).join('\n')}

## Data

${listing.dataHandling ?? ''} The server is \`${listing.mcp.url}\`. Each request names the app it comes from, so Levels.fyi can count use per app: an \`${listing.mcp.sourceHeader}\` header with the plugin version, such as \`claude-plugin/${version}\`, or in ChatGPT and Codex a \`${listing.mcp.sourceParam}=openai-plugin\` parameter in the server URL. It holds nothing about you.

## Links

- [${listing.displayName}](${tracked(listing.urls.website, 'claude')})
- [Support](${listing.urls.support})
- [Privacy policy](${listing.urls.privacyPolicy})
- [Terms of service](${listing.urls.termsOfService})
`;

const changelog = `# Changelog

${Object.entries(listing.releaseNotes ?? {})
  .sort(([a], [b]) => b.localeCompare(a, undefined, { numeric: true }))
  .map(([v, note]) => `## ${v}\n\n${note}\n`)
  .join('\n')}`;

// ---------- report ----------

warnings.forEach(w => console.warn(`warning: ${w}`));
errors.forEach(e => console.error(`error: ${e}`));
if (errors.length || (strict && warnings.length)) {
  console.error(`\nBuild failed: ${errors.length} error(s), ${warnings.length} warning(s)${strict ? ' (strict)' : ''}.`);
  process.exit(1);
}

// ---------- write ----------

writeJson(join(PLUGIN, '.claude-plugin', 'plugin.json'), claudePlugin);
writeJson(join(PLUGIN, '.mcp.json'), claudeMcp);
writeJson(join(PLUGIN, 'plugin.json'), openaiPlugin);
writeJson(join(PLUGIN, 'mcp.json'), agentMcp);
writeJson(join(PLUGIN, '.cursor-plugin', 'plugin.json'), cursorPlugin);
writeJson(join(PLUGIN, '.antigravity-plugin', 'plugin.json'), antigravityPlugin);
writeJson(join(PLUGIN, 'mcp_config.json'), antigravityMcp);
writeJson(join(PLUGIN, '.cursor-mcp.json'), httpMcp('cursor'));
writeJson(join(PLUGIN, '.plugin', 'mcp.json'), httpMcp('open'));
writeJson(join(PLUGIN, '.plugin', 'plugin.json'), openPlugin);
writeText(join(PLUGIN, 'README.md'), readme);
cpSync(join(ROOT, 'LICENSE'), join(PLUGIN, 'LICENSE'));
writeJson(join(ROOT, '.claude-plugin', 'marketplace.json'), claudeMarketplace);
writeJson(join(ROOT, '.agents', 'plugins', 'marketplace.json'), codexMarketplace);
writeJson(join(ROOT, '.cursor-plugin', 'marketplace.json'), cursorMarketplace);
writeText(join(ROOT, 'CHANGELOG.md'), changelog);

rmSync(DIST, { recursive: true, force: true });
const zip = (cwd, archive, entries) => {
  mkdirSync(dirname(archive), { recursive: true });
  execFileSync('zip', ['-qrX', archive, ...entries, '-x', '*.DS_Store'], { cwd });
};
const stage = (name, paths) => {
  const dir = join(STAGE, name);
  paths.forEach(path => cpSync(join(PLUGIN, path), join(dir, path), { recursive: true }));
  return dir;
};

// ChatGPT: plugin.json, mcp.json, skills/ and assets/ at the archive root.
const chatgptStage = stage('chatgpt', ['plugin.json', 'skills', 'assets', 'LICENSE']);
writeJson(join(chatgptStage, 'mcp.json'), openaiMcp);
const chatgptZip = join(DIST, 'chatgpt', `${listing.name}-${version}.zip`);
zip(chatgptStage, chatgptZip, readdirSync(chatgptStage));

// ChatGPT test upload: ChatGPT connects a plugin's MCP server only as a registered app. For testing before the
// submission registers it, add the server under Plugins > Add > Add custom MCP server and build with its id:
//   OPENAI_TEST_APP_ID=asdk_app_... npm run build
// The test ZIP maps that app in .app.json instead of shipping mcp.json. Public submission rejects .app.json.
// The page URL shows the id as plugin_asdk_app_...; .app.json takes it without the plugin_ prefix.
const testAppId = process.env.OPENAI_TEST_APP_ID?.replace(/^plugin_/, '');
let chatgptTestZip;
if (testAppId) {
  const testStage = stage('chatgpt-test', ['skills', 'assets', 'LICENSE']);
  const testVersion = `${version}-test.${Date.now()}`;
  const testPlugin = structuredClone(openaiPlugin);
  testPlugin.version = testVersion;
  // The custom MCP server's own plugin can already hold the listing name in the account.
  testPlugin.name = `${listing.name}-test`;
  testPlugin.extensions['com.openai'].apps = './.app.json';
  // Review test cases must belong to one mcp.json server, and the test ZIP has none.
  delete testPlugin.extensions['com.openai'].review;
  writeJson(join(testStage, 'plugin.json'), testPlugin);
  writeJson(join(testStage, '.app.json'), { apps: { [listing.mcp.serverName]: { id: testAppId } } });
  chatgptTestZip = join(DIST, 'chatgpt', `${listing.name}-${testVersion}.zip`);
  zip(testStage, chatgptTestZip, readdirSync(testStage));
}

// Claude upload: only what Claude uses, and Claude shows just the icon.
const claudeStage = stage('claude', ['.claude-plugin', '.mcp.json', 'skills', listing.assets.icon, 'LICENSE', 'README.md']);
const claudeZip = join(DIST, 'claude', `${listing.name}-${version}.zip`);
zip(claudeStage, claudeZip, readdirSync(claudeStage));

// claude.ai skill upload: each archive has the skill folder as its root.
const skillZips = skills.map(skill => {
  const archive = join(DIST, 'claude-skills', `${skill}-${version}.zip`);
  zip(join(PLUGIN, 'skills'), archive, [skill]);
  return archive;
});

rmSync(STAGE, { recursive: true, force: true });
console.log(`\nBuilt ${listing.name} ${version}:`);
[chatgptZip, chatgptTestZip, claudeZip, ...skillZips].filter(Boolean).forEach(path => console.log(`  ${path.replace(`${ROOT}/`, '')}`));
if (warnings.length) console.log(`\n${warnings.length} warning(s): fix them before releasing (npm run build:strict).`);
