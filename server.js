const express = require('express');
const path = require('path');

const port = process.env.PORT || 1337;
let app = express();

app.use(express.static('public'));
app.use(express.static('web-app'));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})