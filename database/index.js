const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config);

pool.connect((err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } else {
    // eslint-disable-next-line no-console
    console.log('DB connection established');
  }
});

module.exports = pool;
