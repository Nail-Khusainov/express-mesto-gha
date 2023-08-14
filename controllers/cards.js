const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректный запрос' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не существует' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный Id' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
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
      res.status(404).send({ message: 'Карточка не существует' });
    } else {
      res.status(200).send({ data: card });
    }
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Неверный Id' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка не существует' });
    } else {
      res.status(200).send({ data: card });
    }
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Неверный Id' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });
