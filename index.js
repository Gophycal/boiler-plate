// fetching express module.
const express = require('express');

// mk new app through express function (or a function of express).
const app = express();
const port = 3000;

const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://gothic:abcd1234@cluster0.lm8gswh.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MonoDB Connected...'))
  .catch((err) => console.log('MongoDB connect error: ', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
