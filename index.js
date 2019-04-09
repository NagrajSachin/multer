const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const port = 3000;
const hostname = 'localhost';
const url = "mongodb://localhost:27017/icon-font";

const connect = mongoose.connect(url, { useNewUrlParser: true });
connect
.then(db => console.log('connected to database')).catch(err => console.log(err));

const app = express();

app.use('/', router);

app.listen(port, hostname, () => {
  console.log('server listening on ' + hostname + ' : ' + port);
});
