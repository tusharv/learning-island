export type SpeakOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
};

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function cancelSpeech(): void {
  if (!isSpeechSupported()) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function speakText(text: string, options: SpeakOptions = {}): void {
  if (!isSpeechSupported()) {
    return;
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return;
  }

  cancelSpeech();

  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = options.lang ?? "en-US";
  utterance.rate = options.rate ?? 0.88;
  utterance.pitch = options.pitch ?? 1.05;

  window.speechSynthesis.speak(utterance);
}
