const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const { errorHandler } = require('../utils/error-handler');
const NotFoundError = require('../errors/not-found-err');
const CastError = require('../errors/cast-err');
const ConflictingReqError = require('../errors/conflicting-req-err');
const UnauthorizedError = require('../errors/conflicting-req-err');
const ValidationError = require('../errors/validation-err');

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
    .select()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new CastError('в запросе переданы неверные значения'));
  } else if (password.includes(' ')) {
    next(new ValidationError('не допускаются пробелы в пароле'));
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
        _id: user._id,
      });
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('ошибка аутентификации'));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  if (!name || !about) {
    next(new CastError('поля name и about должны быть заполнены'));
  }

  User.findByIdAndUpdate(_id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar) {
    next(new CastError('поле аватар обязательно для заполнения'));
  }

  User.findByIdAndUpdate(_id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => errorHandler(res, err, next));
};
