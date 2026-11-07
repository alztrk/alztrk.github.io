import { execSync } from 'child_process';
import { rmSync, writeFileSync } from 'fs';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8', shell: true });
}

function ghApi(url) {
  const raw = run(`gh api "${url}"`);
  return JSON.parse(raw);
}

function ghGraphql(query) {
  const json = JSON.stringify({ query });
  writeFileSync('query.json', json);
  const result = run('gh api graphql --input query.json --jq .data');
  return JSON.parse(result);
}

const userRaw = ghApi('users/alztrk');
const user = {
  repos: userRaw.public_repos,
  followers: userRaw.followers,
};
writeFileSync('src/user.json', JSON.stringify(user));

const reposRaw = ghApi('users/alztrk/repos?per_page=100&sort=pushed');
const ignoredNames = new Set(['alztrk', 'alztrk.github.io']);

const repos = reposRaw
  .filter((repo) => !repo.fork && !ignoredNames.has(repo.name))
  .map((repo) => ({
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics || [],
    url: repo.html_url,
    homepage: repo.homepage || null,
    pushed_at: repo.pushed_at,
  }))
  .sort((a, b) => (b.stars - a.stars) || (new Date(b.pushed_at) - new Date(a.pushed_at)));

writeFileSync('src/repos.json', JSON.stringify(repos, null, 2));

const eventsRaw = ghApi('users/alztrk/events?per_page=5');
const events = (Array.isArray(eventsRaw) ? eventsRaw : []).map((event) => ({
  id: event.id,
  type: event.type,
  repo: event.repo?.name,
  created_at: event.created_at,
}));
writeFileSync('src/events.json', JSON.stringify(events));

const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const today = new Date().toISOString().split('T')[0];
const query = `query {
  user(login: "alztrk") {
    contributionsCollection(from: "${oneYearAgo}T00:00:00Z", to: "${today}T00:00:00Z") {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount date } }
      }
    }
  }
}`;
const contribData = ghGraphql(query);
const cal = contribData?.user?.contributionsCollection?.contributionCalendar;
if (cal) writeFileSync('src/contribs.json', JSON.stringify(cal));

try { rmSync('query.json', { force: true }); } catch {}

console.log('Stats refreshed successfully');
