const express = require('express');
const app = express();
const chatRouter = require('./routes/chat');

const port = 3002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', chatRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})