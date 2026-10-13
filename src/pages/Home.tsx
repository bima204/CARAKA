import { useNavigate, useLocation } from 'react-router-dom';
import './Home.css';

// Predefined particles agar render stabil dan 100% pure
const HOME_PARTICLES = Array.from({ length: 15 }).map((_, i) => {
  const pseudo1 = ((i * 9301 + 49297) % 233280) / 233280;
  const pseudo2 = (((i + 7) * 9301 + 49297) % 233280) / 233280;
  return {
    id: i,
    type: i % 3 === 0 ? 'leaf' : 'dust',
    top: `${(pseudo1 * 100).toFixed(1)}%`,
    duration: `${(6 + pseudo2 * 6).toFixed(1)}s`,
    delay: `${(pseudo1 * 5).toFixed(1)}s`,
    size: `${(4 + pseudo2 * 5).toFixed(1)}px`
  };
});

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromOpening = location.state?.fromOpening;
  const particles = HOME_PARTICLES;

  return (
    <div className="home-container">
      {/* Transisi Kabut Menghilang saat baru masuk dari Opening */}
      {fromOpening && <div className="mist-fade-out" />}
      
      {/* Efek Angin & Partikel */}
      <div className="particle-container">
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

      {/* Karakter Abimanyu (Kiri) */}
      <img 
        src="/aset game/aset karakter/abimanyu tampilan utama.png" 
        alt="Bima"
        className="home-character-left"
      />

      {/* Karakter Lulu (Kanan) */}
      <img 
        src="/aset game/aset karakter/lulu tampilan utama.png" 
        alt="Lu Lu"
        className="home-character-right"
      />

      {/* Judul CARAKA (Tengah Atas) */}
      <img 
        src="/aset game/aset tambahan/aset judul.png" 
        alt="Judul CARAKA"
        className="home-title-img"
      />

      {/* Menu Tombol */}
      <div className="home-menu-container">
        <button className="btn-menu btn-utama" onClick={() => navigate('/map')}>
          <div className="btn-title">MULAI DOLAN</div>
          <div className="btn-subtitle">Mlebu ing Peta Petualangan</div>
        </button>
        <button className="btn-menu" onClick={() => navigate('/materi')}>
          <div className="btn-title">Materi & Basa</div>
        </button>
        <button className="btn-menu" onClick={() => navigate('/prestasi')}>
          <div className="btn-title">Prestasi & Bintang</div>
        </button>
        <button className="btn-menu" onClick={() => navigate('/tentang')}>
          <div className="btn-title">Tentang Aplikasi</div>
        </button>
        <button className="btn-menu btn-kecil" onClick={() => navigate('/pengaturan')}>
          <div className="btn-title">Pengaturan</div>
        </button>
      </div>
    </div>
  );
}
