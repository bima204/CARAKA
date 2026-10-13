import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isTransitioningRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const playAudio = () => {
      const musicOn = localStorage.getItem('musicOn') !== 'false';
      if (!musicOn) return;

      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log("Autoplay dicegah:", err);
        });
      }
    };

    // Matikan musik jika berada di Halaman Awal (sebelum tombol labuh ditekan)
    // ATAU jika sedang berada di dalam level permainan
    const isGameLevel = location.pathname.startsWith('/level');

    if ((location.pathname === '/' && !isTransitioningRef.current) || isGameLevel) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      // Coba mainkan jika di halaman lain (Home, Map, Pengaturan, dll)
      playAudio();
    }

    const forceStartMusic = () => {
      isTransitioningRef.current = true; // Tandai bahwa kita sedang transisi
      playAudio();
    };

    const syncMusicState = () => {
      const musicOn = localStorage.getItem('musicOn') !== 'false';
      if (musicOn && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
      } else if (!musicOn && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('startMusic', forceStartMusic);
    window.addEventListener('syncMusic', syncMusicState);

    return () => {
      window.removeEventListener('startMusic', forceStartMusic);
      window.removeEventListener('syncMusic', syncMusicState);
    };
  }, [isPlaying, location.pathname]);

  return (
    <>
      {/* 
        Catatan: Masukkan file mp3 ke dalam folder public/aset game/ 
        dan ubah src di bawah ini sesuai nama filenya.
      */}
      <audio 
        ref={audioRef} 
        loop 
        src="/aset game/backsound/musik opening.mp3" 
      />
    </>
  );
}
