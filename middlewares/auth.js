/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = process.env;
const UnauthorizedError = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  try {
    const verifyPayload = jwt.verify(token, NODE_ENV !== 'production' ? JWT_SECRET_DEV : 'super-strong-secret');
    console.log(
      `
      Ключи режимов разработки и продакшена не должны совпадать.
      `,
      verifyPayload,
    );
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' && error.message === 'invalid signature'
    ) {
      console.log(
        'Все ок. Ключи режимов разработки и продакшена отличаются.',
      );
    } else {
      console.log('Что-то пошло не так', error);
    }
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (error) {
    throw new UnauthorizedError('Неправильный логин или пароль');
  }

  req.user = payload;
  next();
};
