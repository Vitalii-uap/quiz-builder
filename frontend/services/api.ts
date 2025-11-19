import axios from 'axios';

export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface Answer {
  id?: number;
  answerText: string;
  isCorrect: boolean;
}

export interface Question {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  order: number;
  correctAnswer?: string;
  answers?: Answer[];
}

export interface Quiz {
  id?: number;
  title: string;
  createdAt?: string;
  questions: Question[];
}

export interface QuizListItem {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface CreateQuizPayload {
  title: string;
  questions: {
    questionText: string;
    questionType: QuestionType;
    order: number;
    correctAnswer?: string;
    answers?: {
      answerText: string;
      isCorrect: boolean;
    }[];
  }[];
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
});

export const createQuiz = async (payload: CreateQuizPayload) => {
  const { data } = await api.post('/quizzes', payload);
  return data as Quiz;
};

export const fetchQuizzes = async () => {
  const { data } = await api.get('/quizzes');
  return data as QuizListItem[];
};

export const fetchQuizById = async (id: string | number) => {
  const { data } = await api.get(`/quizzes/${id}`);
  return data as Quiz;
};

export const deleteQuizById = async (id: number) => {
  await api.delete(`/quizzes/${id}`);
};
