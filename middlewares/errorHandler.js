/* eslint-disable linebreak-style */
const errorHandler = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера'
        : message,
    });
  next();
};

module.exports = errorHandler;
