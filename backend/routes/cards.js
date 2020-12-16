const router = require('express').Router();
const { getCards, createCard, deleteCard, putLike } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/likes/:cardId', putLike);

module.exports = router;
