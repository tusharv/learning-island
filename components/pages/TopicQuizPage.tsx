"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { QuizGame } from "@/components/QuizGame";
import { useProgress } from "@/components/ProgressProvider";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";
import { buildCompletedProgress } from "@/lib/progress";
import { isBackKey, isSelectKey, moveFocus } from "@/lib/remoteNavigation";
import { nextRoundStars, pickQuizQuestions } from "@/lib/quizScoring";
import { subjectPath, topicPath } from "@/lib/paths";
import type { QuizQuestion, Subject, Topic } from "@/types/learning";

const answerColumns = 2;

type TopicQuizPageProps = {
  subject: Subject;
  topic: Topic;
};

export function TopicQuizPage({ subject, topic }: TopicQuizPageProps) {
  const router = useRouter();
  const { setProgress } = useProgress();
  const [quizQuestions] = useState<QuizQuestion[]>(() =>
    pickQuizQuestions(topic.questions),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerFocusIndex, setAnswerFocusIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );
  const [roundStars, setRoundStars] = useState(0);

  const isSightWords = topic.id === SIGHT_WORDS_TOPIC_ID;
  const backPath = isSightWords
    ? topicPath(subject.id, topic.id)
    : subjectPath(subject.id);
  const backLabel = isSightWords ? "Back to Sight Words" : "Back to topics";

  const returnBack = useCallback(() => {
    router.push(backPath);
  }, [backPath, router]);

  const finishRound = useCallback(
    (finalStars: number) => {
      setRoundStars(finalStars);
      setProgress((currentProgress) =>
        buildCompletedProgress(
          currentProgress,
          subject.id,
          topic.id,
          finalStars,
          subject.topics.length,
        ),
      );
      setQuestionIndex(quizQuestions.length);
      setSelectedAnswerIndex(null);
    },
    [quizQuestions.length, setProgress, subject, topic.id],
  );

  const selectAnswer = useCallback(
    (index: number) => {
      if (selectedAnswerIndex !== null) {
        return;
      }

      setSelectedAnswerIndex(index);
    },
    [selectedAnswerIndex],
  );

  const continueQuiz = useCallback(() => {
    if (selectedAnswerIndex === null) {
      return;
    }

    const isLastQuestion = questionIndex === quizQuestions.length - 1;
    const question = quizQuestions[questionIndex];
    const updatedStars = nextRoundStars(
      roundStars,
      selectedAnswerIndex,
      question.answerIndex,
    );

    if (isLastQuestion) {
      finishRound(updatedStars);
      return;
    }

    setRoundStars(updatedStars);
    setQuestionIndex((index) => index + 1);
    setAnswerFocusIndex(0);
    setSelectedAnswerIndex(null);
  }, [
    finishRound,
    questionIndex,
    quizQuestions,
    roundStars,
    selectedAnswerIndex,
  ]);

  const isComplete = questionIndex >= quizQuestions.length;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key.startsWith("Arrow") || isSelectKey(key) || isBackKey(key)) {
        event.preventDefault();
      }

      if (isBackKey(key)) {
        returnBack();
        return;
      }

      if (isComplete) {
        if (isSelectKey(key)) {
          returnBack();
        }

        return;
      }

      if (selectedAnswerIndex === null && key.startsWith("Arrow")) {
        setAnswerFocusIndex((index) =>
          moveFocus(
            index,
            key,
            quizQuestions[questionIndex].options.length,
            answerColumns,
          ),
        );
        return;
      }

      if (isSelectKey(key)) {
        if (selectedAnswerIndex === null) {
          selectAnswer(answerFocusIndex);
        } else {
          continueQuiz();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    answerFocusIndex,
    continueQuiz,
    isComplete,
    questionIndex,
    quizQuestions,
    returnBack,
    selectAnswer,
    selectedAnswerIndex,
  ]);

  return (
    <QuizGame
      subject={subject}
      topic={topic}
      questions={quizQuestions}
      questionIndex={questionIndex}
      answerFocusIndex={answerFocusIndex}
      selectedAnswerIndex={selectedAnswerIndex}
      roundStars={roundStars}
      onAnswerFocus={setAnswerFocusIndex}
      onSelectAnswer={selectAnswer}
      onContinue={continueQuiz}
      onBack={returnBack}
      backLabel={backLabel}
    />
  );
}
