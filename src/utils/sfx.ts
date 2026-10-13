// Utility untuk efek suara sintesis tanpa file audio eksternal
let audioCtx: AudioContext | null = null;

export const playGamelanClick = () => {
  try {
    const sfxOn = localStorage.getItem('sfxOn') !== 'false';
    if (!sfxOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const duration = 0.8; // Gema bonang lumayan panjang

    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);

    // Envelope: Dipukul keras lalu memudar perlahan
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.6, t + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // Frekuensi dasar (mendekati nada saron/bonang slendro)
    const fundamental = 587.33; // Nada D5

    // Helper untuk membuat overtone metalik
    const createOsc = (freq: number, gainLevel: number) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = gainLevel;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + duration);
    };

    // Menggabungkan beberapa gelombang sine agar terdengar seperti perunggu/kuningan
    createOsc(fundamental, 1.0);       // Nada utama
    createOsc(fundamental * 2.76, 0.5); // Resonansi metalik 1
    createOsc(fundamental * 5.4, 0.2);  // Resonansi metalik 2
    createOsc(fundamental * 8.9, 0.1);  // Resonansi metalik 3

  } catch (e) {
    console.error("Gagal memutar SFX:", e);
  }
};

export const playPopSound = () => {
  try {
    const sfxOn = localStorage.getItem('sfxOn') !== 'false';
    if (!sfxOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Karakteristik suara: Pop / bubble
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    console.error("Gagal memutar SFX:", e);
  }
};

// Sintesis Suara Angin (Dihapus karena user akan menggunakan file MP3)

// Suara salah (Buzzer / Tetot)
export const playTetotSound = () => {
  try {
    const sfxOn = localStorage.getItem('sfxOn') !== 'false';
    if (!sfxOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const duration = 0.3; 

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Gelombang kasar seperti buzzer
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t); // Nada rendah (tetot)
    
    // Envelope kasar
    gainNode.gain.setValueAtTime(0.5, t);
    gainNode.gain.linearRampToValueAtTime(0, t + duration);

    osc.start(t);
    osc.stop(t + duration);
  } catch (e) {
    console.error("Gagal memutar SFX:", e);
  }
};

// Suara jawaban benar (Chime bonang melodi nada naik ceria)
export const playCorrectChime = () => {
  try {
    const sfxOn = localStorage.getItem('sfxOn') !== 'false';
    if (!sfxOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const notes = [587.33, 739.99, 880.00]; // D5, F#5, A5 (Harmonis ceria)

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.12;
      const duration = 0.5;

      const osc = audioCtx!.createOscillator();
      const overtone = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.76, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.35, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(audioCtx!.destination);

      osc.start(noteTime);
      overtone.start(noteTime);
      osc.stop(noteTime + duration);
      overtone.stop(noteTime + duration);
    });
  } catch (e) {
    console.error("Gagal memutar SFX Jawaban Benar:", e);
  }
};

// Suara kemenangan saat level selesai (Fanfare gamelan ceria + gong)
export const playVictoryFanfare = () => {
  try {
    const sfxOn = localStorage.getItem('sfxOn') !== 'false';
    if (!sfxOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    // Nada melodi kemenangan bertahap
    const melody = [
      { freq: 440.00, time: 0 },
      { freq: 587.33, time: 0.15 },
      { freq: 659.25, time: 0.3 },
      { freq: 880.00, time: 0.45 },
      { freq: 1174.66, time: 0.65 }
    ];

    melody.forEach(({ freq, time }) => {
      const noteTime = t + time;
      const duration = 0.6;

      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.4, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    });

    // Gong penutup kemenangan
    const gongTime = t + 0.7;
    const gongDuration = 2.5;
    const gongOsc = audioCtx.createOscillator();
    const gongGain = audioCtx.createGain();

    gongOsc.type = 'sine';
    gongOsc.frequency.setValueAtTime(130.81, gongTime); // C3 deep resonance

    gongGain.gain.setValueAtTime(0, gongTime);
    gongGain.gain.linearRampToValueAtTime(0.5, gongTime + 0.05);
    gongGain.gain.exponentialRampToValueAtTime(0.001, gongTime + gongDuration);

    gongOsc.connect(gongGain);
    gongGain.connect(audioCtx.destination);

    gongOsc.start(gongTime);
    gongOsc.stop(gongTime + gongDuration);

  } catch (e) {
    console.error("Gagal memutar SFX Kemenangan:", e);
  }
};

// Suara kekalahan / Game Over (Nada turun melankolis)
export const playGameOverChime = () => {
  try {
    const sfxOn = localStorage.getItem('sfxOn') !== 'false';
    if (!sfxOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const notes = [
      { freq: 440.00, time: 0 },
      { freq: 392.00, time: 0.25 },
      { freq: 329.63, time: 0.5 },
      { freq: 220.00, time: 0.8 }
    ];

    notes.forEach(({ freq, time }) => {
      const noteTime = t + time;
      const duration = 0.5;

      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx!.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    });
  } catch (e) {
    console.error("Gagal memutar SFX Game Over:", e);
  }
};



// Suara background level (Kenong ambient)
export const playKenongHit = () => {
  try {
    const musicOn = localStorage.getItem('musicOn') !== 'false';
    if (!musicOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const duration = 5.0; // Gema kenong sangat panjang

    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    
    // Envelope kenong: pukulan lambat, sustain panjang
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.2, t + 0.1); // Volume pelan (0.2) agar tidak mengganggu
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // Kenong bernada rendah dan berat
    const fundamental = 196.00; // G3

    const createOsc = (freq: number, gainLevel: number) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = gainLevel;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + duration);
    };

    createOsc(fundamental, 1.0);       // Nada utama tebal
    createOsc(fundamental * 1.5, 0.4); // Resonansi
    createOsc(fundamental * 2.1, 0.2); // Resonansi atas
  } catch (e) {
    console.error("Gagal memutar SFX:", e);
  }
};



// Suara burung (Bird Chirp)
export const playBirdChirp = () => {
  try {
    const musicOn = localStorage.getItem('musicOn') !== 'false';
    if (!musicOn) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    
    // Fungsi pembantu kicauan
    const chirp = (startTime: number, startFreq: number, endFreq: number, duration: number) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioCtx!.destination);
      
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + duration * 0.2); // Volume pelan
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Pola kicauan ganda
    chirp(t, 2500, 3500, 0.15);
    chirp(t + 0.25, 2800, 3800, 0.15);
    
  } catch (e) {
    console.error("Gagal memutar SFX:", e);
  }
};

