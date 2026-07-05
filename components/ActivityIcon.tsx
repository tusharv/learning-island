import type { ActivityIconName } from "@/types/learning";

type ActivityIconProps = {
  icon: ActivityIconName;
  className?: string;
};

export function ActivityIcon({ icon, className = "" }: ActivityIconProps) {
  const classes = ["activity-icon", className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-icon={icon} aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false">
        <circle className="activity-icon-disc" cx="32" cy="32" r="28" />
        {renderIcon(icon)}
      </svg>
    </span>
  );
}

function renderIcon(icon: ActivityIconName) {
  switch (icon) {
    case "abc":
      return <IconText value="ABC" size={17} />;
    case "capital-letters":
      return <IconText value="A" size={34} />;
    case "small-letters":
      return <IconText value="a" size={36} />;
    case "devanagari":
    case "letters":
      return <IconText value="अ" size={34} />;
    case "vowels":
      return <IconText value="AE" size={23} />;
    case "numbers":
      return <IconText value="123" size={21} />;
    case "addition":
      return <IconText value="+" size={40} />;
    case "subtraction":
      return <IconText value="-" size={44} />;
    case "compare":
      return <IconText value="< =" size={21} />;
    case "meaning":
      return <IconText value="?" size={38} />;
    case "rhyming":
      return (
        <>
          <path className="activity-icon-line" d="M17 27c7-9 15 9 22 0s12-1 14 2" />
          <path className="activity-icon-line" d="M17 39c7-9 15 9 22 0s12-1 14 2" />
        </>
      );
    case "words":
      return (
        <>
          <path className="activity-icon-line" d="M17 23h30v18H29l-8 7v-7h-4z" />
          <path className="activity-icon-line" d="M25 31h14" />
        </>
      );
    case "sight-words":
      return (
        <>
          <path className="activity-icon-line" d="M12 32s8-12 20-12 20 12 20 12-8 12-20 12-20-12-20-12z" />
          <circle className="activity-icon-fill" cx="32" cy="32" r="6" />
        </>
      );
    case "reading":
      return (
        <>
          <path className="activity-icon-line" d="M18 18h12v28H18z" />
          <path className="activity-icon-line" d="M34 18h12v28H34z" />
          <path className="activity-icon-line" d="M30 18v28" />
          <path className="activity-icon-line" d="M22 26h8M22 32h8M22 38h6" />
          <path className="activity-icon-line" d="M38 26h6M38 32h6M38 38h4" />
        </>
      );
    case "shapes":
      return (
        <>
          <circle className="activity-icon-line" cx="23" cy="25" r="8" />
          <rect className="activity-icon-line" x="34" y="18" width="14" height="14" rx="2" />
          <path className="activity-icon-line" d="M20 47l11-17 11 17z" />
        </>
      );
    case "animals":
      return (
        <>
          <circle className="activity-icon-fill" cx="32" cy="38" r="9" />
          <circle className="activity-icon-fill" cx="20" cy="26" r="5" />
          <circle className="activity-icon-fill" cx="30" cy="21" r="5" />
          <circle className="activity-icon-fill" cx="42" cy="24" r="5" />
          <circle className="activity-icon-fill" cx="47" cy="34" r="4" />
        </>
      );
    case "body":
      return (
        <>
          <path className="activity-icon-line" d="M20 34V20a5 5 0 0 1 10 0v10" />
          <path className="activity-icon-line" d="M30 31V19a5 5 0 0 1 10 0v16" />
          <path className="activity-icon-line" d="M40 35v-8a5 5 0 0 1 9 3v9c0 11-7 17-17 17-8 0-15-5-18-13" />
        </>
      );
    case "nature":
    case "plants":
      return (
        <>
          <path className="activity-icon-line" d="M31 49V32" />
          <path className="activity-icon-line" d="M31 32c-11-1-16-7-16-17 11 0 18 6 16 17z" />
          <path className="activity-icon-line" d="M33 34c11-1 16-7 16-17-11 0-18 6-16 17z" />
        </>
      );
    case "clean":
      return (
        <>
          <circle className="activity-icon-line" cx="25" cy="36" r="9" />
          <circle className="activity-icon-line" cx="42" cy="24" r="6" />
          <path className="activity-icon-line" d="M42 43l4 4 7-13" />
        </>
      );
    case "food":
      return (
        <>
          <path className="activity-icon-line" d="M32 21c10 0 16 8 14 18-2 10-8 16-14 16s-12-6-14-16c-2-10 4-18 14-18z" />
          <path className="activity-icon-line" d="M32 21c0-8 6-11 12-11" />
        </>
      );
  }
}

function IconText({ value, size }: { value: string; size: number }) {
  return (
    <text
      className="activity-icon-text"
      x="32"
      y="34"
      fontSize={size}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
}
