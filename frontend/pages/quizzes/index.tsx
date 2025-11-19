import { useEffect, useState } from 'react';

import QuizListItem from '../../components/QuizListItem';
import { deleteQuizById, fetchQuizzes } from '../../services/api';

type QuizListItemType = {
  id: number;
  title: string;
  questionCount: number;
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const data = await fetchQuizzes();
      if (!cancelled) {
        setQuizzes(data);
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: number) => {
    await deleteQuizById(id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div>
      <h1>All Quizzes</h1>
      {loading && <p>Loading...</p>}
      {!loading && quizzes.length === 0 && <p>No quizzes yet. Create one!</p>}
      {!loading &&
        quizzes.map((quiz) => (
          <QuizListItem
            key={quiz.id}
            id={quiz.id}
            title={quiz.title}
            questionCount={quiz.questionCount}
            onDelete={handleDelete}
          />
        ))}
    </div>
  );
}
