import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import abimanyuData from '../../data/abimanyu.json';
import { playTetotSound, playKenongHit, playBirdChirp, playCorrectChime, playVictoryFanfare, playGameOverChime } from '../../utils/sfx';
import '../LevelUI.css';

export default function LevelAbimanyu() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentDialogId, setCurrentDialogId] = useState(1);
  const [shakeChoice, setShakeChoice] = useState<number | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showVideo, setShowVideo] = useState(true); 
  const [isVideoFadingOut, setIsVideoFadingOut] = useState(false);

  // Sistem Nyawa
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

  // Efek ambient kenong & burung selama di dalam level
  useEffect(() => {
    // Jangan bunyikan saat video awal masih main atau saat level sudah selesai
    const musicOn = localStorage.getItem('musicOn') !== 'false';
    if (!musicOn || showVideo || isLevelComplete) return;

    // Bunyikan pertama kali saat masuk
    playKenongHit();
    setTimeout(playBirdChirp, 2000); // Burung menyusul 2 detik kemudian

    // Loop bunyikan dengan interval berbeda agar terkesan alami
    const kenongInterval = setInterval(() => playKenongHit(), 8000);
    const birdInterval = setInterval(() => playBirdChirp(), 5500);

    return () => {
      clearInterval(kenongInterval);
      clearInterval(birdInterval);
    };
  }, [showVideo, isLevelComplete]);

  // Type assertion since TS doesn't automatically know the JSON shape
  const levelData = (abimanyuData as any)[id || '1'];
  const currentDialog = levelData?.dialogs?.find((d: any) => d.id === currentDialogId);

  // Fungsi untuk mendapatkan gambar Bima sesuai level
  const getBimaSprite = () => {
    if (id === '2') {
      return '/aset game/aset karakter/bima level 2.png';
    } else if (id === '3') {
      return '/aset game/aset karakter/bima level 3.png';
    }
    return '/aset game/aset karakter/bima level 1.png';
  };

  // Fungsi untuk mendapatkan gambar NPC sesuai dengan nama
  const getNpcImage = (speaker: string) => {
    const s = speaker.toLowerCase();
    if (s.includes('pakdhe') || s.includes('pak de')) {
      return '/aset game/aset karakter/pakdhe.png';
    }
    if (s.includes('buyut')) {
      return '/aset game/aset karakter/buyut.png';
    }
    if (s.includes('sesepuh')) {
      return '/aset game/aset karakter/sesepuh.png';
    }
    if (s.includes('ibu') || s.includes('guru') || s.includes('simbok')) {
      return '/aset game/aset karakter/simbok.png';
    }
    return '/aset game/aset karakter/pakdhe.png';
  };

  // Video intro cutscene (Level 1: bima 1.mp4, Level 2: bima 2.mp4, Level 3: bima 3.mp4)
  const videoSrc = id === '1'
    ? '/aset game/video/bima 1.mp4'
    : id === '2'
      ? '/aset game/video/bima 2.mp4'
      : id === '3'
        ? '/aset game/video/bima 3.mp4'
        : null;

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

      // Kurangi nyawa
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          playGameOverChime();
          setTimeout(() => setIsGameOver(true), 600); // Tampilkan Game Over setelah animasi tetot
        }
        return newLives;
      });
    }
  };

  const finishLevel = (currentLives: number) => {
    playVictoryFanfare();
    setIsLevelComplete(true);
    // Simpan bintang dan progress level ke localStorage
    try {
      const savedScores = JSON.parse(localStorage.getItem('caraka_scores') || '{}');
      const currentLevelId = id || '1';
      // Simpan skor tertinggi (bintang)
      const existingScore = savedScores[currentLevelId] || 0;
      if (currentLives > existingScore) {
        savedScores[currentLevelId] = currentLives;
        localStorage.setItem('caraka_scores', JSON.stringify(savedScores));
      }

      // Unlock level berikutnya jika ada
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

  if (!levelData) {
    return <div>Level tidak ditemukan!</div>;
  }

  return (
    <>
      {/* Container Video (Berada di atas segalanya) */}
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
      {!showVideo && !isGameOver && !isLevelComplete && (
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

      {/* Area Karakter */}
      <div className="character-container">
        <img 
          src={getBimaSprite()} 
          alt="Bima" 
          className={`character-sprite ${currentDialog?.speaker === 'Bima' ? 'char-active' : 'char-listening'}`}
          style={{ left: '15%' }}
        />
        <img 
          src={getNpcImage(currentDialog?.speaker === 'Bima' ? (id === '3' ? 'Buyut' : id === '2' ? 'Pakdhe' : 'Simbok') : currentDialog?.speaker || 'Buyut')} 
          alt={currentDialog?.speaker || 'NPC'} 
          className={`character-sprite ${currentDialog?.speaker !== 'Bima' ? 'char-active' : 'char-listening'}`}
          style={{ right: '15%' }}
        />
      </div>

      {/* Pilihan Ganda */}
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
                <span>{choice.text}</span>
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

      {/* Kotak Dialog Narasi Glassmorphism Kiri/Kanan */}
      {!isLevelComplete && currentDialog && (
        <div className={`dialog-container ${currentDialog.speaker === 'Bima' ? 'dialog-left' : 'dialog-right'}`}>
          <div className={`speaker-badge ${currentDialog.speaker === 'Bima' ? 'speaker-badge-left' : 'speaker-badge-right'}`}>
            <span className="speaker-name">{currentDialog.speaker}</span>
          </div>
          
          <div className="dialog-text">{currentDialog.text}</div>
          
          {currentDialog.type === 'statement' && (
            <div className="click-to-continue" onClick={handleNextDialog} title="Klik utawa tekan Enter ing keyboard">
              <span>KLIK UTAWA TEKAN ENTER ↵</span>
              <span>&#10148;</span>
            </div>
          )}
        </div>
      )}

      {/* Card Level Selesai */}
      {isLevelComplete && (
        <div className="level-complete-overlay">
          <div className="level-complete-card">
            <h2>🎉 SELAMAT! 🎉</h2>
            <p>Kamu berhasil menyelesaikan <b>{levelData.title}</b>.</p>
            <p>Unggah-ungguh bahasamu sudah sangat baik!</p>
            
            {/* Tampilan Bintang Prestasi berdasarkan sisa nyawa */}
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
            <p style={{ marginBottom: '30px', fontSize: '20px' }}>Pelajari materi lagi dan ulangi level ini ya!</p>
            
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
