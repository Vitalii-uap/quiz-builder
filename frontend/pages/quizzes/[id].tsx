import { GetServerSideProps } from 'next';
import React from 'react';
import { fetchQuizById, Question, Quiz } from '../../services/api';

interface QuizPageProps {
  quiz: Quiz | null;
}

const QuizDetailPage: React.FC<QuizPageProps> = ({ quiz }) => {
  if (!quiz) {
    return (
      <div className="container">
        <h1>Quiz not found</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{quiz.title}</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        {quiz.createdAt && `Created at: ${new Date(quiz.createdAt).toLocaleString()}`}
      </p>

      {quiz.questions.map((q: Question, index: number) => (
        <div
          key={q.id ?? index}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              Question {index + 1}{' '}
              <span style={{ fontWeight: 400, color: '#6b7280' }}>({q.questionType})</span>
            </span>
          </div>

          <p style={{ marginBottom: '0.75rem' }}>{q.questionText}</p>

          {/* BOOLEAN */}
          {q.questionType === 'BOOLEAN' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Correct answer:
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  background: '#ecfdf3',
                  color: '#166534',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                {q.correctAnswer === 'false' ? 'False' : 'True'}
              </span>
            </div>
          )}

          {/* INPUT */}
          {q.questionType === 'INPUT' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Correct answer:
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.5rem',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '0.9rem',
                }}
              >
                {q.correctAnswer || 'Not specified'}
              </span>
            </div>
          )}

          {/* CHECKBOX */}
          {q.questionType === 'CHECKBOX' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Options (correct answers highlighted):
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                {(q.answers ?? []).map((a, i) => {
                  const isCorrect = a.isCorrect;
                  return (
                    <li
                      key={a.id ?? i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '0.5rem',
                        background: isCorrect ? '#ecfdf3' : '#f9fafb',
                        color: isCorrect ? '#166534' : '#111827',
                        border: isCorrect ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
                      }}
                    >
                      <span
                        style={{
                          width: '0.7rem',
                          height: '0.7rem',
                          borderRadius: '0.2rem',
                          border: '1px solid',
                          borderColor: isCorrect ? '#16a34a' : '#9ca3af',
                          background: isCorrect ? '#22c55e' : 'transparent',
                        }}
                      />
                      <span>{a.answerText}</span>
                      {isCorrect && (
                        <span
                          style={{
                            marginLeft: 'auto',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Correct
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ))}

      {quiz.questions.length === 0 && (
        <p style={{ color: '#6b7280' }}>This quiz has no questions yet.</p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<QuizPageProps> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const quiz = await fetchQuizById(id);

    console.log('SSR fetched quiz', JSON.stringify(quiz, null, 2));

    return { props: { quiz: quiz ?? null } };
  } catch (e) {
    console.error('SSR error fetchQuizById', e);
    return { props: { quiz: null } };
  }
};

export default QuizDetailPage;
