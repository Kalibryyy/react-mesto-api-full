const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  
  try {
    payload = jwt.verify(token, '693d9a39fba9bdab5c388899a2e3833e7daedecc12ceb5f79ca6112319ab9ece');
  } catch (err) {
    next(new UnauthorizedError('с токеном что-то не так'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
}; 