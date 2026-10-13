import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HalamanAwal.css';
import './Home.css';

// Predefined particles agar render stabil dan 100% pure
const AWAL_PARTICLES = Array.from({ length: 20 }).map((_, i) => {
  const pseudo1 = ((i * 9301 + 49297) % 233280) / 233280;
  const pseudo2 = (((i + 11) * 9301 + 49297) % 233280) / 233280;
  return {
    id: i,
    type: i % 3 === 0 ? 'leaf' : 'dust',
    top: `${(pseudo1 * 100).toFixed(1)}%`,
    duration: `${(4 + pseudo2 * 5).toFixed(1)}s`,
    delay: `${(pseudo1 * 5).toFixed(1)}s`,
    size: `${(15 + pseudo2 * 20).toFixed(1)}px`
  };
});

export default function HalamanAwal() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);
  const particles = AWAL_PARTICLES;

  const windAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleLabuh = () => {
    setIsLeaving(true);
    
    // Matikan suara angin MP3 jika sedang main
    if (windAudioRef.current) {
      windAudioRef.current.pause();
    }
    
    window.dispatchEvent(new Event('startMusic')); // Panggil musik!
    
    // Tunggu animasi turun dari langit & kabut (6 detik) lalu navigasi
    setTimeout(() => {
      navigate('/home', { state: { fromOpening: true } });
    }, 6000);
  };

  // Coba paksa mainkan MP3 saat halaman dimuat (jika diizinkan browser)
  useEffect(() => {
    const playWind = () => {
      if (windAudioRef.current && !isLeaving) {
        windAudioRef.current.play().catch(e => console.log("Autoplay angin diblokir:", e));
      }
    };
    
    playWind();

    const handleFirstClick = () => {
      playWind();
      document.removeEventListener('click', handleFirstClick);
    };
    document.addEventListener('click', handleFirstClick);

    return () => document.removeEventListener('click', handleFirstClick);
  }, [isLeaving]);

  return (
    <div className={`splash-container ${isLeaving ? 'descending' : ''}`}>
      {/* 
        Taruh file mp3 suara angin dengan nama "angin.mp3" 
        di dalam folder "public/aset game/backsound/" 
      */}
      <audio ref={windAudioRef} src="/aset game/backsound/angin.mp3" loop />
      {/* Overlay Kabut Transisi */}
      <div className={`mist-overlay ${isLeaving ? 'active' : ''}`} />
      {/* Efek Angin & Partikel */}
      <div className="particle-container" style={{zIndex: 1}}>
        {particles.map(p => (
          <div 
            key={p.id}
            className={p.type === 'leaf' ? 'wind-leaf' : 'wind-particle'}
            style={{
              top: p.top,
              width: p.size,
              height: p.type === 'leaf' ? `${parseInt(p.size) * 0.6}px` : p.size,
              animationDuration: p.duration,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      <img 
        src="/aset game/aset tambahan/aset judul.png" 
        alt="CARAKA" 
        className="splash-logo" 
      />

      <button className="btn-labuh" onClick={handleLabuh}>
        <img src="/aset game/aset tambahan/labuh.png" alt="LABUH" className="labuh-img" />
      </button>
    </div>
  );
}
