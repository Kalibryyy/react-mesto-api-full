module.exports.errorHandler = (res, err) => {
  if (err.statusCode === 404) {
    res.status(404).send({ message: err.message });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ message: err.message });
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'ресурс не найден' });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'в запросе переданы значения неправильного типа' });
  } else if (err.name === 'DisconnectedError') {
    res.status(503).send({ message: 'нет соединения с базой данных' });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка', error: err });
  }
};
