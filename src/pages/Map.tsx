import { useNavigate } from 'react-router-dom';
import levelsData from '../data/levels.json';
import { playGamelanClick } from '../utils/sfx';

export default function Map() {
  const navigate = useNavigate();

  // Ambil level yang sudah terbuka dari localStorage
  const savedUnlocked: number[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('caraka_unlocked') || '[1, 4]');
    } catch {
      return [1, 4];
    }
  })();

  // Posisi presisi untuk ikon peta
  const levelAssets = [
    { id: 1, top: '65%', left: '16%', src: '/aset game/aset level/aset level abimanyu/aset rumah abimanyu level 1.png', width: '12vw' },
    { id: 2, top: '48%', left: '26%', src: '/aset game/aset level/aset level abimanyu/aset desa ngandap asor level 2.png', width: '9vw' },
    { id: 3, top: '53%', left: '38%', src: '/aset game/aset level/aset level abimanyu/aset desa ragajimbangan level 3.png', width: '10vw' },
    { id: 4, top: '70%', left: '82%', src: '/aset game/aset level/aset level lulu/level 4 candi cilik.png', width: '10vw' },
    { id: 5, top: '62%', left: '55%', src: '/aset game/aset level/aset level lulu/level 5 candi prambanan.png', width: '18vw' },
    { id: 6, top: '48%', left: '75%', src: '/aset game/aset level/aset level lulu/level 6 candi burobudhur.png', width: '20vw' },
  ];

  return (
    <div className="map-page-container">
      {/* Tombol Kembali */}
      <button 
        className="btn-back-home"
        onClick={() => {
          playGamelanClick();
          navigate('/home');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        MBALIK
      </button>

      {/* Petunjuk Orientasi untuk Mobile Portrait */}
      <div className="map-rotate-hint">
        <span>🔄</span> Putar HP (Landscape)
      </div>

      {/* Karakter Petruk sebagai pemandu (Kanan Bawah) */}
      <img 
        src="/aset game/aset karakter/petruk.png" 
        alt="Petruk Bawah"
        className="map-petruk-guide"
        style={{
          position: 'absolute',
          bottom: '-3vh',
          right: '-2vw',
          height: '35vh',
          objectFit: 'contain',
          zIndex: 5
        }}
      />

      {/* Titik Level (Aset Gambar) */}
      {levelsData.map((level) => {
        const isLocked = !level.isUnlocked && !savedUnlocked.includes(level.id);
        const asset = levelAssets.find(a => a.id === level.id);
        if (!asset) return null;

        return (
          <div 
            key={level.id}
            className={`map-icon-container ${isLocked ? 'locked' : ''}`}
            style={{
              position: 'absolute',
              top: asset.top,
              left: asset.left,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              zIndex: 50
            }}
            onClick={() => {
              if (!isLocked) {
                playGamelanClick();
                navigate(`/level/${level.character}/${level.id}`);
              }
            }}
          >
            <img 
              src={asset.src} 
              alt={level.name} 
              className="map-icon-img"
              style={{ width: asset.width || '120vw' }}
            />
            {isLocked && (
              <div className="padlock-overlay">
                🔒
              </div>
            )}
            <div className="tooltip">
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{level.name}</div>
              <div style={{ fontSize: '1rem', color: '#ffd54f', marginTop: '5px', whiteSpace: 'normal', lineHeight: '1.2' }}>
                {level.description}
              </div>
              {isLocked && <div style={{ fontSize: '0.9rem', color: '#ffaaaa', marginTop: '5px' }}>🔒 Terkunci</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
