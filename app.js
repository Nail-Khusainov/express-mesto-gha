const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { NOTFOUND_ERROR } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 88,
  message: 'Превышено ограничение запросов c вашего IP, пожалуйста, повторите позже.',
});

app.use(limiter);

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64db626afb808ab924875ba2',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(NOTFOUND_ERROR).send({ message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
