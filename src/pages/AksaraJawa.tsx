import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Materi.css';
import './AksaraJawa.css';

export default function AksaraJawa() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'legena' | 'pasangan' | 'sandhangan'>('legena');

  // 1. Data Aksara Nglegena (20 Aksara Dasar)
  const aksaraLegena = [
    { char: 'ꦲ', name: 'Ha', desc: 'Hana caraka' },
    { char: 'ꦤ', name: 'Na', desc: 'Ada utusan' },
    { char: 'ꦕ', name: 'Ca', desc: 'Duta dalem' },
    { char: 'ꦫ', name: 'Ra', desc: 'Kang dipercaya' },
    { char: 'ꦏ', name: 'Ka', desc: 'Kautaman' },

    { char: 'ꦢ', name: 'Da', desc: 'Data sawala' },
    { char: 'ꦠ', name: 'Ta', desc: 'Padha padu' },
    { char: 'ꦱ', name: 'Sa', desc: 'Tukaran' },
    { char: 'ꦮ', name: 'Wa', desc: 'Ora ana' },
    { char: 'ꦭ', name: 'La', desc: 'Sing ngalah' },

    { char: 'ꦥ', name: 'Pa', desc: 'Padha jayanya' },
    { char: 'ꦝ', name: 'Dha', desc: 'Padha sektine' },
    { char: 'ꦗ', name: 'Ja', desc: 'Kekuwatan' },
    { char: 'ꦪ', name: 'Ya', desc: 'Ora luntur' },
    { char: 'ꦚ', name: 'Nya', desc: 'Teguh atine' },

    { char: 'ꦩ', name: 'Ma', desc: 'Maga bathanga' },
    { char: 'ꦒ', name: 'Ga', desc: 'Wekasane' },
    { char: 'ꦧ', name: 'Ba', desc: 'Dadi bathang' },
    { char: 'ꦛ', name: 'Tha', desc: 'Kekalihe' },
    { char: 'ꦔ', name: 'Nga', desc: 'Sirna padha' },
  ];

  // 2. Data Pasangan Aksara Jawa (20 Pasangan)
  const pasanganList = [
    { char: 'ꦏ꧀ꦲ', induk: 'ꦲ', name: 'Pasangan Ha', letak: 'Sajajar (Tengen)', contoh: 'Wong kuwi (ꦮꦺꦴꦁ꧀ꦲꦶꦏꦸ)' },
    { char: 'ꦏ꧀ꦤ', induk: 'ꦤ', name: 'Pasangan Na', letak: 'Ngandhap (Ngisor)', contoh: 'Mangan nanas (ꦩꦔꦤ꧀ꦤꦤꦱ꧀)' },
    { char: 'ꦏ꧀ꦕ', induk: 'ꦕ', name: 'Pasangan Ca', letak: 'Ngandhap (Ngisor)', contoh: 'Pitik cilik (ꦥꦶꦠꦶꦏ꧀ꦕꦶꦭꦶꦏ꧀)' },
    { char: 'ꦏ꧀ꦫ', induk: 'ꦫ', name: 'Pasangan Ra', letak: 'Ngandhap (Wutuh)', contoh: 'Bapak rawuh (ꦧꦥꦏ꧀ꦫꦮꦸꦃ)' },
    { char: 'ꦏ꧀ꦏ', induk: 'ꦏ', name: 'Pasangan Ka', letak: 'Ngandhap (Ngisor)', contoh: 'Gajah kurus (ꦒꦗꦃ꧀ꦏꦸꦫꦸꦱ꧀)' },

    { char: 'ꦏ꧀ꦢ', induk: 'ꦢ', name: 'Pasangan Da', letak: 'Ngandhap (Ngisor)', contoh: 'Anak dara (ꦲꦤꦏ꧀ꦢꦫ)' },
    { char: 'ꦏ꧀ꦠ', induk: 'ꦠ', name: 'Pasangan Ta', letak: 'Ngandhap (Ngisor)', contoh: 'Bapak tindak (ꦧꦥꦏ꧀ꦠꦶꦤ꧀ꦢꦏ꧀)' },
    { char: 'ꦏ꧀ꦱ', induk: 'ꦱ', name: 'Pasangan Sa', letak: 'Sajajar (Tengen)', contoh: 'Mangan sega (ꦩꦔꦤ꧀ꦱꦼꦒ)' },
    { char: 'ꦏ꧀ꦮ', induk: 'ꦮ', name: 'Pasangan Wa', letak: 'Ngandhap (Ngisor)', contoh: 'Iwak wadhang (ꦲꦶꦮꦏ꧀ꦮꦝꦁ)' },
    { char: 'ꦏ꧀ꦭ', induk: 'ꦭ', name: 'Pasangan La', letak: 'Ngandhap (Ngisor)', contoh: 'Bocah lara (ꦧꦺꦴꦕꦃ꧀ꦭꦫ)' },

    { char: 'ꦏ꧀ꦥ', induk: 'ꦥ', name: 'Pasangan Pa', letak: 'Sajajar (Tengen)', contoh: 'Anak pinter (ꦲꦤꦏ꧀ꦥꦶꦤ꧀ꦠꦼꦂ)' },
    { char: 'ꦏ꧀ꦝ', induk: 'ꦝ', name: 'Pasangan Dha', letak: 'Ngandhap (Ngisor)', contoh: 'Menthok dhedhe (ꦩꦼꦤ꧀ꦛꦺꦴꦏ꧀ꦝꦺꦝꦺ)' },
    { char: 'ꦏ꧀ꦗ', induk: 'ꦗ', name: 'Pasangan Ja', letak: 'Ngandhap (Ngisor)', contoh: 'Numpak jaran (ꦤꦸꦩ꧀ꦥꦏ꧀ꦗꦫꦤ꧀)' },
    { char: 'ꦏ꧀ꦪ', induk: 'ꦪ', name: 'Pasangan Ya', letak: 'Ngandhap (Wutuh)', contoh: 'Bapak yakin (ꦧꦥꦏ꧀ꦪꦏꦶꦤ꧀)' },
    { char: 'ꦏ꧀ꦚ', induk: 'ꦚ', name: 'Pasangan Nya', letak: 'Ngandhap (Ngisor)', contoh: 'Golek nyawa (ꦒꦺꦴꦭꦺꦏ꧀ꦚꦮ)' },

    { char: 'ꦏ꧀ꦩ', induk: 'ꦩ', name: 'Pasangan Ma', letak: 'Ngandhap (Ngisor)', contoh: 'Kembang mlathi (ꦏꦼꦩ꧀ꦧꦁ꧀ꦩ꧀ꦭꦛꦶ)' },
    { char: 'ꦏ꧀ꦒ', induk: 'ꦒ', name: 'Pasangan Ga', letak: 'Ngandhap (Wutuh)', contoh: 'Bocah gagah (ꦧꦺꦴꦕꦃ꧀ꦒꦒꦃ)' },
    { char: 'ꦏ꧀ꦧ', induk: 'ꦧ', name: 'Pasangan Ba', letak: 'Ngandhap (Ngisor)', contoh: 'Gajah bengkak (ꦒꦗꦃ꧀ꦧꦼꦁꦏꦏ꧀)' },
    { char: 'ꦏ꧀ꦛ', induk: 'ꦛ', name: 'Pasangan Tha', letak: 'Ngandhap (Ngisor)', contoh: 'Jamu thowok (ꦗꦩꦸ꧀ꦛꦺꦴꦮꦺꦴꦏ꧀)' },
    { char: 'ꦏ꧀ꦔ', induk: 'ꦔ', name: 'Pasangan Nga', letak: 'Ngandhap (Wutuh)', contoh: 'Laler ngresek (ꦭꦭꦼꦂ꧀ꦔꦿꦼꦱꦼꦏ꧀)' },
  ];

  // 3. Data Sandhangan (Swara, Panyigeg, Wyanjana)
  const sandhanganGroups = [
    {
      kategori: 'Sandhangan Swara (Vokal)',
      items: [
        { nama: 'Wulu', aksara: 'ꦏꦶ', unine: 'i (ki)', tuladha: 'Siti (ꦱꦶꦠꦶ)' },
        { nama: 'Suku', aksara: 'ꦏꦸ', unine: 'u (ku)', tuladha: 'Buku (ꦧꦸꦏꦸ)' },
        { nama: 'Pepet', aksara: 'ꦏꦼ', unine: 'e (ke)', tuladha: 'Sega (ꦱꦼꦒ)' },
        { nama: 'Taling', aksara: 'ꦏꦺ', unine: 'é (ké)', tuladha: 'Sate (ꦱꦠꦺ)' },
        { nama: 'Taling-Tarung', aksara: 'ꦏꦺꦴ', unine: 'o (ko)', tuladha: 'Toko (ꦠꦺꦴꦏꦺꦴ)' },
      ]
    },
    {
      kategori: 'Sandhangan Panyigeg Wanda (Konsonan Akhir)',
      items: [
        { nama: 'Wignyan', aksara: 'ꦏꦃ', unine: '-h (kah)', tuladha: 'Gajah (ꦒꦗꦃ)' },
        { nama: 'Layar', aksara: 'ꦏꦂ', unine: '-r (kar)', tuladha: 'Pasar (ꦥꦱꦂ)' },
        { nama: 'Cecak', aksara: 'ꦏꦁ', unine: '-ng (kang)', tuladha: 'Wayang (ꦮꦪꦁ)' },
        { nama: 'Pangkon / Paten', aksara: 'ꦏ꧀', unine: 'Mateni aksara (k)', tuladha: 'Bapak (ꦧꦥꦏ꧀)' },
      ]
    },
    {
      kategori: 'Sandhangan Wyanjana (Sisipan)',
      items: [
        { nama: 'Cakra', aksara: 'ꦏꦿ', unine: '+ra (kra)', tuladha: 'Krasa (ꦏꦿꦱ)' },
        { nama: 'Keret', aksara: 'ꦏꦽ', unine: '+re pepet (kre)', tuladha: 'Kreta (ꦏꦽꦠ)' },
        { nama: 'Pengkal', aksara: 'ꦏꦾ', unine: '+ya (kya)', tuladha: 'Kyai (ꦏꦾꦲꦶ)' },
      ]
    }
  ];

  return (
    <div className="aksara-page-container">
      {/* Top Navigation */}
      <div className="aksara-top-bar">
        <button className="btn-back-home" onClick={() => navigate('/materi')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          PUSTAKA
        </button>

        <h1 className="aksara-header-title">PAWON AKSARA JAWA</h1>
      </div>

      {/* Tab Navigation Pill */}
      <div className="aksara-tab-container">
        <button 
          className={`aksara-tab-btn ${activeTab === 'legena' ? 'active' : ''}`}
          onClick={() => setActiveTab('legena')}
        >
          Aksara Nglegena (20)
        </button>
        <button 
          className={`aksara-tab-btn ${activeTab === 'pasangan' ? 'active' : ''}`}
          onClick={() => setActiveTab('pasangan')}
        >
          Pasangan Aksara (20)
        </button>
        <button 
          className={`aksara-tab-btn ${activeTab === 'sandhangan' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandhangan')}
        >
          Sandhangan Jangkep
        </button>
      </div>

      {/* Main Content Area */}
      <div className="aksara-content-card">
        {/* TAB 1: AKSARA NGLEGENA */}
        {activeTab === 'legena' && (
          <div>
            <div className="aksara-section-info">
              <h3>ꦲꦤꦕꦫꦏ - Aksara Nglegena (Aksara Baku)</h3>
              <p>Aksara nglegena yaiku aksara dhasar ing carakan Jawa sing durung diwenehi sandhangan utawa pasangan, kabeh muni vokal 'a'.</p>
            </div>
            
            <div className="aksara-grid-modern">
              {aksaraLegena.map((item, index) => (
                <div key={index} className="aksara-card-modern">
                  <div className="aksara-symbol">{item.char}</div>
                  <div className="aksara-label">{item.name}</div>
                  <div className="aksara-hint">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PASANGAN AKSARA */}
        {activeTab === 'pasangan' && (
          <div>
            <div className="aksara-section-info">
              <h3>꧀ꦲ ꧀ꦤ ꧀ꦕ ꧀ꦫ ꧀ꦏ - Pasangan Aksara Jawa</h3>
              <p>Pasangan gunane kanggo <b>mateni (ngilangake swara vokal)</b> aksara sigeg sadurunge ing tengahing tembung utawa ukara.</p>
            </div>

            <div className="table-responsive-box">
              <table className="aksara-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Aksara Induk</th>
                    <th>Wujud Pasangan</th>
                    <th>Jeneng</th>
                    <th>Panggonan Panyeratan</th>
                    <th>Tuladha Panyeratan</th>
                  </tr>
                </thead>
                <tbody>
                  {pasanganList.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 'bold' }}>{idx + 1}</td>
                      <td className="table-char-primary">{p.induk}</td>
                      <td className="table-char-accent">{p.char}</td>
                      <td style={{ fontWeight: '700' }}>{p.name}</td>
                      <td>
                        <span className={`badge-letak ${p.letak.includes('Tengen') ? 'badge-tengen' : 'badge-ngisor'}`}>
                          {p.letak}
                        </span>
                      </td>
                      <td className="table-contoh">{p.contoh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SANDHANGAN */}
        {activeTab === 'sandhangan' && (
          <div>
            <div className="aksara-section-info">
              <h3>Sandhangan Aksara Jawa</h3>
              <p>Sandhangan yaiku tandha diakritik kanggo ngowahi utawa nambah swara vokal lan konsonan ing aksara Jawa.</p>
            </div>

            {sandhanganGroups.map((group, gIdx) => (
              <div key={gIdx} className="sandhangan-group-box">
                <h4 className="sandhangan-group-title">{group.kategori}</h4>
                <div className="sandhangan-grid">
                  {group.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="sandhangan-card">
                      <div className="sandhangan-char">{item.aksara}</div>
                      <div className="sandhangan-name">{item.nama}</div>
                      <div className="sandhangan-sound">Uni: <b>{item.unine}</b></div>
                      <div className="sandhangan-example">Tuladha: {item.tuladha}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
