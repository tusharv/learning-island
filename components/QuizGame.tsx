import type { QuizQuestion, Subject, Topic } from "../types/learning";

type QuizGameProps = {
  subject: Subject;
  topic: Topic;
  questions: QuizQuestion[];
  questionIndex: number;
  answerFocusIndex: number;
  selectedAnswerIndex: number | null;
  roundStars: number;
  onAnswerFocus: (index: number) => void;
  onSelectAnswer: (index: number) => void;
  onContinue: () => void;
  onBack: () => void;
  backLabel?: string;
};

export function QuizGame({
  subject,
  topic,
  questions,
  questionIndex,
  answerFocusIndex,
  selectedAnswerIndex,
  roundStars,
  onAnswerFocus,
  onSelectAnswer,
  onContinue,
  onBack,
  backLabel = "Back to topics",
}: QuizGameProps) {
  const isComplete = questionIndex >= questions.length;

  if (isComplete) {
    return (
      <main className="quiz-screen" data-color={subject.color}>
        <button type="button" className="back-button" onClick={onBack}>
          {backLabel}
        </button>
        <section className="completion-panel" aria-labelledby="complete-title">
          <p className="eyebrow">{topic.title} complete</p>
          <h1 id="complete-title">You collected {roundStars} stars!</h1>
          <p>
            Nice practice on {subject.title}. Pick another topic or return to the
            Adventure Map.
          </p>
          <button type="button" className="primary-action" onClick={onBack}>
            {backLabel}
          </button>
        </section>
      </main>
    );
  }

  const question = questions[questionIndex];
  const isAnswered = selectedAnswerIndex !== null;
  const isCorrect = selectedAnswerIndex === question.answerIndex;

  return (
    <main className="quiz-screen" data-color={subject.color}>
      <button type="button" className="back-button" onClick={onBack}>
        {backLabel}
      </button>

      <section className="question-stage" aria-labelledby="question-title">
        <div className="quiz-topline">
          <p className="eyebrow">
            {subject.title} · {topic.title}
          </p>
          <p>
            Question {questionIndex + 1} / {questions.length}
          </p>
          <p>{roundStars} stars</p>
        </div>

        <h1 id="question-title">{question.prompt}</h1>
        {question.transliteration ? (
          <p className="transliteration">{question.transliteration}</p>
        ) : null}

        <div className="answer-grid" role="list">
          {question.options.map((option, index) => {
            const isFocused = answerFocusIndex === index;
            const isSelected = selectedAnswerIndex === index;
            const isAnswer = question.answerIndex === index;

            return (
              <button
                type="button"
                key={option}
                className="answer-option"
                data-focused={isFocused}
                data-selected={isSelected}
                data-correct={isAnswered && isAnswer}
                data-wrong={isAnswered && isSelected && !isAnswer}
                disabled={isAnswered}
                onClick={() => onSelectAnswer(index)}
                onFocus={() => onAnswerFocus(index)}
              >
                <span className="answer-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>
                  <span className="answer-text">{option}</span>
                  {question.optionTransliterations?.[index] ? (
                    <span className="answer-helper">
                      {question.optionTransliterations[index]}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {isAnswered ? (
          <div className="feedback-panel" data-correct={isCorrect}>
            <strong>{isCorrect ? "Correct!" : "Good try."}</strong>
            <span>
              {isCorrect
                ? question.encouragement
                : `The answer is ${question.options[question.answerIndex]}.`}
            </span>
            <button
              type="button"
              className="primary-action"
              onClick={onContinue}
            >
              {questionIndex === questions.length - 1
                ? "Finish topic"
                : "Next question"}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
