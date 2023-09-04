import { Octokit } from "octokit";
import { DockerfileParser } from 'dockerfile-ast';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const org = "zpratt";

const repos = await octokit.request('GET /search/code', {
  q: `filename:Dockerfile user:${org} in:path`,
});

for (let repo of repos.data.items) {
  
  const { data: contents } = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}`, {
    owner: org, 
    repo: repo.repository.name,
    path: repo.path,
  });

  const decodedContent = atob(contents.content);
  const dockerFile = DockerfileParser.parse(decodedContent);
  const instructions = dockerFile.getInstructions();
  
  console.log(`Repo ${repo.repository.name} uses base image ${instructions}`);
}
