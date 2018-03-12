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
    const teamProjectIds = teamProjects.map(tp => tp.id);

    return teamProjectIds;
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

module.exports = {
  getAllTeamProjects,
  getAllRepositories
};
