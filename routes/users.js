const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regExLink = require('../utils/utils');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
  signOut,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regExLink),
  }),
}), updateAvatar);

router.delete('/signout', signOut);

module.exports = router;
