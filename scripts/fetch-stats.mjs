import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8', shell: true });
}

function ghApi(url) {
  return JSON.parse(run(`gh api ${url}`));
}

function ghApiJq(url, jq) {
  const raw = run(`gh api ${url} --jq "${jq}"`);
  return JSON.parse(raw);
}

function ghGraphql(query) {
  const json = JSON.stringify({ query });
  writeFileSync('query.json', json);
  const result = run(`gh api graphql --input query.json --jq .data`);
  return JSON.parse(result);
}

const user = ghApiJq('users/alztrk', '{repos: .public_repos, followers: .followers}');
writeFileSync('src/user.json', JSON.stringify(user));

const tengra = ghApiJq('repos/TengraStudio/tengra', '{stars: .stargazers_count, forks: .forks_count}');
const xfilter = ghApiJq('repos/alztrk/xfilter', '{stars: .stargazers_count}');
writeFileSync('src/repos.json', JSON.stringify([tengra, xfilter]));

const events = ghApiJq('users/alztrk/events?per_page=5', '[.[] | {id: .id, type: .type, repo: .repo.name, created_at: .created_at}]');
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

try { run('del query.json 2>nul'); } catch {}

console.log('Stats refreshed');
