import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { playGamelanClick } from './utils/sfx';
import Home from './pages/Home';
import Map from './pages/Map';
import MusicPlayer from './components/MusicPlayer';
import LevelAbimanyu from './pages/abimanyu/LevelAbimanyu';
import LevelLulu from './pages/lulu/LevelLulu';
import Materi from './pages/Materi';
import Prestasi from './pages/Prestasi';
import Tentang from './pages/Tentang';
import Pengaturan from './pages/Pengaturan';
import HalamanAwal from './pages/HalamanAwal';
import AksaraJawa from './pages/AksaraJawa';
import UnggahUngguh from './pages/UnggahUngguh';
import BudayaWayang from './pages/BudayaWayang';
import './transitions.css';


// Komponen penengah untuk merutekan ke halaman yang tepat berdasarkan karakter
function LevelRouter() {
  const { character } = useParams();
  
  if (character === 'abimanyu') {
    return <LevelAbimanyu />;
  } else if (character === 'lulu') {
    return <LevelLulu />;
  }
  return <div>Karakter tidak valid</div>;
}

// Wrapper khusus dibuang karena user ingin elemen yang beranimasi, bukan layarnya
function App() {
  // Global click listener untuk SFX kayu pada tombol
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Jika yang diklik adalah tombol, atau punya class tertentu
      if (
        target.closest('button') || 
        target.closest('.btn-menu') || 
        target.closest('.medal-card') || 
        target.closest('.map-icon-container') ||
        target.closest('.stat-box')
      ) {
        playGamelanClick();
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <BrowserRouter>
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<HalamanAwal />} />
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/materi" element={<Materi />} />
        <Route path="/materi/aksara" element={<AksaraJawa />} />
        <Route path="/materi/unggah-ungguh" element={<UnggahUngguh />} />
        <Route path="/materi/budaya" element={<BudayaWayang />} />
        <Route path="/prestasi" element={<Prestasi />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
        <Route path="/level/:character/:id" element={<LevelRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
