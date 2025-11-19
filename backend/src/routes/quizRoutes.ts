import { Router } from 'express';

import {
  createQuizHandler,
  deleteQuizHandler,
  getQuizByIdHandler,
  getQuizzesHandler,
} from '../controllers/quizController';

const router = Router();

router.post('/quizzes', createQuizHandler);
router.get('/quizzes', getQuizzesHandler);
router.get('/quizzes/:id', getQuizByIdHandler);
router.delete('/quizzes/:id', deleteQuizHandler);

export default router;
