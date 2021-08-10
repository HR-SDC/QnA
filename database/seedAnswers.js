const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const copyFrom = require('pg-copy-streams').from;
const config = require('../config');

const client = new Client(config);

client.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('answers client connection success');
  }
});

const filepath = path.join(__dirname, '../CSV_files/answers.csv');

const table = 'answerlist';

const createTable = `
DROP TABLE IF EXISTS ${table};
CREATE TABLE ${table} (
id SERIAL PRIMARY KEY NOT NULL,
question_id INTEGER NOT NULL,
body VARCHAR(1000) NOT NULL,
date_written BIGINT NOT NULL,
answerer_name VARCHAR(50) NOT NULL,
answerer_email VARCHAR(100) NOT NULL,
reported BOOLEAN DEFAULT false,
helpful INTEGER NOT NULL DEFAULT 0
);`;

client.query(createTable)
  .then(() => console.log('answerlist successfully created!'))
  .catch(() => console.log('answerlist was not created'));

const stream = client.query(copyFrom(`COPY ${table} FROM STDIN DELIMITER ',' CSV HEADER;`));

const readStream = fs.createReadStream(filepath);

console.time('execution time');

readStream.on('error', (err) => {
  console.log(`error in reading file ${err}`);
});

stream.on('error', (err) => {
  console.log(`error in reading file ${err}`);
});

const alterTable = `
ALTER TABLE ${table}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS answers_index;
CREATE INDEX IF NOT EXISTS answers_index ON ${table}(question_id)`;

stream.on('finish', () => {
  console.log(`completed seeding ${table}`);
  console.timeEnd('execution time');
  console.log('starting table alteration');
  console.time('alter table execution');
  client.query(alterTable)
    .then(() => {
      console.log(`${table} altered successfully`);
      console.timeEnd('alter table execution');
      client.end();
    })
    .catch((err) => console.error(err));
});

readStream.on('open', () => readStream.pipe(stream));

readStream.on('end', () => {
  console.log(`success in reading files in ${table}`);
});

module.exports = client;
