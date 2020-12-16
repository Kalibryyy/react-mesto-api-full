const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthError('С токеном что-то не так'));
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  
  try {
    payload = jwt.verify(token, '693d9a39fba9bdab5c388899a2e3833e7daedecc12ceb5f79ca6112319ab9ece');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
}; 