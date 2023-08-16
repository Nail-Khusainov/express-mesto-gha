const Card = require('../models/card');
const { VALIDATION_ERROR, NOTFOUND_ERROR, SERVER_ERROR } = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      console.error(error);
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Некорректный запрос' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOTFOUND_ERROR).send({ message: 'Карточка не существует' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(VALIDATION_ERROR).send({ message: 'Неверный Id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOTFOUND_ERROR).send({ message: 'Карточка не существует' });
    } else {
      res.send({ data: card });
    }
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(VALIDATION_ERROR).send({ message: 'Неверный Id' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(NOTFOUND_ERROR).send({ message: 'Карточка не существует' });
    } else {
      res.send({ data: card });
    }
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(VALIDATION_ERROR).send({ message: 'Неверный Id' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });
