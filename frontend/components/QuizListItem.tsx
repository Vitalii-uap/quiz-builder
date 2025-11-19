import Link from 'next/link';
import React from 'react';

type Props = {
  id: number;
  title: string;
  questionCount: number;
  onDelete: (id: number) => void;
};

const QuizListItem: React.FC<Props> = ({ id, title, questionCount, onDelete }) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
      }}
    >
      <div>
        <Link href={`/quizzes/${id}`}>
          <h3 style={{ margin: 0 }}>{title}</h3>
        </Link>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
          Questions: {questionCount}
        </p>
      </div>
      <button
        onClick={() => onDelete(id)}
        style={{
          border: 'none',
          background: '#ef4444',
          color: 'white',
          borderRadius: '999px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.8rem',
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default QuizListItem;
