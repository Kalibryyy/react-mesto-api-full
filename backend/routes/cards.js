const router = require('express').Router();
const { validateCreateCard, validateDeleteCard } = require('../middlewares/validations');

const {
  getCards, createCard, deleteCard, putLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateDeleteCard, deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
