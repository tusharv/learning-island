"use client";

import { useCallback, type KeyboardEvent } from "react";
import { useSound } from "@/components/SoundProvider";

type SoundToggleProps = {
  className?: string;
};

export function SoundToggle({ className = "" }: SoundToggleProps) {
  const { soundEnabled, toggleSound, playSound } = useSound();
  const classes = ["sound-toggle", className].filter(Boolean).join(" ");
  const label = soundEnabled ? "Turn sound off" : "Turn sound on";

  const handleToggle = useCallback(() => {
    playSound("select", { force: true });
    toggleSound();
  }, [playSound, toggleSound]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        handleToggle();
      }
    },
    [handleToggle],
  );

  return (
    <button
      type="button"
      className={classes}
      data-enabled={soundEnabled}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path className="sound-toggle-speaker" d="M8 20h8l10-9v26l-10-9H8z" />
        {soundEnabled ? (
          <>
            <path className="sound-toggle-wave" d="M31 17c3 3 3 11 0 14" />
            <path className="sound-toggle-wave" d="M36 12c6 7 6 17 0 24" />
          </>
        ) : (
          <path className="sound-toggle-wave" d="M32 17l10 14M42 17 32 31" />
        )}
      </svg>
    </button>
  );
}
