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

  postQuestion: (req, res) => {
    models.postQuestion(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  postAnswer: (req, res) => {
    models.postAnswer(req, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
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

  updateHelpfulAnswer: (req, res) => {},

  reportAnswer: (req, res) => {},

};

module.exports = controllers;
