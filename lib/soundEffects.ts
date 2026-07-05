export const SOUND_STORAGE_KEY = "icse-class-1-sound-enabled";

export const SOUND_EVENTS = [
  "move",
  "select",
  "correct",
  "incorrect",
  "complete",
] as const;

export type SoundEventName = (typeof SOUND_EVENTS)[number];
export type SoundWave = "sine" | "square" | "sawtooth" | "triangle";

export type SoundTone = {
  frequency: number;
  duration: number;
  gain: number;
  delay?: number;
  type?: SoundWave;
};

const soundPatterns: Record<SoundEventName, SoundTone[]> = {
  move: [{ frequency: 330, duration: 0.045, gain: 0.035, type: "sine" }],
  select: [{ frequency: 520, duration: 0.075, gain: 0.06, type: "triangle" }],
  correct: [
    { frequency: 660, duration: 0.085, gain: 0.07, type: "sine" },
    { frequency: 880, duration: 0.11, gain: 0.06, delay: 0.075, type: "sine" },
  ],
  incorrect: [
    { frequency: 240, duration: 0.11, gain: 0.045, type: "triangle" },
    {
      frequency: 196,
      duration: 0.13,
      gain: 0.04,
      delay: 0.095,
      type: "triangle",
    },
  ],
  complete: [
    { frequency: 523.25, duration: 0.08, gain: 0.07, type: "sine" },
    { frequency: 659.25, duration: 0.09, gain: 0.07, delay: 0.075, type: "sine" },
    { frequency: 783.99, duration: 0.1, gain: 0.065, delay: 0.16, type: "sine" },
    { frequency: 1046.5, duration: 0.18, gain: 0.055, delay: 0.25, type: "triangle" },
  ],
};

export function getSoundPattern(eventName: SoundEventName): SoundTone[] {
  return soundPatterns[eventName].map((tone) => ({ ...tone }));
}

export function parseSoundPreference(storedValue: string | null): boolean {
  return storedValue !== "off";
}

export function serializeSoundPreference(enabled: boolean): "on" | "off" {
  return enabled ? "on" : "off";
}
