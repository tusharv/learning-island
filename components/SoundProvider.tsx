"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  SOUND_STORAGE_KEY,
  getSoundPattern,
  parseSoundPreference,
  serializeSoundPreference,
  type SoundEventName,
} from "@/lib/soundEffects";

type PlayOptions = {
  force?: boolean;
};

type SoundContextValue = {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (eventName: SoundEventName, options?: PlayOptions) => void;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const hasLoadedPreference = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      hasLoadedPreference.current = true;
      setSoundEnabled(
        parseSoundPreference(window.localStorage.getItem(SOUND_STORAGE_KEY)),
      );
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference.current) {
      return;
    }

    try {
      window.localStorage.setItem(
        SOUND_STORAGE_KEY,
        serializeSoundPreference(soundEnabled),
      );
    } catch {
      // Sound still works if a TV browser blocks storage.
    }
  }, [soundEnabled]);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const browserWindow = window as AudioWindow;
    const AudioContextConstructor =
      browserWindow.AudioContext ?? browserWindow.webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
    }

    return audioContextRef.current;
  }, []);

  const playSound = useCallback(
    (eventName: SoundEventName, options: PlayOptions = {}) => {
      if (!soundEnabled && !options.force) {
        return;
      }

      const audioContext = getAudioContext();

      if (!audioContext) {
        return;
      }

      const playPattern = () => {
        const startTime = audioContext.currentTime;

        for (const tone of getSoundPattern(eventName)) {
          try {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const toneStart = startTime + (tone.delay ?? 0);
            const toneEnd = toneStart + tone.duration;

            oscillator.type = tone.type ?? "sine";
            oscillator.frequency.setValueAtTime(tone.frequency, toneStart);
            gain.gain.setValueAtTime(0.0001, toneStart);
            gain.gain.exponentialRampToValueAtTime(
              tone.gain,
              toneStart + 0.01,
            );
            gain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start(toneStart);
            oscillator.stop(toneEnd + 0.02);
          } catch {
            // The activity should keep playing even if audio is unavailable.
          }
        }
      };

      if (audioContext.state === "suspended") {
        void audioContext.resume().then(playPattern).catch(() => undefined);
        return;
      }

      playPattern();
    },
    [getAudioContext, soundEnabled],
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((enabled) => !enabled);
  }, []);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return context;
}
