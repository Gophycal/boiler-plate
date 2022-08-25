// fetching express module.
const express = require('express');

// mk new app through express function (or a function of express).
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

app.use(cookieParser());

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

app.post('/login', (req, res) => {
  //Finding email requested from database
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Invalid email',
      });
    }

    //Confirming whether the password is same with the password in database
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log('err : ', err);
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Invalid password' });

      //Creating a token
      user.genToken((err, user) => {
        console.log('genToken is working');

        if (err) return res.status(400).send(err);

        //Storing a token into cookie or local storage
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
