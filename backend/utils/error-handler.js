const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const DisconnectedError = require('../errors/disconnected-err');

module.exports.errorHandler = (res, err, next) => {
  if (err.name === 'ValidationError') {
    next(new ValidationError('ошибка валидации'));
  } else if (err.name === 'DocumentNotFoundError') {
    next(new NotFoundError('ресурс не найден'));
  } else if (err.name === 'CastError') {
    next(new CastError('в запросе переданы значения неправильного типа'));
  } else if (err.name === 'DisconnectedError') {
    next(new DisconnectedError('нет соединения с базой данных'));
  } else {
    next(err);
  }
};
