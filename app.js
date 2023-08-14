const express = require('express');
// Слушаем 3000 порт
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .catch((error) => console.log(error.message));

app.use((req, res, next) => {
  req.user = {
    _id: '',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
