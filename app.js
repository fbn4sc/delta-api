const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const vstsClient = require("./vstsAPIClient");

app.get("/", (req, res) => {
  res.send("Delta API.");
});

app.get("/team-projects", (req, res) => {
  vstsClient.getAllTeamProjects().then(data => {
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
