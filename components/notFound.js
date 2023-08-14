const notFoundRouter = require('express').Router();
notFoundRouter.use('*', (req, res) = res.status(404).send( { message: 'Not found'}));

module.exports = notFoundRouter;