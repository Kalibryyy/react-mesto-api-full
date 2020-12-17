const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers, getUser, getCurrentUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

module.exports = router;
