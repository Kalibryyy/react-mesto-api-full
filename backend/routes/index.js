const router = require('express').Router();

const usersRouter = require('./users.js');
const cardsRouter = require('./cards.js');
const { createUser, login } = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
