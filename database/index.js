const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config);

pool.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('DB connection established');
  }
});

module.exports = pool;
