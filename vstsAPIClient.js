const axios = require("axios");
const ax = axios.create({
  baseURL: process.env.baseVSTSURL,
  headers: {
    Authorization: `Basic ${process.env.PAT}`
  }
});

const getAllTeamProjects = () => {
  return ax
    .get("/_apis/projects")
    .then(res => {
      return res.data.value;
    })
    .catch(err => {
      console.log(err);
    });
};

const getAllRepositories = async () => {
  const teamProjectIds = await getAllTeamProjects().then(teamProjects => {
    const ids = teamProjects.map(tp => tp.id);

    return ids;
  });

  let allRepositories = [];

  await Promise.all(
    teamProjectIds.map(tpi =>
      ax.get(`${tpi}/_apis/git/repositories`).then(res => {
        const repos = res.data.value;
        allRepositories = allRepositories.concat(repos);
      })
    )
  );

  return allRepositories;
};

const getAllCommits = async () => {
  const repositoryIds = await getAllRepositories().then(repositories => {
    const ids = repositories.map(repo => repo.id);

    return ids;
  });

  let allCommits = [];

  await Promise.all(
    repositoryIds.map(id =>
      ax
        .get(`/_apis/git/repositories/${id}/commits?$top=9999999`)
        .then(res => {
          const commits = res.data.value;
          allCommits = allCommits.concat(commits);
        })
        .catch(error => console.log(error))
    )
  );

  return allCommits;
};

module.exports = {
  getAllTeamProjects,
  getAllRepositories,
  getAllCommits
};
