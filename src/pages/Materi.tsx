import { useNavigate } from 'react-router-dom';
import './Materi.css';

export default function Materi() {
  const navigate = useNavigate();

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
        "Nuwun sewu! Iki lho babagan materi bahasa, aksara, lan kabudayan Jawa. Ayo sinau bareng Petruk!"
      </div>

      {/* Karakter Petruk dengan Wadah agar bisa beranimasi masuk dan goyang */}
      <div className="petruk-container">
        <img 
          src="/aset game/aset karakter/petruk.png" 
          alt="Petruk" 
          className="petruk-character"
        />
      </div>

      {/* Menu Utama Materi */}
      <div className="materi-menu-container">
        <h1 className="materi-title-text">PUSTAKA</h1>

        <button className="btn-menu btn-utama" onClick={() => navigate('/materi/aksara')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Aksara Jawa</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Sinau Hanacaraka</div>
        </button>

        <button className="btn-menu" onClick={() => navigate('/materi/unggah-ungguh')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Unggah-ungguh Basa</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Bausastra & Tata Krama</div>
        </button>

        <button className="btn-menu" onClick={() => navigate('/materi/budaya')}>
          <div className="btn-title" style={{fontSize: '1.5rem'}}>Budaya & Wayang</div>
          <div className="btn-subtitle" style={{fontSize: '1rem'}}>Paraga & Warisan Luhur</div>
        </button>
      </div>
    </div>
  );
}
