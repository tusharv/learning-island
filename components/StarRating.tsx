import { QUESTIONS_PER_QUIZ } from "@/lib/quizScoring";

type StarRatingProps = {
  filled: number;
  total?: number;
  className?: string;
  label?: string;
};

const STAR_PATH =
  "M12 2.5l2.86 5.8 6.4.93-4.63 4.52 1.09 6.37L12 17.77l-5.72 3.01 1.09-6.37L2.74 9.23l6.4-.93L12 2.5z";

const GOLD_FILL = "#f5b942";
const GOLD_STROKE = "#e09b1f";
const EMPTY_FILL = "#ffffff";

export function StarRating({
  filled,
  total = QUESTIONS_PER_QUIZ,
  className = "",
  label,
}: StarRatingProps) {
  const clampedFilled = Math.max(0, Math.min(total, filled));
  const classes = ["star-rating", className].filter(Boolean).join(" ");
  const ariaLabel =
    label ??
    `${clampedFilled} of ${total} ${clampedFilled === 1 ? "star" : "stars"} collected`;

  return (
    <div className={classes} role="img" aria-label={ariaLabel}>
      {Array.from({ length: total }, (_, index) => {
        const isFilled = index < clampedFilled;

        return (
          <svg
            key={index}
            className="star-rating__star"
            viewBox="0 0 24 24"
            width="40"
            height="40"
            focusable="false"
            aria-hidden="true"
          >
            <path
              className={isFilled ? "star-rating__path star-rating__path--filled" : "star-rating__path"}
              d={STAR_PATH}
              fill={isFilled ? GOLD_FILL : EMPTY_FILL}
              stroke={GOLD_STROKE}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}
