"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { useDictionary } from "@/i18n/use-dictionary";

/** Phát âm tên khoa học bằng giọng đọc trình duyệt (Web Speech API) — không cần file audio thật. */
export function AudioPronounceButton({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const dict = useDictionary();

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "la"; // gần với cách đọc Latin hoá danh pháp khoa học
    utter.rate = 0.85;
    utter.onstart = () => setPlaying(true);
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utter);
  };

  if (unsupported) return null;

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`${dict.audioPronounce.ariaPrefix} ${text}`}
      title={dict.audioPronounce.listenLabel}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint transition-colors hover:border-pine hover:text-pine"
    >
      <Volume2 className={`size-3.5 ${playing ? "animate-pulse text-pine" : ""}`} />
    </button>
  );
}
