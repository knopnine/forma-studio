export interface IAudioHapticAdapter {
  playBeep(frequency?: number, durationMs?: number): void;
  playCountdownTick(): void;
  playTimerComplete(): void;
  playSetComplete(): void;
  playVictoryFanfare(): void;
  vibrate(pattern?: number | number[]): void;
}

class WebAudioHapticAdapter implements IAudioHapticAdapter {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playBeep(frequency = 520, durationMs = 120): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore cleanup errors
        }
      };

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Audio context might be restricted before first interaction
    }
  }

  playCountdownTick(): void {
    this.playBeep(440, 80);
    this.vibrate(40);
  }

  playTimerComplete(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5 energetic major triad

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.onended = () => {
          try {
            osc.disconnect();
            gain.disconnect();
          } catch {}
        };

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.25);
      });

      this.vibrate([100, 50, 150]);
    } catch {
      // Fallback
    }
  }

  playSetComplete(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5 -> E5 -> G5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.onended = () => {
          try {
            osc.disconnect();
            gain.disconnect();
          } catch {}
        };

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.18);
      });

      this.vibrate([60, 40, 80]);
    } catch {
      // Fallback
    }
  }

  playVictoryFanfare(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const chords = [
        { freq: 523.25, time: 0.0, dur: 0.15 },
        { freq: 659.25, time: 0.15, dur: 0.15 },
        { freq: 783.99, time: 0.3, dur: 0.15 },
        { freq: 1046.5, time: 0.45, dur: 0.5 }, // High C6
      ];

      chords.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(0.25, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.onended = () => {
          try {
            osc.disconnect();
            gain.disconnect();
          } catch {}
        };

        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur);
      });

      this.vibrate([100, 50, 100, 50, 250]);
    } catch {
      // Fallback
    }
  }

  vibrate(pattern: number | number[] = 50): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptics restriction
      }
    }
  }
}

export const AudioHaptics = new WebAudioHapticAdapter();
