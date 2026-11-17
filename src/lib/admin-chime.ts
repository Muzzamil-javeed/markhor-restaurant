/** Short kitchen chime using Web Audio (no asset required). */
export function playNewOrderChime() {
  if (typeof window === "undefined") return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const tones = [880, 1174];
  tones.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02 + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + index * 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + index * 0.08);
    osc.stop(now + 0.35 + index * 0.1);
  });

  window.setTimeout(() => {
    void ctx.close();
  }, 800);
}
