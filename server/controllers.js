const models = require('../database/models');
const client = require('../database/index');

const controllers = {
  getQuestions: (req, res) => {
    models.getQuestions(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results.rows);
      }
    });
  },

  getAnswers: (req, res) => {
    models.getAnswers(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  postQuestion: (req, res) => {
    models.postQuestion(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  postAnswer: async (req, res) => {
    try {
      const { question_id } = req.params;
      const { body, answerer_name, answerer_email, photos } = req.body;
      const queryStr = `INSERT INTO answerlist(question_id, body, answerer_name, answerer_email, date_written)
      VALUES(${question_id}, '${body}', '${answerer_name}', '${answerer_email}', ${Date.now()}) RETURNING id`;

      const idQuery = await client.query(queryStr);
      const newId = idQuery.rows[0].id;
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const photoQuery = `INSERT INTO answerPhotos(answer_id, url) VALUES(${newId}, '${photos[i]}') RETURNING *`;
          console.log(photoQuery);
          const photoInsert = await client.query(photoQuery);
        }
      }
      res.status(200).send('Answer Posted!');
    } catch (err) {
      res.status(404).send(err);
    }
  },

  updateHelpfulQuestion: (req, res) => {
    models.updateHelpfulQuestion(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  reportQuestion: (req, res) => {
    models.reportQuestion(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  updateHelpfulAnswer: (req, res) => {
    models.updateHelpfulAnswer(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  reportAnswer: (req, res) => {
    models.reportAnswer(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

};

module.exports = controllers;
