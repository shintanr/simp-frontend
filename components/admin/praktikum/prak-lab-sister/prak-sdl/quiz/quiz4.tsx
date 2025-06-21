import { useState, useEffect } from "react";

interface QuizQuestion {
  id_quiz: number;
  id_submodul: number;
  pertanyaan: string;
  pilihan_a: string;
  pilihan_b: string;
  pilihan_c: string;
  pilihan_d: string;
  jawaban_benar: string;
}

interface QuizProps {
  submodulId: number;
  userId: number;
}

export default function Quiz_4_SDL({ submodulId, userId }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`http://localhost:8080/api/submodul/quiz-sdl/${submodulId}`);
        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    }

    fetchQuiz();
  }, [submodulId]);

  const handleAnswerChange = (quizId: number, selectedAnswer: string) => {
    setAnswers((prev) => ({ ...prev, [quizId]: selectedAnswer }));
  };

  const isAllAnswered = questions.every((q) => answers[q.id_quiz]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAllAnswered) {
      setErrorMessage("Semua soal harus dijawab sebelum submit.");
      return;
    }

    setErrorMessage("");
    try {
      for (const [quizId, userAnswer] of Object.entries(answers)) {
        const payload = {
          user_id: userId,
          id_quiz: parseInt(quizId, 10),
          user_answer: userAnswer,
        };

        console.log("Sending data to backend:", payload);

        const response = await fetch("http://localhost:8080/api/submodul/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const resultData = await response.json();
        console.log("Response from backend:", resultData);

        if (!resultData.success) throw new Error(resultData.message);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-5 text-left">
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id_quiz} className="mb-6">
            <p className="text-lg font-semibold leading-relaxed">{question.pertanyaan}</p>
            {["a", "b", "c", "d"].map((option) => {
              const optionKey = `pilihan_${option}` as keyof QuizQuestion;
              return (
                <label key={option} className="block text-lg leading-relaxed">
                  <input
                    type="radio"
                    name={`quiz-${question.id_quiz}`}
                    value={option.toUpperCase()}
                    onChange={() => handleAnswerChange(question.id_quiz, option.toUpperCase())}
                    checked={answers[question.id_quiz] === option.toUpperCase()}
                    className="mr-2"
                  />
                  {question[optionKey]}
                </label>
              );
            })}
          </div>
        ))}
        {errorMessage && <p className="text-red-500 font-semibold">{errorMessage}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-lg" disabled={!isAllAnswered}>
          Submit
        </button>
      </form>
      
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-bold">Anda telah submit!</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
