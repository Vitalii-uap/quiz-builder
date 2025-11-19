export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface AnswerDTO {
  id?: number;
  answerText: string;
  isCorrect: boolean;
}

export interface QuestionDTO {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  order: number;
  correctAnswer?: string;
  answers?: AnswerDTO[];
}

export interface QuizDTO {
  id?: number;
  title: string;
  createdAt?: Date;
  questions: QuestionDTO[];
}

export interface QuizListItemDTO {
  id: number;
  title: string;
  questionCount: number;
  createdAt: Date;
}

export interface CreateQuizDTO {
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
