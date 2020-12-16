const bcrypt = require('bcryptjs'); 
// const validator = require('validator');
const User = require('../models/user');
const { errorHandler } = require('../utils/error-handler');
const jwt = require('jsonwebtoken');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => errorHandler(res, err));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      const error404 = new Error('Нет пользователя с таким id');
      error404.statusCode = 404;
      throw error404;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(res, err));
};

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      const error404 = new Error('Нет пользователя с таким id');
      error404.statusCode = 404;
      throw error404;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(res, err));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
    .status(400)
    .send({ message: 'в запросе переданы неверные значения' });
  }

  User.findOne({ email })
  .then((user) => {
    if (user) {
      return res.status(403).send({ message: 'пользователь с этим email уже существует' });
    }
  })

  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => errorHandler(res, err));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, '693d9a39fba9bdab5c388899a2e3833e7daedecc12ceb5f79ca6112319ab9ece', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
}; 
