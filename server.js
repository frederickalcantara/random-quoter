const express = require("express");
const port = process.env.PORT || 3000;
let app = express();
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

module.exports = { port };
