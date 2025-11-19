import { Request, Response } from 'express';

import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById } from '../services/quizService';
import { CreateQuizDTO } from '../types/quiz';

export const createQuizHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateQuizDTO;

    if (!body.title || !Array.isArray(body.questions) || body.questions.length === 0) {
      return res.status(400).json({ message: 'Title and at least one question are required' });
    }

    const quiz = await createQuiz(body);
    return res.status(201).json(quiz);
  } catch (error: any) {
    console.error(error);
    const message = error?.message || 'Failed to create quiz';
    return res.status(400).json({ message });
  }
};

export const getQuizzesHandler = async (_req: Request, res: Response) => {
  try {
    const quizzes = await getAllQuizzes();
    return res.json(quizzes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

export const getQuizByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid quiz id' });

    const quiz = await getQuizById(id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    return res.json(quiz);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch quiz' });
  }
};

export const deleteQuizHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid quiz id' });

    const quiz = await getQuizById(id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    await deleteQuiz(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete quiz' });
  }
};
