import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Materi.css'; // Tetap pakai UI seragam

export default function Pengaturan() {
  const navigate = useNavigate();
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

  const handleReset = () => {
    const confirm = window.confirm("Apa kowe yakin arep mbusak kabeh data dolanan? (Bintang lan level sing mbukak bakal ilang)");
    if (confirm) {
      alert("Data kasil dibusak! Ayo mulai petualangan saka awal.");
      // Di masa depan, panggil logika hapus localStorage di sini
    }
  };

  return (
    <div className="materi-page-container">
      <button className="btn-back-home" onClick={() => navigate('/home')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        MBALIK
      </button>

      {/* Balon Kata Petruk */}
      <div className="petruk-speech-bubble">
        "Neng kene kowe bisa ngatur swara utawa mbusak data dolanan yen pengin mbaleni saka awal."
      </div>

      {/* Karakter Petruk */}
      <div className="petruk-container">
        <img 
          src="/aset game/aset karakter/petruk.png" 
          alt="Petruk" 
          className="petruk-character"
        />
      </div>

      {/* Papan Pengaturan */}
      <div className="materi-menu-container">
        <h1 className="materi-title-text" style={{fontSize: '3rem'}}>PENGATURAN</h1>

        <button className="btn-menu btn-utama" onClick={toggleMusic}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Musik Latar (BGM): {musicOn ? 'MURUP 🎵' : 'MATI 🔇'}</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Gamelan lan lagu opening</div>
        </button>

        {/* Toggle SFX */}
        <button className="btn-menu" onClick={toggleSfx}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Efek Suara (SFX): {sfxOn ? 'MURUP 🔊' : 'MATI 🔈'}</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Suara tombol lan pop-up</div>
        </button>

        {/* Tombol Hapus Data */}
        <button className="btn-menu" onClick={handleReset} style={{border: '4px solid #b71c1c', marginTop: '20px'}}>
          <div className="btn-title" style={{fontSize: '1.5rem', color: '#ffcdd2'}}>Mulai Anyar (Reset) ⚠️</div>
          <div className="btn-subtitle" style={{color: '#ff8a80', fontSize: '1rem'}}>Busak kabeh bintang lan kemajuan</div>
        </button>
      </div>

    </div>
  );
}
