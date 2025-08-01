const express = require('express');
const app = express();
const chatRouter = require('./routes/chat');
const pictureRouter = require('./routes/picture');
const reactRouter = require('./routes/react');
const uploadRouter = require('./routes/upload');

const port = 3002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', chatRouter);
app.use('/', pictureRouter);
app.use('/', reactRouter);
app.use('/', uploadRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})