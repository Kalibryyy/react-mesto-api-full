const Card = require('../models/card');
const { errorHandler } = require('../utils/error-handler');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'карточка не найдена' });
      } else if (err.name === 'DisconnectedError') {
        res.status(503).send({ message: 'нет соединения с базой данных' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка', error: err });
      }
    });
};

module.exports.createCard = (req, res,next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .orFail(() => {
      const error404 = new Error('карточка не найдена');
      error404.statusCode = 404;
      throw error404;
    })
    .then((card) => {
      if (!card.owner.equals(_id)) return res.status(403).send({ message: 'нельзя удалять чужие карточки' });
      return Card.findByIdAndRemove(cardId)
      .then((card) => {
        res.status(200).send(card);
      })
      .catch((err) => errorHandler(res, err));
    })
    .catch((err) => errorHandler(res, err));
};

module.exports.putLike = (req, res) => {
  // const { cardId } = req.params;

  // Card.findById(cardId)
  // .orFail(() => {
  //   const error404 = new Error('карточка не найдена');
  //   error404.statusCode = 404;
  //   throw error404;
  // })
  // .then((card) => {
  //   res.status(200).send(card.likes);
  // })
  // .catch((err) => errorHandler(res, err));
}
