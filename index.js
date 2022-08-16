// fetching express module.
const express = require('express');

// mk new app through express function (or a function of express).
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const { User } = require('./models/User');

const config = require('./config/key');

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MonoDB Connected...'))
  .catch((err) => console.log('MongoDB connect error: ', err));

app.get('/', (req, res) => {
  res.send('Hello 고딕!');
});

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  // After fetching some information from client to sign up
  // give database that information.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
