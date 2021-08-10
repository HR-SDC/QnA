const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');

const app = express();
const PORT = 4200;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api', router);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected! Listening on port:', PORT);
  }
});
