export type SpeakOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
};

const PREFERRED_LANGS = ["en-IN", "en-GB", "en-US", "en-AU", "en"];

let cachedVoices: SpeechSynthesisVoice[] = [];
let enginePrepared = false;
let engineWarmedUp = false;
let resumeGuardId: number | null = null;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  return window.speechSynthesis;
}

export function isSpeechSupported(): boolean {
  return getSynth() !== null;
}

export function pickEnglishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) {
    return null;
  }

  for (const lang of PREFERRED_LANGS) {
    const localMatch = voices.find(
      (voice) => voice.lang.startsWith(lang) && voice.localService,
    );
    if (localMatch) {
      return localMatch;
    }
  }

  for (const lang of PREFERRED_LANGS) {
    const match = voices.find((voice) => voice.lang.startsWith(lang));
    if (match) {
      return match;
    }
  }

  return voices[0] ?? null;
}

function refreshVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth();

  if (!synth) {
    return [];
  }

  cachedVoices = synth.getVoices();
  return cachedVoices;
}

function stopResumeGuard(): void {
  if (resumeGuardId !== null) {
    window.clearInterval(resumeGuardId);
    resumeGuardId = null;
  }
}

function startResumeGuard(synth: SpeechSynthesis): void {
  stopResumeGuard();

  resumeGuardId = window.setInterval(() => {
    if (!synth.speaking) {
      stopResumeGuard();
      return;
    }

    if (synth.paused) {
      synth.resume();
    }
  }, 120);
}

function buildUtterance(
  text: string,
  options: SpeakOptions,
): SpeechSynthesisUtterance {
  const voices = refreshVoices();
  const voice = pickEnglishVoice(voices);
  const utterance = new SpeechSynthesisUtterance(text);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = options.lang ?? "en-US";
  }

  utterance.rate = options.rate ?? 0.88;
  utterance.pitch = options.pitch ?? 1.05;
  utterance.volume = 1;

  utterance.onend = stopResumeGuard;
  utterance.onerror = stopResumeGuard;

  return utterance;
}

function speakNow(text: string, options: SpeakOptions): void {
  const synth = getSynth();

  if (!synth) {
    return;
  }

  if (synth.paused) {
    synth.resume();
  }

  const utterance = buildUtterance(text, options);
  synth.speak(utterance);
  startResumeGuard(synth);
}

export function warmUpSpeechEngine(): void {
  if (engineWarmedUp) {
    refreshVoices();
    return;
  }

  engineWarmedUp = true;
  refreshVoices();
}

export function prepareSpeechEngine(): void {
  if (enginePrepared || !isSpeechSupported()) {
    return;
  }

  enginePrepared = true;

  const synth = getSynth();

  if (!synth) {
    return;
  }

  refreshVoices();
  synth.addEventListener("voiceschanged", refreshVoices);

  const primeOnInteraction = () => {
    warmUpSpeechEngine();
    refreshVoices();
  };

  window.addEventListener("pointerdown", primeOnInteraction, {
    capture: true,
    once: true,
  });
  window.addEventListener("keydown", primeOnInteraction, {
    capture: true,
    once: true,
  });
}

export function cancelSpeech(): void {
  const synth = getSynth();

  if (!synth) {
    return;
  }

  stopResumeGuard();
  synth.cancel();
}

export function speakText(text: string, options: SpeakOptions = {}): void {
  const synth = getSynth();

  if (!synth) {
    return;
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return;
  }

  const start = () => speakNow(trimmed, options);

  if (!synth.speaking && !synth.pending) {
    start();
    return;
  }

  stopResumeGuard();
  synth.cancel();

  // Samsung Internet and Chrome on Android often drop speech when cancel()
  // and speak() happen in the same turn.
  requestAnimationFrame(() => {
    requestAnimationFrame(start);
  });
}
