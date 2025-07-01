const express = require('express');
const app = express();
const userRouter = require('./routes/users');

const port = 3002;


app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})