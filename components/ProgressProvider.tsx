"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createDefaultProgress,
  loadProgress,
  saveProgress,
} from "@/lib/progress";
import type { Progress } from "@/types/learning";

type ProgressContextValue = {
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() =>
    createDefaultProgress(),
  );
  const hasLoadedStoredProgress = useRef(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      hasLoadedStoredProgress.current = true;
      setProgress(loadProgress(window.localStorage));
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (hasLoadedStoredProgress.current) {
      saveProgress(window.localStorage, progress);
    }
  }, [progress]);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }

  return context;
}
