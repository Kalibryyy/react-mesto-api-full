const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./users.js');
const cardsRouter = require('./cards.js');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); 

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(8).max(72),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
