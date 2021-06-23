const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = 4200;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.listen((err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } else {
    // eslint-disable-next-line no-console
    console.log('Connected! Listening on port:', PORT);
  }
});
