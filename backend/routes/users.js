const router = require('express').Router();
const { getUsers, getUser, getCurrentUser } = require('../controllers/users');
const { createUser, login } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUser);
router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
