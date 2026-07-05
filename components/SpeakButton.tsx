"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { useSound } from "@/components/SoundProvider";
import { isSpeechSupported, speakText } from "@/lib/textToSpeech";

type SpeakButtonProps = {
  text: string;
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function SpeakButton({
  text,
  label,
  className = "",
  size = "md",
}: SpeakButtonProps) {
  const { soundEnabled, playSound } = useSound();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      if (!soundEnabled || !supported) {
        return;
      }

      playSound("select");
      speakText(text);
    },
    [playSound, soundEnabled, supported, text],
  );

  if (!supported) {
    return null;
  }

  const classes = ["speak-button", `speak-button-${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      aria-label={label}
      title={label}
      disabled={!soundEnabled}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path className="speak-button-speaker" d="M8 20h8l10-9v26l-10-9H8z" />
        <path className="speak-button-wave" d="M31 17c3 3 3 11 0 14" />
        <path className="speak-button-wave" d="M36 12c6 7 6 17 0 24" />
      </svg>
    </button>
  );
}
