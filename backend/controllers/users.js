// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const { errorHandler } = require('../utils/error-handler');
const NotFoundError = require('../errors/not-found-err');
const CastError = require('../errors/cast-err');
const ConflictingReqError = require('../errors/conflicting-req-err');
const UnauthorizedError = require('../errors/conflicting-req-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      next(new NotFoundError('неверный айдишник'));
    })
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password || !validator.isEmail(email)) {
    next(new CastError('в запросе переданы неверные значения'));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictingReqError('пользователь с таким email уже существует'));
      }
    });

  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => errorHandler(res, err, next));
  // bcrypt.hash(password, 10)
  //   .then(hash => User.create({ name, about, avatar, email, password: hash }))
  //   .then((user) => {
  //     res.send({
  //       name: user.name,
  //       about: user.about,
  //       avatar: user.avatar,
  //       email: user.email,
  //     })
  //   })
  //   .catch((err) => errorHandler(res, err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, '693d9a39fba9bdab5c388899a2e3833e7daedecc12ceb5f79ca6112319ab9ece', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('ошибка аутентификации'));
    });
};
