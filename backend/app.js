const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const routers = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestonewdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());

// // Массив разешённых доменов
// const allowedCors = [
//   'http://localhost:3004/'
// ];

// app.use(function(req, res, next) {
//   const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок

//   if (allowedCors.includes(origin)) { // Проверяем, что значение origin есть среди разрешённых доменов
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/', routers);

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
