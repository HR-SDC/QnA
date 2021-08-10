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
    console.log('answerPhoto client connection success');
  }
});

const filepath = path.join(__dirname, '../CSV_files/answers_photos.csv');

const table = 'answerPhotos';

const createTable = `
DROP TABLE IF EXISTS ${table};
CREATE TABLE ${table} (
id SERIAL PRIMARY KEY NOT NULL,
answer_id INTEGER NOT NULL,
url VARCHAR(1000) NOT NULL
);`;

client.query(createTable)
  .then(() => console.log('answerPhotos successfully created!'))
  .catch(() => console.log('answerPhotos was not created'));

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
DROP INDEX IF EXISTS photo_index;
CREATE INDEX IF NOT EXISTS photo_index ON ${table}(answer_id)`;

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
