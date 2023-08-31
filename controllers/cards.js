const Card = require('../models/card');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не существует');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалять карточки других пользователей');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(res.send({ data: card }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не существует');
    } else {
      res.send({ data: card });
    }
  })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не существует');
    } else {
      res.send({ data: card });
    }
  })
  .catch(next);
