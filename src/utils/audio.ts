/**
 * Web Audio API procedural sound synthesizer for Cozy Farm game.
 * Completely self-contained, no external mp3 assets needed.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isMusicOn: boolean = false;
  private musicInterval: number | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Cute bubble pop for button clicks, selections, planting
  playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Water droplet / splash sound
  playWater() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // First droplet
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(500, now + 0.1);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // Second bounce droplet
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1100, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(750, now + 0.16);
    gain2.gain.setValueAtTime(0.12, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.17);
  }

  // Bright harvest sparkle chime
  playHarvest() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteTime = now + idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.14, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.26);
    });
  }

  // Coin collect / sale cash jingle
  playCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.07); // E6

    osc2.frequency.setValueAtTime(493.88, now);
    osc2.frequency.setValueAtTime(659.25, now + 0.07);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

  // Cute animal chime / heart reaction
  playAnimalPet() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Level Up Fanfare!
  playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      [523.25, 659.25], // C5, E5
      [587.33, 739.99], // D5, F#5
      [659.25, 783.99], // E5, G5
      [783.99, 1046.5, 1318.51] // G5, C6, E6
    ];

    chords.forEach((frequencies, step) => {
      const stepTime = now + step * 0.12;
      frequencies.forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, stepTime);

        const duration = step === 3 ? 0.6 : 0.15;
        gain.gain.setValueAtTime(0.12, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(stepTime);
        osc.stop(stepTime + duration + 0.05);
      });
    });
  }

  // Artisan machine complete or order delivered
  playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [659.25, 880, 1174.66]; // E5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  // Toggle ambient gentle background melody
  toggleMusic(enable?: boolean) {
    const shouldEnable = enable !== undefined ? enable : !this.isMusicOn;
    this.isMusicOn = shouldEnable;

    if (!shouldEnable) {
      if (this.musicInterval) {
        window.clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      return;
    }

    this.initCtx();
    if (!this.ctx) return;

    // Peaceful farm acoustic arpeggio in C Major / Pentatonic
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 659.25, 392.00];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isMusicOn || this.isMuted || !this.ctx) return;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    };

    if (this.musicInterval) window.clearInterval(this.musicInterval);
    this.musicInterval = window.setInterval(playNextNote, 600);
  }
}

export const sound = new SoundManager();
