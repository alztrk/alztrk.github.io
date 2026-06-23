import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

function gh(query, jq) {
  const cmd = `gh api ${query} --jq '${jq}'`;
  return JSON.parse(execSync(cmd, { encoding: 'utf-8' }));
}

function ghGraphql(query) {
  const cmd = `gh api graphql -f query='${query}' --jq '.data'`;
  return JSON.parse(execSync(cmd, { encoding: 'utf-8' }));
}

// User stats
const user = gh('users/alztrk', '{repos: .public_repos, followers: .followers}');
writeFileSync('src/user.json', JSON.stringify(user));

// Repo stats
const tengra = gh('repos/TengraStudio/tengra', '{stars: .stargazers_count, forks: .forks_count}');
const xfilter = gh('repos/alztrk/xfilter', '{stars: .stargazers_count}');
writeFileSync('src/repos.json', JSON.stringify([tengra, xfilter]));

// Events
const events = gh('users/alztrk/events?per_page=5', '[.[] | {id: .id, type: .type, repo: .repo.name, created_at: .created_at}]');
writeFileSync('src/events.json', JSON.stringify(events));

// Contributions (GraphQL)
const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const today = new Date().toISOString().split('T')[0];
const contribQuery = `{
  user(login: "alztrk") {
    contributionsCollection(from: "${oneYearAgo}T00:00:00Z", to: "${today}T00:00:00Z") {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { contributionCount date }
        }
      }
    }
  }
}`;
const contribData = ghGraphql(contribQuery);
writeFileSync('src/contribs.json', JSON.stringify(contribData.user.contributionsCollection.contributionCalendar));

console.log('Stats refreshed successfully');
