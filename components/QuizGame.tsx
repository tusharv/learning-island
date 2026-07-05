import type { QuizQuestion, Subject, Topic } from "../types/learning";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import { QUESTIONS_PER_QUIZ } from "../lib/quizScoring";
import { ActivityIcon } from "./ActivityIcon";
import { AppChrome } from "./AppChrome";
import { StarRating } from "./StarRating";

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
}: QuizGameProps) {
  const chrome = buildAppChromeContext({ page: "quiz", subject, topic });
  const isComplete = questionIndex >= questions.length;

  if (isComplete) {
    return (
      <main className="app-screen quiz-screen" data-color={subject.color}>
        <AppChrome
          crumbs={chrome.crumbs}
          back={chrome.back}
          onBack={onBack}
        />

        <div className="app-screen__body quiz-body">
          <section className="completion-panel" aria-labelledby="complete-title">
            <div className="reward-burst" aria-hidden="true">
              <ActivityIcon icon={subject.icon} className="reward-icon" />
              <span className="reward-spark reward-spark-one" />
              <span className="reward-spark reward-spark-two" />
              <span className="reward-spark reward-spark-three" />
              <span className="reward-spark reward-spark-four" />
            </div>
            <p className="eyebrow">{topic.title} complete</p>
            <div className="completion-stars-heading">
              <h1 id="complete-title">You collected</h1>
              <StarRating filled={roundStars} total={QUESTIONS_PER_QUIZ} />
            </div>
            <p>
              Nice practice on {subject.title}. Pick another topic or return to the
              Adventure Map.
            </p>
            <button type="button" className="primary-action" onClick={onBack}>
              Done
            </button>
          </section>
        </div>
      </main>
    );
  }

  const question = questions[questionIndex];
  const isAnswered = selectedAnswerIndex !== null;
  const isCorrect = selectedAnswerIndex === question.answerIndex;

  return (
    <main
      className="app-screen quiz-screen"
      data-color={subject.color}
      data-layout="quiz"
    >
      <AppChrome
        crumbs={chrome.crumbs}
        back={chrome.back}
        onBack={onBack}
      />

      <div className="app-screen__body quiz-body">
        <section className="question-stage" aria-labelledby="question-title">
          <div className="quiz-progress-line">
            <p>
              Question <strong>{questionIndex + 1}</strong> / {questions.length}
            </p>
            <p>
              <strong>{roundStars}</strong> stars
            </p>
          </div>

          <div className="question-stage__content">
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
          </div>
        </section>
      </div>

      <footer className="app-screen__footer quiz-footer">
        {isAnswered ? (
          <div className="feedback-panel" data-correct={isCorrect}>
            <strong className="feedback-title">
              <span className="feedback-icon" aria-hidden="true">
                {isCorrect ? "✓" : "!"}
              </span>
              {isCorrect ? "Correct!" : "Good try."}
            </strong>
            <span>
              {isCorrect
                ? question.encouragement
                : `The answer is ${question.options[question.answerIndex]}.`}
            </span>
            <button type="button" className="primary-action" onClick={onContinue}>
              {questionIndex === questions.length - 1
                ? "Finish topic"
                : "Next question"}
            </button>
          </div>
        ) : null}
      </footer>
    </main>
  );
}
