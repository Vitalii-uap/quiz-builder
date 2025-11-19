import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="card">
      <h1>Quiz Builder</h1>
      <p>Create quizzes with multiple question types and manage them easily.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link href="/create">
          <button
            style={{
              border: 'none',
              background: '#1d9559',
              color: 'white',
              borderRadius: '999px',
              padding: '0.5rem 1.2rem',
            }}
          >
            Create Quiz
          </button>
        </Link>
        <Link href="/quizzes">
          <button
            style={{
              border: '1px solid #111827',
              background: 'white',
              color: '#111827',
              borderRadius: '999px',
              padding: '0.5rem 1.2rem',
            }}
          >
            View Quizzes
          </button>
        </Link>
      </div>
    </div>
  );
}
