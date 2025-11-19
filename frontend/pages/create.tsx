import { useRouter } from 'next/router';

import QuizForm from '../components/QuizForm';

export default function CreateQuizPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Create Quiz</h1>
      <QuizForm onSuccess={() => router.push('/quizzes')} />
    </div>
  );
}
