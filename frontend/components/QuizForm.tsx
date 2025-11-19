import React, { useState } from 'react';
import { createQuiz, QuestionType } from '../services/api';

interface AnswerForm {
  answerText: string;
  isCorrect: boolean;
}

interface QuestionForm {
  id: string;
  questionText: string;
  questionType: QuestionType;
  order: number;
  correctAnswer?: string;
  answers?: AnswerForm[];
}

type Props = {
  onSuccess?: () => void;
};

const QuizForm: React.FC<Props> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      id: crypto.randomUUID(),
      questionText: '',
      questionType: 'BOOLEAN',
      order: 0,
      correctAnswer: 'true',
    },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        questionText: '',
        questionType: 'BOOLEAN',
        order: prev.length,
        correctAnswer: 'true',
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id).map((q, idx) => ({ ...q, order: idx })));
  };

  const updateQuestion = (id: string, updates: Partial<QuestionForm>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const handleTypeChange = (id: string, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        if (type === 'BOOLEAN') {
          return {
            ...q,
            questionType: type,
            correctAnswer: 'true',
            answers: undefined,
          };
        }
        if (type === 'INPUT') {
          return {
            ...q,
            questionType: type,
            correctAnswer: '',
            answers: undefined,
          };
        }
        // CHECKBOX
        return {
          ...q,
          questionType: type,
          correctAnswer: undefined,
          answers: [
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
          ],
        };
      }),
    );
  };

  const addAnswer = (qid: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              answers: [...(q.answers ?? []), { answerText: '', isCorrect: false }],
            }
          : q,
      ),
    );
  };

  const removeAnswer = (qid: string, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              answers: q.answers?.filter((_, i) => i !== index),
            }
          : q,
      ),
    );
  };

  const updateAnswer = (
    qid: string,
    index: number,
    field: 'answerText' | 'isCorrect',
    value: string | boolean,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              answers:
                q.answers?.map((ans, i) => (i === index ? { ...ans, [field]: value } : ans)) ?? [],
            }
          : q,
      ),
    );
  };

  const validateForm = (): string | null => {
    if (!title || title.trim().length < 3) {
      return 'Quiz title must be at least 3 characters';
    }
    if (!questions.length) {
      return 'Quiz must have at least 1 question';
    }
    for (const q of questions) {
      if (!q.questionText || q.questionText.trim().length === 0) {
        return 'All questions must have text';
      }
      if (q.questionType === 'CHECKBOX') {
        if (!q.answers || q.answers.length < 3) {
          return 'Checkbox questions must have at least 3 answer options';
        }
        if (!q.answers.some((a) => a.isCorrect)) {
          return 'Checkbox questions must have at least 1 correct answer';
        }
        if (!q.answers.every((a) => a.answerText.trim().length > 0)) {
          return 'All answer options must have text';
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await createQuiz({
        title,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          order: q.order,
          correctAnswer: q.correctAnswer,
          answers: q.questionType === 'CHECKBOX' ? q.answers : undefined,
        })),
      });
      setTitle('');
      setQuestions([
        {
          id: crypto.randomUUID(),
          questionText: '',
          questionType: 'BOOLEAN',
          order: 0,
          correctAnswer: 'true',
        },
      ]);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      {/* Quiz title */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 500, marginBottom: '0.4rem' }}>Quiz title</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            fontSize: '0.95rem',
          }}
        />
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Questions</h3>

      {questions.map((q, index) => (
        <div
          key={q.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            background: '#f9fafb',
            gridColumn: '1 / -1',
          }}
        >
          <div
            style={{
              marginBottom: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <strong>Question {index + 1}</strong>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                style={{
                  border: 'none',
                  background: '#f97316',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            )}
          </div>

          {/* Question text */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 500, marginBottom: '0.4rem' }}>Question text</div>
            <input
              value={q.questionText}
              onChange={(e) => updateQuestion(q.id, { questionText: e.target.value })}
              placeholder="Enter question"
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Type */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 500, marginBottom: '0.4rem' }}>Type</div>
            <select
              value={q.questionType}
              onChange={(e) => handleTypeChange(q.id, e.target.value as QuestionType)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
              }}
            >
              <option value="BOOLEAN">Boolean</option>
              <option value="INPUT">Input</option>
              <option value="CHECKBOX">Checkbox</option>
            </select>
          </div>

          {/* BOOLEAN */}
          {q.questionType === 'BOOLEAN' && (
            <div style={{ marginTop: '0.75rem' }}>
              <div
                style={{
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}
              >
                Correct answer
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name={`bool-${q.id}`}
                    checked={q.correctAnswer === 'true'}
                    onChange={() => updateQuestion(q.id, { correctAnswer: 'true' })}
                  />
                  <span>True</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name={`bool-${q.id}`}
                    checked={q.correctAnswer === 'false'}
                    onChange={() => updateQuestion(q.id, { correctAnswer: 'false' })}
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          )}

          {/* INPUT */}
          {q.questionType === 'INPUT' && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontWeight: 500, marginBottom: '0.4rem' }}>Correct answer</div>
              <input
                value={q.correctAnswer ?? ''}
                onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                placeholder="Enter the correct answer"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          )}

          {/* CHECKBOX */}
          {q.questionType === 'CHECKBOX' && (
            <div style={{ marginTop: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ fontWeight: 500 }}>Answer options (min. 3)</div>
                <button
                  type="button"
                  onClick={() => addAnswer(q.id)}
                  style={{
                    border: '1px solid #111827',
                    background: 'white',
                    color: '#111827',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  + Add option
                </button>
              </div>

              {(q.answers ?? []).map((ans, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={ans.isCorrect}
                    onChange={(e) => updateAnswer(q.id, idx, 'isCorrect', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <input
                    value={ans.answerText}
                    onChange={(e) => updateAnswer(q.id, idx, 'answerText', e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.7rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.9rem',
                    }}
                  />
                  {(q.answers?.length ?? 0) > 3 && (
                    <button
                      type="button"
                      onClick={() => removeAnswer(q.id, idx)}
                      style={{
                        border: 'none',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: '999px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Check the box next to correct answer(s).
              </p>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        style={{
          border: '1px solid #111827',
          background: 'white',
          color: '#111827',
          borderRadius: '999px',
          padding: '0.4rem 0.9rem',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
      >
        + Add question
      </button>

      <div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            border: 'none',
            background: '#1d9559',
            color: 'white',
            borderRadius: '999px',
            padding: '0.5rem 1.2rem',
            fontSize: '0.9rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Saving...' : 'Create quiz'}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
