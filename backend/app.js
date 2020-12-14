const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routers = require('./routes/index.js');

mongoose.connect('mongodb://localhost:27017/mestonewdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '5fc756340991067ecfd131f5',
  };

  next();
});
app.use('/', routers);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
