export type MelodyId = 'douce-nuit' | 'mon-beau-sapin';

export interface MelodyTrack {
  id: MelodyId;
  title: string;
  subtitle: string;
}

export const MELODY_TRACKS: readonly MelodyTrack[] = [
  {
    id: 'douce-nuit',
    title: 'Douce Nuit',
    subtitle: 'Boîte à musique · Noël',
  },
  {
    id: 'mon-beau-sapin',
    title: 'Mon Beau Sapin',
    subtitle: 'Mélodie douce · Noël',
  },
] as const;

interface NoteEvent {
  freq: number;
  startBeat: number;
  durationBeats: number;
  velocity?: number;
  voice?: 'melody' | 'harmony';
}

// Note frequencies (Hz)
const N = {
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

// "Douce Nuit" (Silent Night) in C major, 3/4 time (36 beats loop)
const DOUCE_NUIT_BPM = 78;
const DOUCE_NUIT_LENGTH_BEATS = 36;
const DOUCE_NUIT_NOTES: NoteEvent[] = [
  // Measure 1-2: G4. A4 G4 | E4...
  { freq: N.G4, startBeat: 0, durationBeats: 1.5, voice: 'melody' },
  { freq: N.A4, startBeat: 1.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.G4, startBeat: 2, durationBeats: 1, voice: 'melody' },
  { freq: N.E4, startBeat: 3, durationBeats: 3, voice: 'melody' },
  // Gentle C major arpeggio
  { freq: N.C4, startBeat: 0, durationBeats: 3, velocity: 0.35, voice: 'harmony' },
  { freq: N.E4, startBeat: 1, durationBeats: 2, velocity: 0.25, voice: 'harmony' },
  { freq: N.C4, startBeat: 3, durationBeats: 3, velocity: 0.35, voice: 'harmony' },
  { freq: N.G3, startBeat: 4, durationBeats: 2, velocity: 0.28, voice: 'harmony' },

  // Measure 3-4: G4. A4 G4 | E4...
  { freq: N.G4, startBeat: 6, durationBeats: 1.5, voice: 'melody' },
  { freq: N.A4, startBeat: 7.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.G4, startBeat: 8, durationBeats: 1, voice: 'melody' },
  { freq: N.E4, startBeat: 9, durationBeats: 3, voice: 'melody' },
  { freq: N.C4, startBeat: 6, durationBeats: 3, velocity: 0.35, voice: 'harmony' },
  { freq: N.E4, startBeat: 7, durationBeats: 2, velocity: 0.25, voice: 'harmony' },
  { freq: N.C4, startBeat: 9, durationBeats: 3, velocity: 0.35, voice: 'harmony' },
  { freq: N.G3, startBeat: 10, durationBeats: 2, velocity: 0.28, voice: 'harmony' },

  // Measure 5-6: D5 D5 | B4...
  { freq: N.D5, startBeat: 12, durationBeats: 2, voice: 'melody' },
  { freq: N.D5, startBeat: 14, durationBeats: 1, voice: 'melody' },
  { freq: N.B4, startBeat: 15, durationBeats: 3, voice: 'melody' },
  { freq: N.G3, startBeat: 12, durationBeats: 3, velocity: 0.36, voice: 'harmony' },
  { freq: N.B3, startBeat: 13, durationBeats: 2, velocity: 0.26, voice: 'harmony' },
  { freq: N.G3, startBeat: 15, durationBeats: 3, velocity: 0.34, voice: 'harmony' },
  { freq: N.D4, startBeat: 16, durationBeats: 2, velocity: 0.26, voice: 'harmony' },

  // Measure 7-8: C5 C5 | G4...
  { freq: N.C5, startBeat: 18, durationBeats: 2, voice: 'melody' },
  { freq: N.C5, startBeat: 20, durationBeats: 1, voice: 'melody' },
  { freq: N.G4, startBeat: 21, durationBeats: 3, voice: 'melody' },
  { freq: N.C4, startBeat: 18, durationBeats: 3, velocity: 0.36, voice: 'harmony' },
  { freq: N.E4, startBeat: 19, durationBeats: 2, velocity: 0.26, voice: 'harmony' },
  { freq: N.C4, startBeat: 21, durationBeats: 3, velocity: 0.34, voice: 'harmony' },
  { freq: N.E4, startBeat: 22, durationBeats: 2, velocity: 0.26, voice: 'harmony' },

  // Measure 9-10: A4 A4 | C5. B4 A4
  { freq: N.A4, startBeat: 24, durationBeats: 2, voice: 'melody' },
  { freq: N.A4, startBeat: 26, durationBeats: 1, voice: 'melody' },
  { freq: N.C5, startBeat: 27, durationBeats: 1.5, voice: 'melody' },
  { freq: N.B4, startBeat: 28.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.A4, startBeat: 29, durationBeats: 1, voice: 'melody' },
  { freq: N.F4, startBeat: 24, durationBeats: 3, velocity: 0.34, voice: 'harmony' },
  { freq: N.C4, startBeat: 25, durationBeats: 2, velocity: 0.26, voice: 'harmony' },
  { freq: N.F4, startBeat: 27, durationBeats: 3, velocity: 0.32, voice: 'harmony' },

  // Measure 11-12: G4. A4 G4 | E4... -> resolve
  { freq: N.G4, startBeat: 30, durationBeats: 1.5, voice: 'melody' },
  { freq: N.A4, startBeat: 31.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.G4, startBeat: 32, durationBeats: 1, voice: 'melody' },
  { freq: N.E4, startBeat: 33, durationBeats: 2.8, voice: 'melody' },
  { freq: N.C4, startBeat: 30, durationBeats: 3, velocity: 0.35, voice: 'harmony' },
  { freq: N.G3, startBeat: 33, durationBeats: 3, velocity: 0.35, voice: 'harmony' },
  { freq: N.C4, startBeat: 34, durationBeats: 2, velocity: 0.26, voice: 'harmony' },
];

// "Mon Beau Sapin" (O Tannenbaum) in C major, 3/4 time (24 beats loop)
const SAPIN_BPM = 84;
const SAPIN_LENGTH_BEATS = 24;
const SAPIN_NOTES: NoteEvent[] = [
  // Pickup & Phrase 1: G4 | C5. C5 C5 | D5 E5. E5 E5
  { freq: N.G4, startBeat: 0, durationBeats: 1, voice: 'melody' },
  { freq: N.C5, startBeat: 1, durationBeats: 0.75, voice: 'melody' },
  { freq: N.C5, startBeat: 1.75, durationBeats: 0.25, voice: 'melody' },
  { freq: N.C5, startBeat: 2, durationBeats: 1, voice: 'melody' },
  { freq: N.D5, startBeat: 3, durationBeats: 1, voice: 'melody' },
  { freq: N.E5, startBeat: 4, durationBeats: 0.75, voice: 'melody' },
  { freq: N.E5, startBeat: 4.75, durationBeats: 0.25, voice: 'melody' },
  { freq: N.E5, startBeat: 5, durationBeats: 1.5, voice: 'melody' },
  { freq: N.C4, startBeat: 1, durationBeats: 3, velocity: 0.34, voice: 'harmony' },
  { freq: N.E4, startBeat: 2, durationBeats: 2, velocity: 0.24, voice: 'harmony' },
  { freq: N.C4, startBeat: 4, durationBeats: 3, velocity: 0.34, voice: 'harmony' },
  { freq: N.G4, startBeat: 5, durationBeats: 2, velocity: 0.22, voice: 'harmony' },

  // Phrase 2: E5 D5 E5 | F5 B4 D5 C5
  { freq: N.E5, startBeat: 6.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.D5, startBeat: 7, durationBeats: 0.5, voice: 'melody' },
  { freq: N.E5, startBeat: 7.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.F5, startBeat: 8, durationBeats: 1, voice: 'melody' },
  { freq: N.B4, startBeat: 9, durationBeats: 1, voice: 'melody' },
  { freq: N.D5, startBeat: 10, durationBeats: 1, voice: 'melody' },
  { freq: N.C5, startBeat: 11, durationBeats: 2, voice: 'melody' },
  { freq: N.G3, startBeat: 8, durationBeats: 3, velocity: 0.35, voice: 'harmony' },
  { freq: N.D4, startBeat: 9, durationBeats: 2, velocity: 0.24, voice: 'harmony' },
  { freq: N.C4, startBeat: 11, durationBeats: 2.5, velocity: 0.35, voice: 'harmony' },
  { freq: N.E4, startBeat: 12, durationBeats: 1.5, velocity: 0.24, voice: 'harmony' },

  // Bridge: G5 G5 E5 A5 | G5 G5 F5 F5
  { freq: N.G5, startBeat: 13.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.G5, startBeat: 14, durationBeats: 0.5, voice: 'melody' },
  { freq: N.E5, startBeat: 14.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.A4, startBeat: 15, durationBeats: 1.5, voice: 'melody' },
  { freq: N.G4, startBeat: 16.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.G4, startBeat: 17, durationBeats: 0.5, voice: 'melody' },
  { freq: N.F4, startBeat: 17.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.F4, startBeat: 18, durationBeats: 1.5, voice: 'melody' },
  { freq: N.C4, startBeat: 14, durationBeats: 3, velocity: 0.32, voice: 'harmony' },
  { freq: N.F4, startBeat: 17, durationBeats: 3, velocity: 0.3, voice: 'harmony' },

  // Resolve: E5 D5 E5 | C5...
  { freq: N.E5, startBeat: 19.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.D5, startBeat: 20, durationBeats: 1, voice: 'melody' },
  { freq: N.E5, startBeat: 21, durationBeats: 0.5, voice: 'melody' },
  { freq: N.D5, startBeat: 21.5, durationBeats: 0.5, voice: 'melody' },
  { freq: N.C5, startBeat: 22, durationBeats: 2, voice: 'melody' },
  { freq: N.G3, startBeat: 20, durationBeats: 2, velocity: 0.32, voice: 'harmony' },
  { freq: N.C4, startBeat: 22, durationBeats: 2, velocity: 0.35, voice: 'harmony' },
];

class ChristmasMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private isPlaying = false;
  private volume = 0.42;
  private track: MelodyId = 'douce-nuit';
  private loopTimer: number | null = null;
  private activeNodes: Set<AudioNode> = new Set();

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      // Soft warm stereo-feel echo tail for music-box sparkle
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.value = 0.34;

      const feedback = this.ctx.createGain();
      feedback.gain.value = 0.26;

      const wetFilter = this.ctx.createBiquadFilter();
      wetFilter.type = 'lowpass';
      wetFilter.frequency.value = 2200;

      const wetGain = this.ctx.createGain();
      wetGain.gain.value = 0.32;

      this.delayNode.connect(wetFilter);
      wetFilter.connect(feedback);
      feedback.connect(this.delayNode);
      wetFilter.connect(wetGain);
      wetGain.connect(this.masterGain);

      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private playNote(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    durationSec: number,
    velocity = 0.7,
    voice: 'melody' | 'harmony' = 'melody',
  ) {
    if (!this.masterGain || !this.delayNode) return;

    const noteGain = ctx.createGain();
    const peak = (voice === 'melody' ? 0.16 : 0.085) * velocity;

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(peak, startTime + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(peak * 0.42, startTime + Math.min(0.45, durationSec * 0.55));
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec + 0.55);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(voice === 'melody' ? 3200 : 1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(900, startTime + durationSec + 0.4);

    // Primary warm celesta/sine voice
    const osc1 = ctx.createOscillator();
    osc1.type = voice === 'melody' ? 'triangle' : 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Subtle bell overtone for melody voice
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(voice === 'melody' ? 0.14 : 0.03, startTime);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(0.5, durationSec));

    osc1.connect(filter);
    osc2.connect(overtoneGain);
    overtoneGain.connect(filter);

    filter.connect(noteGain);
    noteGain.connect(this.masterGain);
    noteGain.connect(this.delayNode);

    osc1.start(startTime);
    osc2.start(startTime);

    const stopAt = startTime + durationSec + 0.65;
    osc1.stop(stopAt);
    osc2.stop(stopAt);

    this.activeNodes.add(osc1);
    this.activeNodes.add(osc2);

    osc1.onended = () => {
      this.activeNodes.delete(osc1);
      this.activeNodes.delete(osc2);
      osc1.disconnect();
      osc2.disconnect();
      overtoneGain.disconnect();
      filter.disconnect();
      noteGain.disconnect();
    };
  }

  private scheduleLoop() {
    if (!this.isPlaying || !this.ctx) return;

    const notes = this.track === 'douce-nuit' ? DOUCE_NUIT_NOTES : SAPIN_NOTES;
    const bpm = this.track === 'douce-nuit' ? DOUCE_NUIT_BPM : SAPIN_BPM;
    const totalBeats =
      this.track === 'douce-nuit' ? DOUCE_NUIT_LENGTH_BEATS : SAPIN_LENGTH_BEATS;

    const secPerBeat = 60 / bpm;
    const startBase = this.ctx.currentTime + 0.06;

    for (const note of notes) {
      this.playNote(
        this.ctx,
        note.freq,
        startBase + note.startBeat * secPerBeat,
        note.durationBeats * secPerBeat,
        note.velocity ?? 0.78,
        note.voice ?? 'melody',
      );
    }

    const loopMs = totalBeats * secPerBeat * 1000;
    this.loopTimer = window.setTimeout(() => {
      this.scheduleLoop();
    }, loopMs);
  }

  private clearScheduled() {
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        (node as OscillatorNode).stop();
      } catch {
        // Already stopped
      }
    });
    this.activeNodes.clear();
  }

  public async play(track?: MelodyId): Promise<boolean> {
    if (track) this.track = track;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return false;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    if (this.isPlaying) {
      this.clearScheduled();
    }

    this.isPlaying = true;
    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.5);

    this.scheduleLoop();
    return true;
  }

  public pause() {
    this.isPlaying = false;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
    }
    window.setTimeout(() => {
      if (!this.isPlaying) {
        this.clearScheduled();
      }
    }, 280);
  }

  public setVolume(nextVolume: number) {
    this.volume = Math.max(0, Math.min(1, nextVolume));
    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, this.volume), now + 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getTrack(): MelodyId {
    return this.track;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const christmasAudio = new ChristmasMusicEngine();
