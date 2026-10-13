import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Materi.css';
import './BudayaWayang.css';

interface TokohWayang {
  id: string;
  nama: string;
  gelar: string;
  kategori: 'punokawan' | 'pandhawa' | 'ksatria' | 'warisan';
  foto: string;
  watak: string;
  senjata: string;
  kisah: string;
  piwulang: string;
}

export default function BudayaWayang() {
  const navigate = useNavigate();
  const [selectedKategori, setSelectedKategori] = useState<'kabeh' | 'punokawan' | 'pandhawa' | 'ksatria' | 'warisan'>('kabeh');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokoh, setSelectedTokoh] = useState<TokohWayang | null>(null);

  const wayangData: TokohWayang[] = [
    // --- PUNOKAWAN ---
    {
      id: 'semar',
      nama: 'Kyai Semar Badranaya',
      gelar: 'Lurah Karangdempel / Ismaya',
      kategori: 'punokawan',
      foto: '/aset game/wayang/semar.jpg',
      watak: 'Sabar, wicaksana, asih mring sesama, andhap asor, dadi panuntun para ksatria.',
      senjata: 'Kentut Pusaka (Aji Semar Mesem), Sabda Sakti',
      kisah: 'Semar sejatine titisan dewa yaiku Sang Hyang Ismaya kang mudhun menyang marcapada kanggo ngemong para ksatria kang nengenake bebener. Semar dadi lambang kawula cilik kang nduweni kawicaksanan luhur.',
      piwulang: 'Urip iku kudu eling lan waspada, tansah andhap asor senajan nduweni drajat lan kadigdayan dhuwur.'
    },
    {
      id: 'petruk',
      nama: 'Petruk Kanthong Bolong',
      gelar: 'Punokawan / Duta Bebener',
      kategori: 'punokawan',
      foto: '/aset game/wayang/petruk.jpg',
      watak: 'Grapyak, seneng guyon nanging pinter, kritis, loma (dermawan), lan tansah mbela bebener.',
      senjata: 'Pusaka Kalimasada (nalika jumeneng dadi Ratu Petruk Dadi Ratu)',
      kisah: 'Petruk duwe irung dawa lan awake dhuwur mringis. Jeneng Kanthong Bolong tegese atine resik, ora tau nyimpen rasa drengki lan seneng weweh (loma) marang sapa wae tanpa pamrih.',
      piwulang: 'Aja medit lan aja nggresula. Nyambut gawe kanthi bungah lan ikhlas bakal gawe urip tentrem tentrem ayem.'
    },
    {
      id: 'gareng',
      nama: 'Nala Gareng',
      gelar: 'Pambarep Punokawan',
      kategori: 'punokawan',
      foto: '/aset game/wayang/gareng.jpg',
      watak: 'Waspada, ngati-ati ing saben tindak tanduk, ora gampang kesrimpet hawa nepsu.',
      senjata: 'Cangkem landhep (tembung pitedah)',
      kisah: 'Gareng nduweni dedeg piadeg kang unik: mripate kera (supaya ora mandang barang ala), tangane ceko (ora gelem njupuk hak e wong liya), lan sikile jinjit/pincang (ngati-ati lumaku ing dalan bebener).',
      piwulang: 'Saben kekurangane raga ora ngalangi manungsa kanggo tumindak becik lan ngati-ati ing dalan kauripan.'
    },
    {
      id: 'bagong',
      nama: 'Bagong (Bawor)',
      gelar: 'Wuragil Punokawan',
      kategori: 'punokawan',
      foto: '/aset game/wayang/bagong.jpg',
      watak: 'Jujur, blaka suta (apa anane), wantun ngelawan kezaliman, kritis marang panguwasa.',
      senjata: 'Tembung blaka lan kekuwatan batin',
      kisah: 'Bagong lair saka wewayangane Semar. Dheweke awake lemu bunder, mripate amba, lan yen ngomong ora tau tedheng aling-aling. Senadyan katon konyol, omongane kerep bener lan nusuk rasa.',
      piwulang: 'Kudu wani jujur lan ngendika apa anane marang babagan kang bener, aja mung golek senenge priyayi.'
    },

    // --- PANDHAWA LIMA ---
    {
      id: 'yudhistira',
      nama: 'Prabu Yudhistira (Puntadewa)',
      gelar: 'Ratu ing Amarta / Satriya Getih Putih',
      kategori: 'pandhawa',
      foto: '/aset game/wayang/yudhistira.jpg',
      watak: 'Suci atine, adil paramarta, ora tau goroh (jujur sejati), sabar tanpa wates.',
      senjata: 'Jamus Kalimasada, Panah Kyai Sarotama',
      kisah: 'Puntadewa pambarep Pandhawa kang misuwur getihe putih amarga resik saka rasa sengit. Dheweke ora gelem perang utawa gawe cilakane liyan, tansah nengenake perdamaian.',
      piwulang: 'Keadilan lan kejujuran iku pondhasi utama dadi pimpinan kang ditresnani rakyat.'
    },
    {
      id: 'bima',
      nama: 'Raden Werkudara (Bima)',
      gelar: 'Panenggak Pandhawa / Satriya Jipang',
      kategori: 'pandhawa',
      foto: '/aset game/wayang/bima.jpg',
      watak: 'Gagah prakosa, kendel, jejeg ngadhepi bebener, ora tau basa marang sapa wae kajaba Dewa Ruci.',
      senjata: 'Kuku Pancanaka, Gada Rujakpala, Alugara',
      kisah: 'Werkudara nduweni raga kang gedhe dhuwur lan kasekten tanpa tandhing. Nalika ngupadi banyu suci Perwitasari, dheweke ketemu Dewa Ruci ing telenging samodra lan mangerteni sejatine urip.',
      piwulang: 'Wani mbelani bebener senadyan kudu ngadhepi pepalang ageng; jejeg lakumu aja goyah!'
    },
    {
      id: 'arjuna',
      nama: 'Raden Arjuna (Janaka)',
      gelar: 'Panengah Pandhawa / Satriya Madukara',
      kategori: 'pandhawa',
      foto: '/aset game/wayang/arjuna.jpg',
      watak: 'Bagus rupane, alus budine, trampil jemparingan, tekun tapa brata lan nuntut ngelmu.',
      senjata: 'Panah Pasopati, Keris Pulanggeni, Gandiwa',
      kisah: 'Arjuna minangka panengah Pandhawa kang kondhang dadi satriya paling sakti ing olah jemparing. Dheweke tansah sinau prihatin, meguru marang Resi Drona lan tapa ing Gunung Indrakila.',
      piwulang: 'Katrampilan lan kaluhuran budi kudu diiringi laku tirakat lan tekun sinau tanpa bosen.'
    },

    // --- KSATRIA & TOKOH PENTING ---
    {
      id: 'abimanyu',
      nama: 'Raden Abimanyu (Angkawijaya)',
      gelar: 'Satriya ing Plangkawati',
      kategori: 'ksatria',
      foto: '/aset game/wayang/abimanyu.jpg',
      watak: 'Bagus, prawira, sumringah, bekti mring wong tuwa, setya marang janjine.',
      senjata: 'Keris Pulanggeni, Panah Kyai Wahyutemurun',
      kisah: 'Abimanyu iku putrane Raden Arjuna lan Dewi Subadra. Dheweke pikantuk Wahyu Cakraningrat kang njalari keturunane bakal dadi ratu-ratu agung ing tlatah Jawa (Parikesit).',
      piwulang: 'Satriya enom kudu nduweni jiwa tanggung jawab, bekti marang sesepuh lan luhur bebudene.'
    },

    // --- WARISAN ADILUHUNG ---
    {
      id: 'gunungan',
      nama: 'Gunungan (Kayon)',
      gelar: 'Pralambang Jagad Raya / Urip Sejati',
      kategori: 'warisan',
      foto: '/aset game/wayang/gunungan.jpg',
      watak: 'Nggambarake jagad gumelar, wit panguripan (Pohon Hayat), gapura suci, lan unsu alam.',
      senjata: 'Tandha wiwit lan pungkasan pakeliran wayang',
      kisah: 'Gunungan minangka wujud wayang kang paling wigati. Diputer dening dhalang nalika ganti pathet (wanci) lan nggambarake geni, angin, samodra, alas, lan swarga.',
      piwulang: 'Manungsa kudu njaga kaselarasan antarane Gusti Kang Akarya Jagad, sesama manungsa, lan alam semesta.'
    },
    {
      id: 'gamelan',
      nama: 'Gamelan Jawa',
      gelar: 'Kridha Swara Laras Slendro & Pelog',
      kategori: 'warisan',
      foto: '/aset game/wayang/gamelan.jpg',
      watak: 'Harmonis, tenang, nentremake batin, ngajarake gotong royong.',
      senjata: 'Gong Ageng, Kendhang, Saron, Bonang, Gender, Gambang',
      kisah: 'Gamelan Jawa dudu mung piranti musik biyasa, nanging ngemu filosofi rukun. Saben ricikan nduweni swara beda nanging manunggal gawe irama kang adi luhung.',
      piwulang: 'Bhinneka Tunggal Ika: Bedo-bedo swara lan watak nanging yen diselaraske bakal ngasilake kauripan kang endah.'
    },
    {
      id: 'keris',
      nama: 'Keris Jawa (Tosan Aji)',
      gelar: 'Warisan Donya UNESCO / Curiga',
      kategori: 'warisan',
      foto: '/aset game/wayang/keris.jpg',
      watak: 'Pralambang wibawa, kasantosan batin, pengendalian diri lan drajat manungsa.',
      senjata: 'Bilah wesi pamor meteorit luk utawa lurus kanthi warangka kayu ukir',
      kisah: 'Keris digawe dening Empu kanthi laku pasa lan donga. Pamor keris nglambangake gegayuhan urip lan dadi sipat kandel ksatria Jawa minangka busana pakurmatan.',
      piwulang: 'Kekuwatan lan landhepe gaman kudu diwadhahi ing warangka (budi pekerti kang luhur).'
    },
    {
      id: 'batik',
      nama: 'Batik Tulis Jawa',
      gelar: 'Mahakarya Seni Adiluhung Donya',
      kategori: 'warisan',
      foto: '/aset game/wayang/batik.jpg',
      watak: 'Sabar, teliti, nengenake donga lan filosofi ing saben guratan malam.',
      senjata: 'Canting, Malam (Lilin), Mori, Gawangan',
      kisah: 'Batik Jawa nduweni maneka motif adiluhung kayata Parang Rusak (ora gampang nyerah), Kawung (sucining ati), lan Truntum (tresna kang tumangkar). Saben corak ngemot pitutur luhur para leluhur.',
      piwulang: 'Saben proses urip mbutuhake kasabaran lan katliten supaya ngasilake karya kang migunani kagem liyan.'
    }
  ];

  // Filtering
  const filteredData = wayangData.filter(item => {
    const matchesCat = selectedKategori === 'kabeh' || item.kategori === selectedKategori;
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gelar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.watak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.senjata.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="budaya-page-container">
      {/* Top Header */}
      <div className="budaya-top-bar">
        <button className="btn-back-home" onClick={() => navigate('/materi')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          PUSTAKA
        </button>

        <h1 className="budaya-header-title">BUDAYA & WAYANG JAWA</h1>
      </div>

      {/* Intro Narasi */}
      <div className="budaya-intro-banner">
        <span className="intro-icon">🎭</span>
        <div className="intro-text">
          <h3>Mahakarya Seni & Budi Pekerti Leluhur</h3>
          <p>Sinau ngenani paraga wayang purwa, watak ksatria, lan warisan adiluhung kabudayan Jawa kang ngandhut pitutur batin kanggo nggayuh urip kang utama.</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="budaya-controls-box">
        <div className="budaya-tabs">
          <button 
            className={`budaya-tab-btn ${selectedKategori === 'kabeh' ? 'active' : ''}`}
            onClick={() => setSelectedKategori('kabeh')}
          >
            Kabeh Warisan
          </button>
          <button 
            className={`budaya-tab-btn ${selectedKategori === 'punokawan' ? 'active' : ''}`}
            onClick={() => setSelectedKategori('punokawan')}
          >
            🌟 Punokawan
          </button>
          <button 
            className={`budaya-tab-btn ${selectedKategori === 'pandhawa' ? 'active' : ''}`}
            onClick={() => setSelectedKategori('pandhawa')}
          >
            ⚔️ Pandhawa Lima
          </button>
          <button 
            className={`budaya-tab-btn ${selectedKategori === 'ksatria' ? 'active' : ''}`}
            onClick={() => setSelectedKategori('ksatria')}
          >
            🏹 Satriya Utama
          </button>
          <button 
            className={`budaya-tab-btn ${selectedKategori === 'warisan' ? 'active' : ''}`}
            onClick={() => setSelectedKategori('warisan')}
          >
            🏺 Warisan Adiluhung
          </button>
        </div>

        <div className="budaya-search-wrap">
          <input 
            type="text" 
            placeholder="🔍 Goleki jeneng tokoh, gaman, utawa watak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="budaya-search-input"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="budaya-grid">
        {filteredData.map(tokoh => (
          <div 
            key={tokoh.id} 
            className="tokoh-card"
            onClick={() => setSelectedTokoh(tokoh)}
          >
            <div className="tokoh-img-wrapper">
              <img src={tokoh.foto} alt={tokoh.nama} className="tokoh-img" />
              <div className="tokoh-category-badge">{tokoh.kategori}</div>
            </div>

            <div className="tokoh-info">
              <h3 className="tokoh-nama">{tokoh.nama}</h3>
              <p className="tokoh-gelar">{tokoh.gelar}</p>

              <div className="tokoh-summary-box">
                <div className="info-row">
                  <span className="info-icon">💎</span>
                  <span className="info-text"><b>Watak:</b> {tokoh.watak}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">⚔️</span>
                  <span className="info-text"><b>Gaman/Ciri:</b> {tokoh.senjata}</span>
                </div>
              </div>

              <button className="btn-detail-tokoh">
                Waca Carita & Piwulang ➔
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="budaya-empty-state">
          <h3>Ora ana data wayang utawa budaya sing cocog karo "{searchQuery}"</h3>
          <p>Coba goleki nganggo tembung kunci liyane.</p>
        </div>
      )}

      {/* MODAL POPUP DETAIL CERITA & FILOSOFI */}
      {selectedTokoh && (
        <div className="budaya-modal-overlay" onClick={() => setSelectedTokoh(null)}>
          <div className="budaya-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="budaya-close-btn" onClick={() => setSelectedTokoh(null)}>✕</button>

            <div className="modal-left-col">
              <div className="modal-img-frame">
                <img src={selectedTokoh.foto} alt={selectedTokoh.nama} className="modal-img" />
              </div>
              <div className="modal-tag-pill">{selectedTokoh.gelar}</div>
            </div>

            <div className="modal-right-col">
              <h2 className="modal-tokoh-title">{selectedTokoh.nama}</h2>

              <div className="modal-section">
                <h4>✨ Watak & Bebudene:</h4>
                <p>{selectedTokoh.watak}</p>
              </div>

              <div className="modal-section">
                <h4>⚔️ Gaman / Pusaka / Ciri Wigati:</h4>
                <p>{selectedTokoh.senjata}</p>
              </div>

              <div className="modal-section">
                <h4>📜 Kisah & Asal-usul:</h4>
                <p>{selectedTokoh.kisah}</p>
              </div>

              <div className="modal-piwulang-box">
                <h4>💡 Piwulang Luhur Budi Pekerti:</h4>
                <p>"{selectedTokoh.piwulang}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
