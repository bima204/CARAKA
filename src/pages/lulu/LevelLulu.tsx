import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import luluData from '../../data/lulu.json';
import { playTetotSound, playKenongHit, playBirdChirp, playCorrectChime, playVictoryFanfare, playGameOverChime } from '../../utils/sfx';
import '../LevelUI.css';

export default function LevelLulu() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentDialogId, setCurrentDialogId] = useState(1);
  const [shakeChoice, setShakeChoice] = useState<number | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [isVideoFadingOut, setIsVideoFadingOut] = useState(false);

  // Sistem Nyawa (3 Hati)
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number>(0);

  // State untuk pengaturan in-game
  const [showSettings, setShowSettings] = useState(false);
  const [musicOn, setMusicOn] = useState(localStorage.getItem('musicOn') !== 'false');
  const [sfxOn, setSfxOn] = useState(localStorage.getItem('sfxOn') !== 'false');

  const toggleMusic = () => {
    const newState = !musicOn;
    setMusicOn(newState);
    localStorage.setItem('musicOn', newState ? 'true' : 'false');
    window.dispatchEvent(new Event('syncMusic'));
  };

  const toggleSfx = () => {
    const newState = !sfxOn;
    setSfxOn(newState);
    localStorage.setItem('sfxOn', newState ? 'true' : 'false');
  };

  // Efek ambient kenong & burung selama di dalam level (hanya jalan setelah video selesai)
  useEffect(() => {
    const musicOn = localStorage.getItem('musicOn') !== 'false';
    if (!musicOn || showVideo || isLevelComplete) return;

    playKenongHit();
    setTimeout(playBirdChirp, 2000);

    const kenongInterval = setInterval(() => playKenongHit(), 8000);
    const birdInterval = setInterval(() => playBirdChirp(), 5500);

    return () => {
      clearInterval(kenongInterval);
      clearInterval(birdInterval);
    };
  }, [showVideo, isLevelComplete]);

  // Ambil data level (default id: 4 untuk level 1 Lulu)
  const levelData = (luluData as any)[id || '4'];
  const currentDialog = levelData?.dialogs?.find((d: any) => d.id === currentDialogId);

  // Video intro cutscene (Level 4: lulu 1.mp4, Level 5: lulu 2.mp4, Level 6: lulu 3.mp4)
  const videoSrc = id === '4' 
    ? '/aset game/video/lulu 1.mp4' 
    : id === '5' 
      ? '/aset game/video/lulu 2.mp4' 
      : id === '6'
        ? '/aset game/video/lulu 3.mp4'
        : null;

  const finishLevel = (currentLives: number) => {
    playVictoryFanfare();
    setIsLevelComplete(true);
    try {
      const savedScores = JSON.parse(localStorage.getItem('caraka_scores') || '{}');
      const currentLevelId = id || '4';
      const existingScore = savedScores[currentLevelId] || 0;
      if (currentLives > existingScore) {
        savedScores[currentLevelId] = currentLives;
        localStorage.setItem('caraka_scores', JSON.stringify(savedScores));
      }

      // Unlock level berikutnya
      const savedUnlocked = JSON.parse(localStorage.getItem('caraka_unlocked') || '[1, 4]');
      const nextLevelNum = parseInt(currentLevelId, 10) + 1;
      if (!savedUnlocked.includes(nextLevelNum)) {
        savedUnlocked.push(nextLevelNum);
        localStorage.setItem('caraka_unlocked', JSON.stringify(savedUnlocked));
      }
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  };

  const handleChoice = (choice: any, index: number) => {
    if (choice.isCorrect) {
      playCorrectChime();
      if (choice.nextDialog) {
        setCurrentDialogId(choice.nextDialog);
        setSelectedChoiceIndex(0);
      } else {
        finishLevel(lives);
      }
    } else {
      playTetotSound();
      setShakeChoice(index);
      setTimeout(() => setShakeChoice(null), 500);

      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          playGameOverChime();
          setTimeout(() => setIsGameOver(true), 600);
        }
        return newLives;
      });
    }
  };

  const handleNextDialog = () => {
    if (currentDialog?.nextDialog) {
      setCurrentDialogId(currentDialog.nextDialog);
      setSelectedChoiceIndex(0);
    } else {
      finishLevel(lives);
    }
  };

  const handleNextDialogRef = useRef(handleNextDialog);
  const handleChoiceRef = useRef(handleChoice);

  useEffect(() => {
    handleNextDialogRef.current = handleNextDialog;
    handleChoiceRef.current = handleChoice;
  });

  // Navigasi keyboard: Enter untuk lanjut, Panah & Enter untuk pilihan ganda
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Jangan jalankan jika video masih main atau modal pengaturan terbuka
      if ((showVideo && videoSrc) || showSettings) return;

      if (isLevelComplete) {
        if (e.key === 'Enter') {
          navigate('/map');
        }
        return;
      }

      if (isGameOver) {
        if (e.key === 'Enter') {
          setIsGameOver(false);
          setLives(3);
          setCurrentDialogId(1);
          setSelectedChoiceIndex(0);
        }
        return;
      }

      if (!currentDialog) return;

      if (currentDialog.type === 'statement') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextDialogRef.current();
        }
      } else if (currentDialog.type === 'question' && currentDialog.choices?.length) {
        const total = currentDialog.choices.length;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          setSelectedChoiceIndex((prev) => (prev + 1) % total);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          setSelectedChoiceIndex((prev) => (prev - 1 + total) % total);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selectedChoice = currentDialog.choices[selectedChoiceIndex];
          if (selectedChoice) {
            handleChoiceRef.current(selectedChoice, selectedChoiceIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showVideo, videoSrc, showSettings, isLevelComplete, isGameOver, currentDialog, selectedChoiceIndex, navigate]);

  const handleVideoEnd = () => {
    setIsVideoFadingOut(true);
    setTimeout(() => {
      setShowVideo(false);
    }, 1000); // Waktu transisi fade out (1 detik)
  };

  // Gambar Karakter Lulu berdasarkan level (Level 4: lulu level 1, Level 5: lulu level 2, dst)
  const getLuluSprite = () => {
    if (id === '5') {
      return '/aset game/aset karakter/lulu level 2.png';
    } else if (id === '6') {
      return '/aset game/aset karakter/lulu level 3.png';
    }
    return '/aset game/aset karakter/lulu level 1.png';
  };

  // Gambar NPC (Eyang / Bu Sri / Sesepuh)
  const getNpcImage = (speaker: string) => {
    const s = speaker.toLowerCase();
    if (s.includes('sesepuh')) {
      return '/aset game/aset karakter/sesepuh.png';
    }
    if (s.includes('sri') || s.includes('guru')) {
      return '/aset game/aset karakter/bu sri.png';
    }
    if (s.includes('eyang')) {
      return '/aset game/aset karakter/eyang.png';
    }
    return '/aset game/aset karakter/sesepuh.png';
  };

  if (!levelData) {
    return <div>Level tidak ditemukan!</div>;
  }

  return (
    <>
      {/* Container Video Cutscene Pembuka (jika aset video tersedia) */}
      {showVideo && videoSrc && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'black', 
          zIndex: 9999,
          opacity: isVideoFadingOut ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <video 
            src={videoSrc} 
            autoPlay 
            controls={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onEnded={handleVideoEnd}
          />
          <button 
            onClick={handleVideoEnd}
            style={{
              position: 'absolute', top: '20px', right: '30px', padding: '10px 20px', 
              background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid white', 
              borderRadius: '10px', cursor: 'pointer', zIndex: 10000,
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            Lewati Video &#9193;
          </button>
        </div>
      )}

      {/* Container Utama Level */}
      <div className="level-container" style={{ backgroundImage: `url('${encodeURI(levelData.background)}')` }}>
      
      {/* Top Navigation Modern */}
      <div className="top-navigation">
        <button 
          className="btn-nav-glass"
          onClick={() => navigate('/map')}
          title="Kembali ke Peta"
        >
          &#8592;
        </button>
        <button 
          className="btn-nav-glass"
          onClick={() => setShowSettings(true)}
          title="Pengaturan"
        >
          &#9881;
        </button>
      </div>

      {/* Indikator Nyawa */}
      {!isGameOver && !isLevelComplete && (
        <div className="lives-container">
          {[...Array(3)].map((_, i) => (
            <span 
              key={i} 
              style={{ 
                opacity: i < lives ? 1 : 0.3, 
                fontSize: '32px',
                filter: i < lives ? 'drop-shadow(0 0 5px rgba(255,0,0,0.5))' : 'grayscale(100%)'
              }}
            >
              ❤️
            </span>
          ))}
        </div>
      )}

      {/* Papan Judul Modern */}
      <div className="title-board">
        <span className="title-text">{levelData.title}</span>
      </div>

      {/* Area Karakter Lulu (Kiri) dan Lawan Bicara (Kanan) */}
      <div className="character-container">
        <img 
          src={getLuluSprite()} 
          alt="Lulu" 
          className={`character-sprite ${currentDialog?.speaker === 'Lulu' ? 'char-active' : 'char-listening'}`}
          style={{ left: '15%' }}
        />
        <img 
          src={getNpcImage(currentDialog?.speaker === 'Lulu' ? (id === '6' ? 'Sesepuh' : id === '5' ? 'Bu Sri' : 'Eyang') : currentDialog?.speaker || 'Sesepuh')} 
          alt={currentDialog?.speaker || 'NPC'} 
          className={`character-sprite ${currentDialog?.speaker !== 'Lulu' ? 'char-active' : 'char-listening'}`}
          style={{ right: '15%' }}
        />
      </div>

      {/* Pilihan Ganda Interaktif */}
      {currentDialog?.type === 'question' && !isLevelComplete && (
        <div className="choices-container">
          {currentDialog.choices.map((choice: any, index: number) => {
            const letters = ['A', 'B', 'C', 'D'];
            const isShaking = shakeChoice === index;
            const isSelected = selectedChoiceIndex === index;
            return (
              <button 
                key={index} 
                className={`choice-btn ${isShaking ? 'shake-animation' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleChoice(choice, index)}
                onMouseEnter={() => setSelectedChoiceIndex(index)}
                style={isShaking ? { border: '2px solid #ef4444', background: 'rgba(239, 68, 68, 0.5)' } : {}}
              >
                <span className="choice-letter">{letters[index]}</span>
                <span style={{ fontSize: '24px', letterSpacing: '1px' }}>{choice.text}</span>
              </button>
            );
          })}
          <div className="keyboard-hint">
            <span>PILIH: ↑ / ↓</span>
            <span>•</span>
            <span>ENTER ↵</span>
          </div>
        </div>
      )}

      {/* Kotak Dialog Narasi Glassmorphism Kiri (Lulu) / Kanan (Eyang) */}
      {!isLevelComplete && currentDialog && (
        <div className={`dialog-container ${currentDialog.speaker === 'Lulu' ? 'dialog-left' : 'dialog-right'}`}>
          <div className={`speaker-badge ${currentDialog.speaker === 'Lulu' ? 'speaker-badge-left' : 'speaker-badge-right'}`}>
            <span className="speaker-name">{currentDialog.speaker}</span>
          </div>
          
          <div className="dialog-text" style={{ fontSize: '26px' }}>{currentDialog.text}</div>
          
          {currentDialog.type === 'statement' && (
            <div className="click-to-continue" onClick={handleNextDialog} title="Klik utawa tekan Enter ing keyboard">
              <span>KLIK UTAWA TEKAN ENTER ↵</span>
              <span>&#10148;</span>
            </div>
          )}
        </div>
      )}

      {/* Card Level Selesai & Bintang */}
      {isLevelComplete && (
        <div className="level-complete-overlay">
          <div className="level-complete-card">
            <h2>🎉 SELAMAT! 🎉</h2>
            <p>Kamu berhasil menyelesaikan <b>{levelData.title}</b>.</p>
            <p>Kawruh aksara Jawa (Ha-Na-Ca-Ra-Ka) wis jempolan tenan!</p>
            
            {/* Tampilan Bintang Prestasi */}
            <div style={{ margin: '20px 0 10px 0', display: 'flex', gap: '10px', fontSize: '42px', justifyContent: 'center' }}>
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i} 
                  style={{ 
                    filter: i < lives ? 'drop-shadow(0 0 10px #f59e0b)' : 'grayscale(100%)',
                    opacity: i < lives ? 1 : 0.35,
                    transform: i < lives ? 'scale(1.15)' : 'scale(1)'
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            
            <p style={{ marginTop: '5px', fontSize: '20px', color: '#F8D179', fontWeight: 'bold' }}>
              Poin Bintang: {lives} / 3 Bintang
            </p>
            <p style={{ fontSize: '16px', color: '#cbd5e1' }}>
              Sisa Nyawa: {'❤️'.repeat(lives)} | Tersimpan di menu Prestasi!
            </p>

            <button className="btn-next-level" onClick={() => navigate('/map')}>
              KEMBALI KE PETA
            </button>
          </div>
        </div>
      )}

      {/* Modal Game Over */}
      {isGameOver && (
        <div className="level-complete-overlay" style={{ zIndex: 100000 }}>
          <div className="level-complete-card" style={{ border: '2px solid #ef4444' }}>
            <h2 style={{ color: '#ef4444', textShadow: 'none' }}>GAME OVER</h2>
            <p style={{ marginBottom: '10px' }}>Yah, nyawamu habis...</p>
            <p style={{ marginBottom: '30px', fontSize: '20px' }}>Ayo sinau maneh aksarane lan baleni level iki ya!</p>
            
            <button className="btn-next-level" style={{ marginBottom: '15px' }} onClick={() => window.location.reload()}>
              ULANGI LEVEL
            </button>

            <button 
              className="btn-next-level" 
              style={{ background: '#333', color: '#fff', border: '1px solid #666', boxShadow: 'none' }} 
              onClick={() => navigate('/map')}
            >
              KEMBALI KE PETA
            </button>
          </div>
        </div>
      )}

      {/* Modal Pengaturan (In-game) */}
      {showSettings && (
        <div className="level-complete-overlay" style={{ zIndex: 100000 }}>
          <div className="level-complete-card">
            <h2>PENGATURAN</h2>
            <p style={{ marginBottom: '30px' }}>Sesuaikan suara game</p>
            
            <button 
              className="choice-btn" 
              style={{ marginBottom: '15px', justifyContent: 'center' }}
              onClick={toggleMusic}
            >
              Suara Ambient: {musicOn ? 'MURUP 🔊' : 'MATI 🔇'}
            </button>

            <button 
              className="choice-btn" 
              style={{ marginBottom: '30px', justifyContent: 'center' }}
              onClick={toggleSfx}
            >
              Efek Suara (SFX): {sfxOn ? 'MURUP 🔊' : 'MATI 🔇'}
            </button>

            <button className="btn-next-level" onClick={() => setShowSettings(false)}>
              TUTUP
            </button>
          </div>
        </div>
      )}

      </div>
    </>
  );
}
