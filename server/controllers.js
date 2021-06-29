const models = require('../database/models');

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

};

module.exports = controllers;
