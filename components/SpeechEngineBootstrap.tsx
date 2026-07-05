"use client";

import { useEffect } from "react";
import { prepareSpeechEngine } from "@/lib/textToSpeech";

export function SpeechEngineBootstrap() {
  useEffect(() => {
    prepareSpeechEngine();
  }, []);

  return null;
}
