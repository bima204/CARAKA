import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import levelsData from '../data/levels.json';
import './Prestasi.css'; // Untuk class khusus konten prestasi
import './Materi.css'; // Meminjam layout dari Materi

export default function Prestasi() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Ambil skor tersimpan dan level terbuka dari localStorage
  const savedScores: Record<string, number> = (() => {
    try {
      return JSON.parse(localStorage.getItem('caraka_scores') || '{}');
    } catch {
      return {};
    }
  })();

  const savedUnlocked: number[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('caraka_unlocked') || '[1, 4]');
    } catch {
      return [1, 4];
    }
  })();

  // Hitung total skor bintang (gabungan levelData default + savedScores)
  const totalScore = levelsData.reduce((sum, level) => {
    const customScore = savedScores[level.id.toString()];
    return sum + (customScore !== undefined ? customScore : level.score);
  }, 0);
  
  // Hitung jumlah level yang sudah terbuka (gabungan default + savedUnlocked)
  const unlockedLevels = levelsData.filter(level => 
    level.isUnlocked || savedUnlocked.includes(level.id)
  ).length;
  const totalLevels = levelsData.length;

  // Cek apakah Bima level 1-3 sudah selesai
  const isBimaCompleted = [1, 2, 3].every(lid => (savedScores[lid.toString()] || 0) > 0);
  // Cek apakah Lu Lu level 4-6 sudah selesai
  const isLuluCompleted = [4, 5, 6].every(lid => (savedScores[lid.toString()] || 0) > 0);

  // Data Medali
  const medals = [
    {
      id: 1,
      name: "Bocah Sregep",
      desc: "Mbukak 3 level",
      icon: "🥉",
      isUnlocked: unlockedLevels >= 3
    },
    {
      id: 2,
      name: "Pinter Aksara",
      desc: "Rampung kabeh level Lu Lu",
      icon: "📜",
      isUnlocked: isLuluCompleted
    },
    {
      id: 3,
      name: "Bocah Sopan",
      desc: "Rampung kabeh level Bima",
      icon: "🙏",
      isUnlocked: (savedScores['1'] || 0) > 0 || isBimaCompleted
    },
    {
      id: 4,
      name: "Satria Bintang",
      desc: "Ngumpulake bintang akeh (>5 bintang)",
      icon: "⭐",
      isUnlocked: totalScore >= 5
    }
  ];

  return (
    <div className="materi-page-container">
      <button className="btn-back-home" onClick={() => navigate('/home')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        MBALIK
      </button>

      {/* Balon Kata Petruk yang Lucu */}
      <div className="petruk-speech-bubble">
        "Wah hebat! Iki lho cathetan prestasimu. Terus sinau supaya bintangmu tambah akeh ya!"
      </div>

      {/* Karakter Petruk */}
      <div className="petruk-container">
        <img 
          src="/aset game/aset karakter/petruk.png" 
          alt="Petruk" 
          className="petruk-character"
        />
      </div>

      {/* Menu Utama Prestasi (Mirip layout Materi) */}
      <div className="materi-menu-container">
        <h1 className="materi-title-text" style={{fontSize: '3.5rem'}}>PRESTASI</h1>

        <button className="btn-menu btn-utama" onClick={() => openModal('statistik')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Bintang & Level</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Delok Kemajuanmu</div>
        </button>

        <button className="btn-menu" onClick={() => openModal('medali')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Koleksi Lencana</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Pajangan Medali</div>
        </button>

        <button className="btn-menu" onClick={() => openModal('ranking')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Papan Peringkat</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Tandhing karo Kanca</div>
        </button>
      </div>

      {/* Modals for Content */}
      {activeModal === 'statistik' && (
        <div className="materi-content-overlay" onClick={closeModal}>
          <div className="materi-content-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>X</button>
            <div className="modal-header">
              <h2>Bintang & Level</h2>
            </div>
            <div className="modal-body" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              
              <div className="stats-container" style={{width: '100%'}}>
                <div className="stat-box">
                  <div className="stat-value">{totalScore} <span style={{fontSize: '2rem'}}>⭐</span></div>
                  <div className="stat-label">Bintang Kumpul</div>
                </div>
                
                <div className="stat-box">
                  <div className="stat-value">{unlockedLevels}/{totalLevels} 🗝️</div>
                  <div className="stat-label">Level Dibukak</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {activeModal === 'medali' && (
        <div className="materi-content-overlay" onClick={closeModal}>
          <div className="materi-content-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>X</button>
            <div className="modal-header">
              <h2>Koleksi Lencana</h2>
            </div>
            <div className="modal-body">
              <div className="medals-grid">
                {medals.map(medal => (
                  <div key={medal.id} className={`medal-card ${medal.isUnlocked ? 'unlocked' : ''}`}>
                    <div className="medal-icon">{medal.icon}</div>
                    <div className="medal-name">{medal.name}</div>
                    <div className="medal-desc">{medal.desc}</div>
                    {!medal.isUnlocked && (
                      <div style={{marginTop: '15px', fontSize: '1.2rem'}}>🔒</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'ranking' && (
        <div className="materi-content-overlay" onClick={closeModal}>
          <div className="materi-content-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>X</button>
            <div className="modal-header">
              <h2>Papan Peringkat (Ranking)</h2>
            </div>
            <div className="modal-body" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontSize: '7rem', marginBottom: '30px', animation: 'floatTitle 3s infinite'}}>🏆</div>
              <h3 style={{fontSize: '2.5rem', color: '#8b3c1b', marginBottom: '15px', fontWeight: '900'}}>Bakal Teka!</h3>
              <p style={{textAlign: 'center', fontSize: '1.4rem', color: '#5c240c', maxWidth: '600px', lineHeight: '1.6'}}>
                Fitur tandhing karo kanca sekelas lagi disiapake. Sabar dhisik ya!
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
