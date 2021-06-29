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
    console.log('answer_photo client connection success');
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

readStream.on('open', () => readStream.pipe(stream));

readStream.on('end', () => {
  console.log(`success in reading files in ${table}`);
});

module.exports = client;
