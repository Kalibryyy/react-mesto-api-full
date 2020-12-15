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

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => errorHandler(res, err));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error404 = new Error('карточка не найдена');
      error404.statusCode = 404;
      throw error404;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => errorHandler(res, err));
};

// проверять принадлежит ли карточка авторизованному пользователю - пользуйтесь такой конструкцией:
// if (req.user._id.toString() !== card.owner.toString())

// если кому поможет - правильно так:
//   Card.findById(id)
//     .orFail()
//     .then((card) => {
//       if (!card.owner.equals(req.user._id)) return Promise.reject(new Error('403'));
//       return Card.findByIdAndRemove(id)
//     })
//     .then(() => res.status(200).send({ message: 'карточка удалена' }))

// карточка у меня будет возвращаться вместо месседжа.