const axios = require("axios");
const ax = axios.create({
  baseURL: "https://braspag.visualstudio.com/DefaultCollection/",
  headers: {
    Authorization: `Basic ${process.env.PAT}`
  }
});

module.exports = {
  getAllTeamProjects: () => {
    return ax
      .get("/_apis/projects")
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
