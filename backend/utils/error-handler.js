const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');

module.exports.errorHandler = (res, err, next) => {
  if (err.name === 'ValidationError') {
    next(new ValidationError('ошибка валидации'));
  } else if (err.name === 'DocumentNotFoundError') {
    next(new NotFoundError('ресурс не найден'));
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'в запросе переданы значения неправильного типа' });
  } else if (err.name === 'DisconnectedError') {
    res.status(503).send({ message: 'нет соединения с базой данных' });
  } else {
      next(err);
  }
};
