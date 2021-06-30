const client = require('./index');

const models = {
  getQuestions: (req, callback) => {
    const { product_id } = req.params;
    const questionsQuery = `SELECT * FROM questionlist WHERE product_id = ${product_id}`;
    const answersQuery = 'SELECT * FROM answerlist JOIN answerphotos ON answerlist.id = answerphotos.answer_id';

    const container = (t1, t2) => {
      const questions = [];
      for (let i = 0; i < t1.length; i++) {
        questions.push(t1[i]);
      }

      for (let i = 0; i < questions.length; i++) {
        const answers = {};
        questions[i].date_written = new Date(Number(questions[i].date_written));
        for (let j = 0; j < t2.length; j++) {
          if (questions[i].id === t2[j].question_id && answers.question_id === undefined) {
            answers[t2[j].id] = {
              id: t2[j].id,
              body: t2[j].body,
              date_written: new Date(Number(t2[j].date_written)),
              answerer_name: t2[j].answerer_name,
              answerer_email: t2[j].answerer_email,
              helpful: t2[j].helpful,
              photos: [t2[j].url],
            };
          }
        }
        questions[i].answers = answers;
      }
      return questions;
    };

    client.query(questionsQuery, (err, results1) => {
      if (err) {
        callback(err);
      }
      client.query(answersQuery, (err1, results2) => {
        if (err1) {
          callback(err1);
        } else {
          const results = container(results1.rows, results2.rows);
          callback(results);
        }
      });
    });
  },

  getAnswers: (req, callback) => {
    const { question_id } = req.params;
    const answerQuery = `SELECT * FROM answerlist WHERE question_id = ${question_id}`;
    const photoQuery = 'SELECT * FROM answerPhotos';

    const photoContainer = (t1, t2) => {
      const answers = [];
      for (let i = 0; i < t1.length; i++) {
        answers.push(t1[i]);
      }

      for (let i = 0; i < answers.length; i++) {
        const photos = [];
        answers[i].date_written = new Date(Number(answers[i].date_written));
        for (let j = 0; j < t2.length; j++) {
          if (answers[i].id === t2[j].answer_id) {
            photos.push(t2[j].url);
          }
        }
        answers[i].photos = photos;
      }
      return answers;
    };

    client.query(answerQuery, (err, results1) => {
      if (err) {
        callback(err);
      }
      client.query(photoQuery, (err1, results2) => {
        if (err1) {
          callback(err1);
        } else {
          const results = photoContainer(results1.rows, results2.rows);
          callback(null, results);
        }
      });
    });
  },

  postQuestion: (req, callback) => {
    const { body, asker_name, asker_email, product_id } = req.body;
    console.log(req.body);
    const queryStr = `INSERT INTO questionlist(body, asker_name, asker_email, product_id, date_written)
    VALUES('${body}', '${asker_name}', '${asker_email}', ${product_id}, ${Date.now()})`;

    client.query(queryStr, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  },

  postAnswer: (req, callback) => {
    const { question_id } = req.params;
    const { body, answerer_name, answerer_email, photos } = req.body;
    console.log(req.body);
    const queryStr = `INSERT INTO answerlist(body, answerer_name, answerer_email, photos, date_written)
    VALUES('${body}', '${answerer_name}', '${answerer_email}', ${photos}, ${Date.now()}) WHERE question_id = ${question_id}`;

    client.query(queryStr, (err, results) => {
      if (err) {
        callback(err);
      } else {
        console.log(results);
        callback(null, results);
      }
    });
  },

  updateHelpfulQuestion: (req, callback) => {
    const { question_id } = req.params;
    const { reported } = req.body;
    const updateQuery = `UPDATE questionlist SET reported=${reported} WHERE id = ${question_id}`;

    client.query(updateQuery, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  },

};

module.exports = models;
