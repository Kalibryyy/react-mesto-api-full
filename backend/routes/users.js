const router = require('express').Router();
const { getUsers, getUser, getCurrentUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:id', auth, getUser);
router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
