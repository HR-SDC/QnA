const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const copyFrom = require('pg-copy-streams').from;
const csv = require('csv-parser');
const config = require('../config');

const client = new Client(config);

client.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('questions client connect success');
  }
});

const filepath = path.join(__dirname, '../CSV_files/questions.csv');

const table = 'questionlist';
// id,product_id,body,date_written,asker_name,asker_email,reported,helpful
const createTable = `
DROP TABLE IF EXISTS ${table};
CREATE TABLE ${table}(
id SERIAL NOT NULL PRIMARY KEY,
product_id INTEGER NOT NULL,
body VARCHAR(1000) NOT NULL,
date_written BIGINT NOT NULL,
asker_name VARCHAR(50) NOT NULL,
asker_email VARCHAR(100) NOT NULL,
reported BOOLEAN DEFAULT false,
helpful INTEGER NOT NULL
);`;

client.query(createTable)
  .then(() => console.log('Questions successfully created!'))
  .catch(() => console.log('Table was not created'));

const stream = client.query(copyFrom(`COPY ${table} FROM STDIN DELIMITER ',' CSV HEADER;`));

const readStream = fs.createReadStream(filepath);

console.time('execution time');

readStream.on('error', (err) => {
  console.error(`error in reading file ${err}`);
});

stream.on('error', (err) => {
  console.error(`error in copy file ${err}`);
});

const alterTable = `
ALTER TABLE ${table}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS questions_index;
CREATE INDEX IF NOT EXISTS questions_index ON ${table}(product_id)`;

stream.on('success', () => {
  console.log(`completed seeding ${table}`);
  console.log('starting table alteration');
  console.time('alter execution time');
  client.query(alterTable)
    .then(() => {
      console.log('table altered successfully');
      console.timeEnd('alter execution end');
      client.end();
    })
    .catch((err) => console.error(err));
});

readStream.on('open', () => readStream.pipe(stream));

readStream.on('end', () => {
  console.log(`success in reading files in ${table}`);
  console.timeEnd('Execution time');
});

module.exports = client;
