import { useCallback, useState } from "react";

// Wraps the browser's SpeechSynthesis API. Centralizing this means every
// "Speak Result" button in the app shares one speaking/paused state instead
// of each component managing its own — so starting a new utterance always
// correctly cancels whatever was playing before (no overlapping speech).
export function useVoice() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const speak = useCallback((text, lang = "en-US") => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    setSpeaking(true);
    setPaused(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, []);

  return { speaking, paused, speak, stop, pause, resume };
}
