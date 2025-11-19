import Link from 'next/link';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header style={{ background: '#5687ef', color: 'white', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/">
            <strong>Quiz Builder</strong>
          </Link>
          <nav style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
            <Link href="/quizzes">All Quizzes</Link>
            <Link href="/create">Create Quiz</Link>
          </nav>
        </div>
      </header>
      <main className="container" style={{ marginTop: '1.5rem' }}>
        {children}
      </main>
    </>
  );
};

export default Layout;
