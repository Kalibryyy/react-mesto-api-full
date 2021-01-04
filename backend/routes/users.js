const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers, getUser, getCurrentUser, updateProfile, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
