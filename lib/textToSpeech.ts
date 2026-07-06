export type SpeakOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  fallbackText?: string;
};

const PREFERRED_ENGLISH_LANGS = ["en-IN", "en-GB", "en-US", "en-AU", "en"];
const PREFERRED_HINDI_LANGS = ["hi-IN", "hi"];
const PREFERRED_MARATHI_LANGS = ["mr-IN", "mr"];
const DEVANAGARI_PATTERN = /[\u0900-\u097F]/;

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

export function containsDevanagari(text: string): boolean {
  return DEVANAGARI_PATTERN.test(text);
}

export function inferSpeechLang(text: string, preferredLang?: string): string {
  if (preferredLang) {
    return preferredLang;
  }

  if (containsDevanagari(text)) {
    return "hi-IN";
  }

  return "en-IN";
}

function preferredLangPrefixes(lang: string): string[] {
  if (lang.startsWith("mr")) {
    return [...PREFERRED_MARATHI_LANGS, ...PREFERRED_HINDI_LANGS];
  }

  if (lang.startsWith("hi")) {
    return [...PREFERRED_HINDI_LANGS, ...PREFERRED_MARATHI_LANGS];
  }

  if (lang.startsWith("en")) {
    return PREFERRED_ENGLISH_LANGS;
  }

  return [lang];
}

export function pickVoiceForLang(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) {
    return null;
  }

  const prefixes = preferredLangPrefixes(lang);

  for (const prefix of prefixes) {
    const localMatch = voices.find(
      (voice) => voice.lang.startsWith(prefix) && voice.localService,
    );
    if (localMatch) {
      return localMatch;
    }
  }

  for (const prefix of prefixes) {
    const match = voices.find((voice) => voice.lang.startsWith(prefix));
    if (match) {
      return match;
    }
  }

  return voices[0] ?? null;
}

export function pickEnglishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  return pickVoiceForLang(voices, "en-IN");
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

function resolveSpeakPayload(
  text: string,
  options: SpeakOptions,
): { text: string; lang: string } {
  const trimmed = text.trim();
  const lang = inferSpeechLang(trimmed, options.lang);
  const voices = refreshVoices();
  const voice = pickVoiceForLang(voices, lang);
  const fallback = options.fallbackText?.trim();

  if (!voice && fallback && containsDevanagari(trimmed)) {
    return {
      text: fallback,
      lang: inferSpeechLang(fallback, "en-IN"),
    };
  }

  return { text: trimmed, lang };
}

function buildUtterance(
  text: string,
  options: SpeakOptions,
): SpeechSynthesisUtterance {
  const payload = resolveSpeakPayload(text, options);
  const voices = refreshVoices();
  const voice = pickVoiceForLang(voices, payload.lang);
  const utterance = new SpeechSynthesisUtterance(payload.text);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = payload.lang;
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

function speakWhenVoicesReady(start: () => void): void {
  const synth = getSynth();

  if (!synth) {
    return;
  }

  warmUpSpeechEngine();

  if (refreshVoices().length > 0) {
    start();
    return;
  }

  const onVoicesChanged = () => {
    synth.removeEventListener("voiceschanged", onVoicesChanged);
    refreshVoices();
    start();
  };

  synth.addEventListener("voiceschanged", onVoicesChanged);
  refreshVoices();
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
  const fallback = options.fallbackText?.trim();

  if (!trimmed && !fallback) {
    return;
  }

  const start = () => speakNow(trimmed || fallback || "", options);

  const queueStart = () => {
    speakWhenVoicesReady(start);
  };

  if (!synth.speaking && !synth.pending) {
    queueStart();
    return;
  }

  stopResumeGuard();
  synth.cancel();

  // Samsung Internet and Chrome on Android often drop speech when cancel()
  // and speak() happen in the same turn.
  requestAnimationFrame(() => {
    requestAnimationFrame(queueStart);
  });
}
