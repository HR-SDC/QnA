const router = require('express').Router();
const controllers = require('./controllers');

router
  .route('/qa/questions/:product_id')
  .get(controllers.getQuestions);

router
  .route('/qa/questions/:question_id/answers')
  .get(controllers.getAnswers)
  .post(controllers.postAnswer);

router
  .route('/qa/questions')
  .post(controllers.postQuestion);

router
  .route('/qa/questions/:question_id/helpful')
  .put(controllers.updateHelpfulQuestion);

router
  .route('/qa/questions/:question_id/reported')
  .put(controllers.reportQuestion);

router
  .route('/qa/answers/:answer_id/helpful')
  .put(controllers.updateHelpfulAnswer);

router
  .route('/qa/answers/:answer_id/reported')
  .put(controllers.reportAnswer);


module.exports = router;
