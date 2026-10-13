import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Materi.css';
import './UnggahUngguh.css';

interface KataBausastra {
  id: number;
  indonesia: string;
  ngoko: string;
  kramaLugu: string;
  kramaInggil: string;
  aturanPenggunaan: string;
  contohKalimat: {
    ngoko: string;
    kramaLugu: string;
    kramaInggil: string;
  };
}

export default function UnggahUngguh() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'semua' | 'pangan' | 'tindakan' | 'awak' | 'panggonan'>('semua');
  const [activeTab, setActiveTab] = useState<'kamus' | 'panduan'>('kamus');

  // Database Kamus Bausastra Jawa Unggah-Ungguh
  const bausastraData: (KataBausastra & { kategori: string })[] = [
    {
      id: 1,
      indonesia: "Makan",
      ngoko: "Mangan / Madang",
      kramaLugu: "Nedha",
      kramaInggil: "Dhahar",
      kategori: "pangan",
      aturanPenggunaan: "⚠️ 'Mangan/Madang' kanggo awake dhewe/kanca sebaya. 'Nedha' kanggo awake dhewe marang wong tuwa. 'Dhahar' KHUSUS kanggo wong tuwa/sesepuh (ora kena nyebut awake dhewe dhahar!).",
      contohKalimat: {
        ngoko: "Aku lagi mangan sega liwet karo Budi.",
        kramaLugu: "Kula sampun nedha kalawau enjang, Simbok.",
        kramaInggil: "Eyang saweg dhahar bubur sumsum ing pendhapi."
      }
    },
    {
      id: 2,
      indonesia: "Minum",
      ngoko: "Ngombe",
      kramaLugu: "Ngunjuk / Nginum",
      kramaInggil: "Ngunjuk",
      kategori: "pangan",
      aturanPenggunaan: "⚠️ 'Ngombe' kanggo awake dhewe/kanca. 'Ngunjuk' digunakake kanggo ngajeni wong sepuh sing lagi ngombe wedang.",
      contohKalimat: {
        ngoko: "Budi ngombe es teh seger banget.",
        kramaLugu: "Kula nginum toya pethak rumiyin nggih Pak.",
        kramaInggil: "Bapak saweg ngunjuk kopi anget ing teras."
      }
    },
    {
      id: 3,
      indonesia: "Tidur",
      ngoko: "Turu",
      kramaLugu: "Tilem",
      kramaInggil: "Sare",
      kategori: "tindakan",
      aturanPenggunaan: "⚠️ Aja nganti kuwalik! 'Tilem' kanggo awake dhewe marang wong tuwa. 'Sare' mung kanggo wong tuwa/guru/sesepuh.",
      contohKalimat: {
        ngoko: "Adhiku wis turu pules ning kamar.",
        kramaLugu: "Kula badhe tilem rumiyin amargi sayah sanget.",
        kramaInggil: "Buyut saweg sare, sampun rame-rame ing ngajeng kamar."
      }
    },
    {
      id: 4,
      indonesia: "Pergi / Berangkat",
      ngoko: "Lunga / Mangkat",
      kramaLugu: "Kesah / Bidhal",
      kramaInggil: "Tindak",
      kategori: "tindakan",
      aturanPenggunaan: "⚠️ 'Kesah/Bidhal' kanggo nyritakake awake dhewe. 'Tindak' mung kanggo wong sing luwih diajeni (ora kena: 'kula badhe tindak').",
      contohKalimat: {
        ngoko: "Aku arep lunga menyang omahe Bayu.",
        kramaLugu: "Kula badhe kesah dhateng sabin ngrencangi Bapak.",
        kramaInggil: "Pak Guru saweg tindak dhateng kantor dinas."
      }
    },
    {
      id: 5,
      indonesia: "Pulang / Kembali",
      ngoko: "Mulih",
      kramaLugu: "Wangsul",
      kramaInggil: "Kondur",
      kategori: "tindakan",
      aturanPenggunaan: "⚠️ 'Wangsul' kanggo nyebut awake dhewe pamit mulih. 'Kondur' kanggo wong tuwa sing wis bali saka makarya utawa bepergian.",
      contohKalimat: {
        ngoko: "Kancaku wis mulih kabeh amarga wis sore.",
        kramaLugu: "Simbok, kepareng kula nyuwun pamit badhe wangsul rumiyin.",
        kramaInggil: "Bapak nembe kemawon kondur saking kantor desa."
      }
    },
    {
      id: 6,
      indonesia: "Melihat",
      ngoko: "Ndeleng / Nonton",
      kramaLugu: "Ningali",
      kramaInggil: "Mriksani / Priksa",
      kategori: "tindakan",
      aturanPenggunaan: "⚠️ 'Ningali' dienggo awake dhewe. 'Mriksani' utawa 'Priksa' kanggo pakurmatan marang sesepuh.",
      contohKalimat: {
        ngoko: "Aku ndeleng wayang kulit ing alun-alun.",
        kramaLugu: "Kula ningali pawartos ing tipi kaliyan Mas Danu.",
        kramaInggil: "Eyang mriksani tanduran kembang ing plataran griya."
      }
    },
    {
      id: 7,
      indonesia: "Bicara / Mengatakan",
      ngoko: "Ngomong / Kandha",
      kramaLugu: "Matur",
      kramaInggil: "Ngendika / Dhawuh",
      kategori: "tindakan",
      aturanPenggunaan: "⚠️ 'Matur' tegese guneman awake dhewe marang wong tuwa (ngandhap). 'Ngendika/Dhawuh' tegese pitutur saka wong tuwa marang awake dhewe.",
      contohKalimat: {
        ngoko: "Budi kandha yen sesuk ana kerja bakti sekolah.",
        kramaLugu: "Kula matur marang Bu Guru babagan tugas basa Jawa.",
        kramaInggil: "Pakdhe ngendika supados lare-lare sami sregep sinau."
      }
    },
    {
      id: 8,
      indonesia: "Rumah",
      ngoko: "Omah",
      kramaLugu: "Griya",
      kramaInggil: "Dalem",
      kategori: "panggonan",
      aturanPenggunaan: "⚠️ Sebut omahmu dhewe nganggo 'Griya'. Sebut omahe wong tuwa/sesepuh nganggo 'Dalem'.",
      contohKalimat: {
        ngoko: "Omahku cedhak karo wit ringin gedhe.",
        kramaLugu: "Mangga mampir dhateng griya kula menawi wonten wekdal.",
        kramaInggil: "Dalemipun Eyang Buyut wonten ing dhusun Ragajimbangan."
      }
    },
    {
      id: 9,
      indonesia: "Mandi",
      ngoko: "Adus",
      kramaLugu: "Adus / Siram",
      kramaInggil: "Siram",
      kategori: "tindakan",
      aturanPenggunaan: "⚠️ 'Siram' kagem sesepuh. Kanggo awake dhewe ing ngarepe wong tuwa kena nganggo 'siram/adus' (madya).",
      contohKalimat: {
        ngoko: "Aku wis adus resik lan seger.",
        kramaLugu: "Kula sampun siram kalawau sonten, Mbok.",
        kramaInggil: "Eyang saweg siram wonten ing jedhing wingking."
      }
    },
    {
      id: 10,
      indonesia: "Kepala",
      ngoko: "Endhas",
      kramaLugu: "Sirah",
      kramaInggil: "Mustaka",
      kategori: "awak",
      aturanPenggunaan: "⚠️ 'Endhas' mung kanggo kewan! Kanggo manungsa minimal nganggo 'Sirah', dene kanggo wong sepuh nganggo 'Mustaka'.",
      contohKalimat: {
        ngoko: "Kucingku ndhase ana loreng-loreng ireng.",
        kramaLugu: "Sirah kula radi puyeng amargi kenging panas.",
        kramaInggil: "Mustakanipun Eyang dipunusapi lenga telon dening Simbok."
      }
    },
    {
      id: 11,
      indonesia: "Tangan",
      ngoko: "Tangan",
      kramaLugu: "Tangan",
      kramaInggil: "Asta",
      kategori: "awak",
      aturanPenggunaan: "⚠️ Nampa barang saka wong tuwa kudu nganggo 'asta tengen' minangka tandha pakurmatan budi pekerti.",
      contohKalimat: {
        ngoko: "Tanganku reget kena lendhut ing kalen.",
        kramaLugu: "Kula ngumbah tangan rumiyin sakderengipun nedha.",
        kramaInggil: "Bima sungkem ngambung astanipun Buyut kanthi bekti."
      }
    },
    {
      id: 12,
      indonesia: "Mata",
      ngoko: "Mripat",
      kramaLugu: "Mripat",
      kramaInggil: "Soca / Paningal",
      kategori: "awak",
      aturanPenggunaan: "⚠️ 'Soca' utawa 'Paningal' minangka krama alus kanggo mripate sesepuh.",
      contohKalimat: {
        ngoko: "Mripatku klilipen bledug ing dalan.",
        kramaLugu: "Mripat kula radi abrit amargi kirang sare.",
        kramaInggil: "Soca panjenenganipun Eyang taksih cetha kangge maos serat."
      }
    }
  ];

  // Filter Data
  const filteredData = bausastraData.filter(item => {
    const matchesCategory = selectedFilter === 'semua' || item.kategori === selectedFilter;
    const matchesSearch = item.indonesia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ngoko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kramaLugu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kramaInggil.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="unggah-page-container">
      {/* Top Header */}
      <div className="unggah-top-bar">
        <button className="btn-back-home" onClick={() => navigate('/materi')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          PUSTAKA
        </button>

        <h1 className="unggah-header-title">BAUSASTRA UNGGAH-UNGGUH</h1>
      </div>

      {/* Mode Tab (Kamus vs Panduan Unggah-Ungguh) */}
      <div className="unggah-tab-container">
        <button 
          className={`unggah-tab-btn ${activeTab === 'kamus' ? 'active' : ''}`}
          onClick={() => setActiveTab('kamus')}
        >
          📖 Kamus Bausastra (Ngoko - Krama)
        </button>
        <button 
          className={`unggah-tab-btn ${activeTab === 'panduan' ? 'active' : ''}`}
          onClick={() => setActiveTab('panduan')}
        >
          💡 Panduan Sinten Kanggo Sinten
        </button>
      </div>

      {/* Main Content Area */}
      <div className="unggah-content-card">
        {activeTab === 'kamus' && (
          <div>
            {/* Search & Filter Bar */}
            <div className="unggah-search-box">
              <input 
                type="text" 
                placeholder="🔍 Cari tembung (misal: mangan, tidur, mulih, tangan)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="unggah-search-input"
              />

              <div className="unggah-filter-pills">
                <button 
                  className={`filter-pill ${selectedFilter === 'semua' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('semua')}
                >
                  Kabeh
                </button>
                <button 
                  className={`filter-pill ${selectedFilter === 'pangan' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('pangan')}
                >
                  Pangan & Ngunjuk
                </button>
                <button 
                  className={`filter-pill ${selectedFilter === 'tindakan' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('tindakan')}
                >
                  Pakaryan & Tindakan
                </button>
                <button 
                  className={`filter-pill ${selectedFilter === 'awak' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('awak')}
                >
                  Perangan Awak
                </button>
                <button 
                  className={`filter-pill ${selectedFilter === 'panggonan' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('panggonan')}
                >
                  Panggonan
                </button>
              </div>
            </div>

            {/* List Kamus Kartu Interaktif */}
            <div className="bausastra-grid">
              {filteredData.map(item => (
                <div key={item.id} className="bausastra-card">
                  <div className="bausastra-header">
                    <span className="bausastra-indo">{item.indonesia}</span>
                    <span className="bausastra-badge">{item.kategori}</span>
                  </div>

                  {/* 3 Tingkatan Basa */}
                  <div className="levels-table">
                    <div className="level-row row-ngoko">
                      <span className="level-tag">Ngoko:</span>
                      <span className="level-val">{item.ngoko}</span>
                      <span className="target-tag">Sebaya / Sedulur</span>
                    </div>

                    <div className="level-row row-krama-lugu">
                      <span className="level-tag">Krama Lugu:</span>
                      <span className="level-val">{item.kramaLugu}</span>
                      <span className="target-tag">Awake Dhewe</span>
                    </div>

                    <div className="level-row row-krama-inggil">
                      <span className="level-tag">Krama Inggil:</span>
                      <span className="level-val">{item.kramaInggil}</span>
                      <span className="target-tag">Wong Tuwa / Sesepuh</span>
                    </div>
                  </div>

                  {/* Aturan Penggunaan */}
                  <div className="rule-box">
                    <p>{item.aturanPenggunaan}</p>
                  </div>

                  {/* Contoh Penggunaan dalam Kalimat */}
                  <div className="examples-box">
                    <div className="example-item">
                      <span className="ex-badge ex-ngoko">Ngoko</span>
                      <span className="ex-text">"{item.contohKalimat.ngoko}"</span>
                    </div>
                    <div className="example-item">
                      <span className="ex-badge ex-lugu">Krama</span>
                      <span className="ex-text">"{item.contohKalimat.kramaLugu}"</span>
                    </div>
                    <div className="example-item">
                      <span className="ex-badge ex-inggil">Inggil</span>
                      <span className="ex-text">"{item.contohKalimat.kramaInggil}"</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#78350f' }}>
                <h3>Ora ana tembung sing cocog karo pencarian "{searchTerm}"</h3>
                <p>Coba goleki nganggo basa Indonesia utawa tembung Jawa liyane.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB PANDUAN UNGGAH-UNGGUH */}
        {activeTab === 'panduan' && (
          <div className="panduan-container">
            <div className="aksara-section-info">
              <h3>Pedoman Basa: Kanggo Sapa Tembung Iki Dienggo?</h3>
              <p>Wong Jawa nengenake subasita lan tata krama. Unggah-ungguh basa diperang dadi pirang-pirang trap-trapan miturut sapa sing diajak guneman:</p>
            </div>

            <div className="panduan-grid">
              <div className="panduan-card card-ngoko">
                <h4>1. Basa Ngoko Lugu</h4>
                <div className="panduan-sub">Kanggo sapa?</div>
                <ul>
                  <li>Kanca sebaya utawa kanca sakelas.</li>
                  <li>Wong tuwa marang anak / putu.</li>
                  <li>Marang awake dhewe ing batin.</li>
                </ul>
                <div className="panduan-contoh">
                  <b>Tuladha:</b> "Kowe wis mangan apa durung le?"
                </div>
              </div>

              <div className="panduan-card card-lugu">
                <h4>2. Basa Krama Lugu / Madya</h4>
                <div className="panduan-sub">Kanggo sapa?</div>
                <ul>
                  <li>Awake dhewe nalika matur marang wong tuwa (nyebut awake dhewe).</li>
                  <li>Wong sing durung pati akrab nanging saumuran.</li>
                  <li>Tembung andhap kanggo ngajeni wong liya tanpa ngunggahake awake dhewe.</li>
                </ul>
                <div className="panduan-contoh">
                  <b>Tuladha:</b> "Kula sampun nedha kalawau enjang."
                </div>
              </div>

              <div className="panduan-card card-inggil">
                <h4>3. Basa Krama Alus / Inggil</h4>
                <div className="panduan-sub">Kanggo sapa?</div>
                <ul>
                  <li>Anak marang wong tuwa (Bapak, Simbok, Eyang, Buyut).</li>
                  <li>Murid marang Pak Guru lan Bu Guru.</li>
                  <li>Warga marang sesepuh, Pak RT, utawa tamu terhormat.</li>
                </ul>
                <div className="panduan-contoh">
                  <b>Tuladha:</b> "Bapak saweg dhahar kaliyan ngunjuk teh."
                </div>
              </div>
            </div>

            {/* Kotak Kesalahan Umum yang Sering Terjadi */}
            <div className="peringatan-box">
              <h4>🚨 KELUPUTAN SING KEREP DILAKONI (HINDARI INI!):</h4>
              <div className="peringatan-item">
                <span className="cross">❌ SALAH:</span> "Kula saweg <b>dhahar</b> bakso."
                <br />
                <span className="check">✔️ BENER:</span> "Kula saweg <b>nedha</b> bakso." (Amarga 'dhahar' mung kanggo wong sepuh, dudu kanggo awake dhewe).
              </div>

              <div className="peringatan-item">
                <span className="cross">❌ SALAH:</span> "Kula badhe <b>tindak</b> sekolah."
                <br />
                <span className="check">✔️ BENER:</span> "Kula badhe <b>bidhal / kesah</b> sekolah." (Amarga 'tindak' mung kanggo wong sepuh).
              </div>

              <div className="peringatan-item">
                <span className="cross">❌ SALAH:</span> "Eyang saweg <b>turu</b> ing kamar."
                <br />
                <span className="check">✔️ BENER:</span> "Eyang saweg <b>sare</b> ing kamar." (Marang sesepuh kudu nganggo Krama Inggil).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
