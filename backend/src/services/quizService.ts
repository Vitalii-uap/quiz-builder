import { prisma } from '../prisma/client';
import { CreateQuizDTO, QuizDTO, QuizListItemDTO, QuestionType } from '../types/quiz';

export const createQuiz = async (data: CreateQuizDTO): Promise<QuizDTO> => {
  if (!data.title || data.title.length < 3) {
    throw new Error('Quiz title must be at least 3 characters');
  }
  if (!data.questions || data.questions.length < 1) {
    throw new Error('Quiz must have at least 1 question');
  }

  for (const q of data.questions) {
    if (!q.questionText || q.questionText.trim().length === 0) {
      throw new Error('Question text is required');
    }
    if (q.questionType === 'CHECKBOX') {
      if (!q.answers || q.answers.length < 3) {
        throw new Error('Checkbox questions must have at least 3 answer options');
      }
      if (!q.answers.some((a) => a.isCorrect)) {
        throw new Error('Checkbox questions must have at least 1 correct answer');
      }
      if (!q.answers.every((a) => a.answerText.trim().length > 0)) {
        throw new Error('All answer options must have text');
      }
    }
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: data.title,
      questions: {
        create: data.questions.map((q) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          order: q.order,
          correctAnswer: q.correctAnswer ?? null,
          answers:
            q.questionType === 'CHECKBOX' && q.answers
              ? {
                  create: q.answers.map((ans) => ({
                    answerText: ans.answerText,
                    isCorrect: ans.isCorrect,
                  })),
                }
              : undefined,
        })),
      },
    },
    include: {
      questions: {
        include: { answers: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType as QuestionType,
      order: q.order,
      correctAnswer: q.correctAnswer ?? undefined,
      answers: q.answers.map((a) => ({
        id: a.id,
        answerText: a.answerText,
        isCorrect: a.isCorrect,
      })),
    })),
  };
};

export const getAllQuizzes = async (): Promise<QuizListItemDTO[]> => {
  const quizzes = await prisma.quiz.findMany({
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    questionCount: q._count.questions,
    createdAt: q.createdAt,
  }));
};

export const getQuizById = async (id: number): Promise<QuizDTO | null> => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: { answers: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType as QuestionType,
      order: q.order,
      correctAnswer: q.correctAnswer ?? undefined,
      answers: q.answers.map((a) => ({
        id: a.id,
        answerText: a.answerText,
        isCorrect: a.isCorrect,
      })),
    })),
  };
};

export const deleteQuiz = async (id: number): Promise<void> => {
  await prisma.quiz.delete({
    where: { id },
  });
};
