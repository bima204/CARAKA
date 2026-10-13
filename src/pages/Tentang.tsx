import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Materi.css'; // Meminjam layout dari Materi agar seragam

export default function Tentang() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

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
        "Sugeng rawuh! Game CARAKA iki digawe supaya kowe kabeh seneng sinau budaya lan basa Jawa. Keren to?"
      </div>

      {/* Karakter Petruk */}
      <div className="petruk-container">
        <img 
          src="/aset game/aset karakter/petruk.png" 
          alt="Petruk" 
          className="petruk-character"
        />
      </div>

      {/* Menu Utama Tentang (Mirip layout Materi) */}
      <div className="materi-menu-container">
        <h1 className="materi-title-text" style={{fontSize: '3rem'}}>TENTANG CARAKA</h1>

        <button className="btn-menu btn-utama" onClick={() => openModal('tujuan')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Tujuan Game</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Napa game iki digawe?</div>
        </button>

        <button className="btn-menu" onClick={() => openModal('cara')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Cara Dolan</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Pandhuan main game</div>
        </button>

        <button className="btn-menu" onClick={() => openModal('tim')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Tim Pengembang</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Sapa sing nggawe?</div>
        </button>
      </div>

      {/* Modals for Content */}
      {activeModal === 'tujuan' && (
        <div className="materi-content-overlay" onClick={closeModal}>
          <div className="materi-content-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>X</button>
            <div className="modal-header">
              <h2>Tujuan Aplikasi</h2>
            </div>
            <div className="modal-body" style={{padding: '30px', fontSize: '1.4rem', color: '#5c240c', lineHeight: '1.6'}}>
              <p style={{marginBottom: '15px'}}>
                <strong>CARAKA</strong> iku game edukasi sing digawe khusus kanggo ngenalake lan nglestarekake budaya Jawa kanggo bocah-bocah lan generasi enom.
              </p>
              <p style={{marginBottom: '15px'}}>
                Liwat petualangan Bima lan Lu Lu, kowe bakal diajak sinau:
              </p>
              <ul style={{textAlign: 'left', marginLeft: '40px', marginBottom: '20px'}}>
                <li><strong>Aksara Jawa:</strong> Ngenal lan maca tulisan Jawa kuno.</li>
                <li><strong>Unggah-ungguh Basa:</strong> Tata krama lan basa sing bener (Ngoko lan Krama).</li>
                <li><strong>Budaya Nusantara:</strong> Mengenal bangunan lan sejarah kaya Candi.</li>
              </ul>
              <p>Muga-muga kanthi dolanan iki, budaya Jawa tetep lestari!</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'cara' && (
        <div className="materi-content-overlay" onClick={closeModal}>
          <div className="materi-content-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>X</button>
            <div className="modal-header">
              <h2>Cara Dolan (Bermain)</h2>
            </div>
            <div className="modal-body" style={{padding: '30px', fontSize: '1.4rem', color: '#5c240c', lineHeight: '1.6', textAlign: 'left'}}>
              <ol style={{paddingLeft: '20px'}}>
                <li style={{marginBottom: '15px'}}>Klik tombol <strong>MULAI DOLAN</strong> saka halaman utama kanggo mlebu menyang Peta.</li>
                <li style={{marginBottom: '15px'}}>Pilih titik map (candi utawa omah) sing wis mbukak (ora dikunci).</li>
                <li style={{marginBottom: '15px'}}>Tindakake pacelathon (dialog) antarane Bima / Lu Lu karo karakter liyane.</li>
                <li style={{marginBottom: '15px'}}>Pilih wangsulan sing bener miturut aturan unggah-ungguh utawa maca aksara Jawa.</li>
                <li style={{marginBottom: '15px'}}>Kumpulake Bintang emas kanggo mbukak level selanjute lan entuk lencana ing papan Prestasi!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'tim' && (
        <div className="materi-content-overlay" onClick={closeModal}>
          <div className="materi-content-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>X</button>
            <div className="modal-header">
              <h2>Tim Pengembang</h2>
            </div>
            <div className="modal-body" style={{padding: '30px', fontSize: '1.4rem', color: '#5c240c', lineHeight: '1.6'}}>
              <div style={{fontSize: '5rem', marginBottom: '15px', textAlign: 'center'}}>👨‍💻</div>
              <p style={{marginBottom: '10px'}}>Game iki dikembangake kanthi rasa tresna marang budaya Nusantara.</p>
              <p>Terus dukung karya anak bangsa supaya warisan leluhur ora ilang kepangan jaman.</p>
              <br/>
              <p><strong>- Tim Developer CARAKA -</strong></p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
