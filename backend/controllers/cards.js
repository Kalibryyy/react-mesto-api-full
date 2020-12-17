const Card = require('../models/card');
const { errorHandler } = require('../utils/error-handler');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => errorHandler(res, err, next));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .orFail(() => {
      next(new NotFoundError('карточка не найдена'));
    })
    .then((card) => {
      if (!card.owner.equals(_id)) next(new ForbiddenError('нельзя удалять чужие карточки'));
      return Card.findByIdAndRemove(cardId)
        .then(() => {
          res.status(200).send(card);
        })
        .catch((err) => errorHandler(res, err, next));
    })
    .catch((err) => errorHandler(res, err, next));
};

// module.exports.putLike = (req, res, next) => {
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
// };
