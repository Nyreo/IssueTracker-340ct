// dot env
require('dotenv').config({path: __dirname + '/.env'})

const express = require('express');
const path = require('path');
const app = express();

const defaultPort = 9000
const port = process.env.PORT || defaultPort

app.use(express.static(path.join(__dirname, '../', 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(`${__dirname}`, '../', 'build', 'index.html'));
});
app.listen(port, async () => console.log(`Starting static deployment on port: ${port}...`));