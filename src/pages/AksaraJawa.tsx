import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toJavanese } from 'carakanjs';
import { playGamelanClick, playCorrectChime, playTetotSound } from '../utils/sfx';
import './Materi.css';
import './AksaraJawa.css';

interface AksaraItem {
  char: string;
  name: string;
  desc: string;
  makna?: string;
  tuladha?: string;
}

interface KalimatPanjangItem {
  judul: string;
  tingkat: 'Gampil' | 'Sedheng' | 'Utama';
  latin: string;
  aksara: string;
  teges: string;
  bedhahan: string;
}

interface KuisKetikItem {
  id: number;
  level: 'dasar' | 'sedang' | 'mahir';
  tipe: 'kata_dasar' | 'kalimat' | 'paribasan';
  aksaraSoal: string;
  petunjuk: string;
  kunciLatin: string[]; // Variasi ejaan yang diterima
  teges: string;
}

interface PasanganItem {
  char: string;
  induk: string;
  name: string;
  letak: string;
  contoh: string;
  katrangan?: string;
}

interface SandhanganItem {
  nama: string;
  aksara: string;
  unine: string;
  tuladha: string;
  kategori: string;
  panggonan?: string;
  kegunaan?: string;
}

export default function AksaraJawa() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'legena' | 'lagu' | 'pasangan' | 'sandhangan' | 'ukara' | 'cerita' | 'studio' | 'kuis'>('legena');
  const [selectedAksara, setSelectedAksara] = useState<AksaraItem | null>(null);
  const [selectedPasangan, setSelectedPasangan] = useState<PasanganItem | null>(null);
  const [selectedSandhangan, setSelectedSandhangan] = useState<SandhanganItem | null>(null);

  // State untuk Tab Studio Pembuat Aksara
  const [studioInput, setStudioInput] = useState('bapak pucung');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // State untuk Tab Kuis Ketik Berlevel
  const [kuisLevel, setKuisLevel] = useState<'dasar' | 'sedang' | 'mahir'>('dasar');
  const [kuisIndex, setKuisIndex] = useState(0);
  const [kuisInput, setKuisInput] = useState('');
  const [kuisStatus, setKuisStatus] = useState<'idle' | 'bener' | 'salah'>('idle');
  const [kuisSkor, setKuisSkor] = useState(0);
  const [tampilPetunjuk, setTampilPetunjuk] = useState(false);
  const [tampilJawaban, setTampilJawaban] = useState(false);

  // 1. Data Aksara Nglegena (20 Aksara Dasar)
  const aksaraLegena: AksaraItem[] = [
    // Larikan 1: Ha-Na-Ca-Ra-Ka (Hana caraka: Ana utusan / utusan urip)
    { char: 'ꦲ', name: 'Ha', desc: 'Hana caraka', makna: 'Hurip / Hananing Cipta (Wujud urip lan napas)', tuladha: 'Hawa (ꦲꦮ), Hati (ꦲꦠꦶ)' },
    { char: 'ꦤ', name: 'Na', desc: 'Hana caraka', makna: 'Nglegena (Polos, wening, lan tanpa pamrih)', tuladha: 'Nata (ꦤꦠ), Nanas (ꦤꦤꦱ꧀)' },
    { char: 'ꦕ', name: 'Ca', desc: 'Hana caraka', makna: 'Cipta (Daya panyipta lan nalar budi pakerti)', tuladha: 'Cara (ꦕꦫ), Candi (ꦕꦤ꧀ꦢꦶ)' },
    { char: 'ꦫ', name: 'Ra', desc: 'Hana caraka', makna: 'Rasa (Pangrasa sejati ing sajroning batin)', tuladha: 'Rasa (ꦫꦱ), Raja (ꦫꦗ)' },
    { char: 'ꦏ', name: 'Ka', desc: 'Hana caraka', makna: 'Karsa (Kekarepan lan tekad kang manunggal)', tuladha: 'Kaca (ꦏꦕ), Kayu (ꦏꦪꦸ)' },

    // Larikan 2: Da-Ta-Sa-Wa-La (Data sawala: Padha padu / pasulayan)
    { char: 'ꦢ', name: 'Da', desc: 'Data sawala', makna: 'Dzat (Zat kang Maha Kuwasa / Datan sawala)', tuladha: 'Dalan (ꦢꦭꦤ꧀), Dawa (ꦢꦮ)' },
    { char: 'ꦠ', name: 'Ta', desc: 'Data sawala', makna: 'Tatas (Kukuh, tuntas, lan mantep ing ancas)', tuladha: 'Tapa (ꦠꦥ), Tuku (ꦠꦸꦏꦸ)' },
    { char: 'ꦱ', name: 'Sa', desc: 'Data sawala', makna: 'Sifat (Watak tansah eling, waspada, lan santosa)', tuladha: 'Sega (ꦱꦼꦒ), Sapu (ꦱꦥꦸ)' },
    { char: 'ꦮ', name: 'Wa', desc: 'Data sawala', makna: 'Wujud (Kahanan lair lan tumindak nyata)', tuladha: 'Watu (ꦮꦠꦸ), Waca (ꦮꦕ)' },
    { char: 'ꦭ', name: 'La', desc: 'Data sawala', makna: 'Lirih / Lembah Manah (Ngedohi lali lan sifat gumede)', tuladha: 'Lara (ꦭꦫ), Lenga (ꦭꦼꦔ)' },

    // Larikan 3: Pa-Dha-Ja-Ya-Nya (Padha jayanya: Padha sektine / kekuatane)
    { char: 'ꦥ', name: 'Pa', desc: 'Padha jayanya', makna: 'Papan (Panggonan, nglenggana mapanake dhiri)', tuladha: 'Pari (ꦥꦫꦶ), Pasar (ꦥꦱꦂ)' },
    { char: 'ꦝ', name: 'Dha', desc: 'Padha jayanya', makna: 'Dhuwur (Nggayuh drajat lan budi luhur)', tuladha: 'Dhahar (ꦝꦲꦂ), Dhadha (ꦝꦝ)' },
    { char: 'ꦗ', name: 'Ja', desc: 'Padha jayanya', makna: 'Jumbuhing Lair Batin (Kekuwatan sejati)', tuladha: 'Jaran (ꦗꦫꦤ꧀), Jamu (ꦗꦩꦸ)' },
    { char: 'ꦪ', name: 'Ya', desc: 'Padha jayanya', makna: 'Yakin (Manteb marang panguwasaning Gusti)', tuladha: 'Yuyu (ꦪꦸꦪꦸ), Yata (ꦪꦠ)' },
    { char: 'ꦚ', name: 'Nya', desc: 'Padha jayanya', makna: 'Nyawiji (Manunggal ing katresnan lan rukun)', tuladha: 'Nyawa (ꦚꦮ), Nyata (ꦚꦠ)' },

    // Larikan 4: Ma-Ga-Ba-Tha-Nga (Maga bathanga: Padha dadi bathang / ajal)
    { char: 'ꦩ', name: 'Ma', desc: 'Maga bathanga', makna: 'Madhep Mantep (Madhep marang Sang Hyang Widhi)', tuladha: 'Mata (ꦩꦠ), Madu (ꦩꦢꦸ)' },
    { char: 'ꦒ', name: 'Ga', desc: 'Maga bathanga', makna: 'Guru Sejati (Gusti Kang Murbeng Dumadi)', tuladha: 'Gajah (ꦒꦗꦃ), Gula (ꦒꦸꦭ)' },
    { char: 'ꦧ', name: 'Ba', desc: 'Maga bathanga', makna: 'Bayu (Napas pungkasan, bebener kudu diugemi)', tuladha: 'Bata (ꦧꦠ), Bapak (ꦧꦥꦏ꧀)' },
    { char: 'ꦛ', name: 'Tha', desc: 'Maga bathanga', makna: 'Thukul (Tukuling welas asih lan kasampurnan)', tuladha: 'Thole (ꦛꦺꦴꦭꦺ), Thukuk (ꦛꦸꦏꦸꦏ꧀)' },
    { char: 'ꦔ', name: 'Nga', desc: 'Maga bathanga', makna: 'Nglangut / Suwung (Kautaman pungkasan, bali menyang Gusti)', tuladha: 'Ngadeg (ꦔꦢꦼꦒ꧀), Ngombe (ꦔꦺꦴꦩ꧀ꦧꦺ)' },
  ];

  // 2. Data Pasangan Aksara Jawa (20 Pasangan)
  const pasanganList: PasanganItem[] = [
    { 
      char: 'ꦏ꧀ꦲ', 
      induk: 'ꦲ', 
      name: 'Pasangan Ha', 
      letak: 'Sajajar (Tengen)', 
      contoh: 'Wong kuwi (ꦮꦺꦴꦁ꧀ꦲꦶꦏꦸ)',
      katrangan: 'Kaserat sajajar ing sisih tengen aksara kang dipateni. Wujudipun sami persis kados aksara Ha carakan.'
    },
    { 
      char: 'ꦏ꧀ꦤ', 
      induk: 'ꦤ', 
      name: 'Pasangan Na', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Mangan nanas (ꦩꦔꦤ꧀ꦤꦤꦱ꧀)',
      katrangan: 'Kaserat gumantung ing sangandhaping aksara sigeg. Wujudipun kados huruf Na ingkang pedhot sisih kiwa.'
    },
    { 
      char: 'ꦏ꧀ꦕ', 
      induk: 'ꦕ', 
      name: 'Pasangan Ca', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Pitik cilik (ꦥꦶꦠꦶꦏ꧀ꦕꦶꦭꦶꦏ꧀)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg. Wujudipun kados huruf Ca kanthi garis panyambung munggah.'
    },
    { 
      char: 'ꦏ꧀ꦫ', 
      induk: 'ꦫ', 
      name: 'Pasangan Ra', 
      letak: 'Ngandhap (Wutuh)', 
      contoh: 'Bapak rawuh (ꦧꦥꦏ꧀ꦫꦮꦸꦃ)',
      katrangan: 'Wujudipun wutuh sami kaliyan aksara Ra, nanging dipunserat wonten ing ngandhap aksara kang dipateni.'
    },
    { 
      char: 'ꦏ꧀ꦏ', 
      induk: 'ꦏ', 
      name: 'Pasangan Ka', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Gajah kurus (ꦒꦗꦃ꧀ꦏꦸꦫꦸꦱ꧀)',
      katrangan: 'Kaserat ing ngandhap, wujudipun ngalami owah-owahan kados tumpukan lekuk aksara Ka.'
    },
    { 
      char: 'ꦏ꧀ꦢ', 
      induk: 'ꦢ', 
      name: 'Pasangan Da', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Anak dara (ꦲꦤꦏ꧀ꦢꦫ)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg kangge mateni swanten aksara sadurunge.'
    },
    { 
      char: 'ꦏ꧀ꦠ', 
      induk: 'ꦠ', 
      name: 'Pasangan Ta', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Bapak tindak (ꦧꦥꦏ꧀ꦠꦶꦤ꧀ꦢꦏ꧀)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg, kados wujud aksara Ta alit.'
    },
    { 
      char: 'ꦏ꧀ꦱ', 
      induk: 'ꦱ', 
      name: 'Pasangan Sa', 
      letak: 'Sajajar (Tengen)', 
      contoh: 'Mangan sega (ꦩꦔꦤ꧀ꦱꦼꦒ)',
      katrangan: 'Kaserat sajajar ing sisih tengenipun aksara sigeg. Wujudipun wutuh kados aksara Sa carakan.'
    },
    { 
      char: 'ꦏ꧀ꦮ', 
      induk: 'ꦮ', 
      name: 'Pasangan Wa', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Iwak wadhang (ꦲꦶꦮꦏ꧀ꦮꦝꦁ)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg kanthi wujud Wa ingkang wutuh.'
    },
    { 
      char: 'ꦏ꧀ꦭ', 
      induk: 'ꦭ', 
      name: 'Pasangan La', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Bocah lara (ꦧꦺꦴꦕꦃ꧀ꦭꦫ)',
      katrangan: 'Kaserat ing sangandhaping aksara ingkang dipunpejahi.'
    },
    { 
      char: 'ꦏ꧀ꦥ', 
      induk: 'ꦥ', 
      name: 'Pasangan Pa', 
      letak: 'Sajajar (Tengen)', 
      contoh: 'Anak pinter (ꦲꦤꦏ꧀ꦥꦶꦤ꧀ꦠꦼꦂ)',
      katrangan: 'Kaserat sajajar ing sisih tengen aksara sigeg. Wujudipun wutuh kados aksara Pa carakan.'
    },
    { 
      char: 'ꦏ꧀ꦝ', 
      induk: 'ꦝ', 
      name: 'Pasangan Dha', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Menthok dhedhe (ꦩꦼꦤ꧀ꦛꦺꦴꦏ꧀ꦝꦺꦝꦺ)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg kangge swanten retrofleks Dha.'
    },
    { 
      char: 'ꦏ꧀ꦗ', 
      induk: 'ꦗ', 
      name: 'Pasangan Ja', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Numpak jaran (ꦤꦸꦩ꧀ꦥꦏ꧀ꦗꦫꦤ꧀)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg kanthi garis mirip huruf R.'
    },
    { 
      char: 'ꦏ꧀ꦪ', 
      induk: 'ꦪ', 
      name: 'Pasangan Ya', 
      letak: 'Ngandhap (Wutuh)', 
      contoh: 'Bapak yakin (ꦧꦥꦏ꧀ꦪꦏꦶꦤ꧀)',
      katrangan: 'Wujudipun wutuh kados aksara Ya, nanging panyeratanipun manggen ing ngandhap.'
    },
    { 
      char: 'ꦏ꧀ꦚ', 
      induk: 'ꦚ', 
      name: 'Pasangan Nya', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Golek nyawa (ꦒꦺꦴꦭꦺꦏ꧀ꦚꦮ)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg kanthi sikil kalih lan payung.'
    },
    { 
      char: 'ꦏ꧀ꦩ', 
      induk: 'ꦩ', 
      name: 'Pasangan Ma', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Kembang mlathi (ꦏꦼꦩ꧀ꦧꦁ꧀ꦩ꧀ꦭꦛꦶ)',
      katrangan: 'Kaserat ing ngandhap kanthi wujud Ma ingkang ringkes.'
    },
    { 
      char: 'ꦏ꧀ꦒ', 
      induk: 'ꦒ', 
      name: 'Pasangan Ga', 
      letak: 'Ngandhap (Wutuh)', 
      contoh: 'Bocah gagah (ꦧꦺꦴꦕꦃ꧀ꦒꦒꦃ)',
      katrangan: 'Wujudipun wutuh kados aksara Ga carakan, manggen wonten ing ngandhap.'
    },
    { 
      char: 'ꦏ꧀ꦧ', 
      induk: 'ꦧ', 
      name: 'Pasangan Ba', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Gajah bengkak (ꦒꦗꦃ꧀ꦧꦼꦁꦏꦏ꧀)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg kang dipateni.'
    },
    { 
      char: 'ꦏ꧀ꦛ', 
      induk: 'ꦛ', 
      name: 'Pasangan Tha', 
      letak: 'Ngandhap (Ngisor)', 
      contoh: 'Jamu thowok (ꦗꦩꦸ꧀ꦛꦺꦴꦮꦺꦴꦏ꧀)',
      katrangan: 'Kaserat ing ngandhap aksara sigeg kangge swanten retrofleks Tha.'
    },
    { 
      char: 'ꦏ꧀ꦔ', 
      induk: 'ꦔ', 
      name: 'Pasangan Nga', 
      letak: 'Ngandhap (Wutuh)', 
      contoh: 'Laler ngresek (ꦭꦭꦼꦂ꧀ꦔꦿꦼꦱꦼꦏ꧀)',
      katrangan: 'Wujudipun wutuh kados aksara Nga carakan, manggen wonten ing ngandhap.'
    },
  ];

  // 3. Data Sandhangan (Swara, Panyigeg, Wyanjana)
  const sandhanganGroups = [
    {
      kategori: 'Sandhangan Swara (Vokal)',
      items: [
        { 
          nama: 'Wulu', 
          aksara: 'ꦏꦶ', 
          unine: 'i (ki)', 
          tuladha: 'Siti (ꦱꦶꦠꦶ), Pipi (ꦥꦶꦥꦶ)',
          kategori: 'Sandhangan Swara',
          panggonan: 'Ing dhuwur (ndhuwur) aksara',
          kegunaan: 'Ngowahi swara vokal aksara dhasar "a" dadi swara "i". Wujude bunder cilik ing sandhuwure aksara.'
        },
        { 
          nama: 'Suku', 
          aksara: 'ꦏꦸ', 
          unine: 'u (ku)', 
          tuladha: 'Buku (ꦧꦸꦏꦸ), Tuku (ꦠꦸꦏꦸ)',
          kategori: 'Sandhangan Swara',
          panggonan: 'Ing ngisor (gandheng ing sikil mburi aksara)',
          kegunaan: 'Ngowahi swara vokal aksara dhasar "a" dadi swara "u". Wujude mlengkung kaya buntut menyang tengen.'
        },
        { 
          nama: 'Pepet', 
          aksara: 'ꦏꦼ', 
          unine: 'e (ke)', 
          tuladha: 'Sega (ꦱꦼꦒ), Kerep (ꦏꦼꦉꦥ꧀)',
          kategori: 'Sandhangan Swara',
          panggonan: 'Ing dhuwur (ndhuwur) aksara',
          kegunaan: 'Ngowahi swara dadi vokal "e" pepet (kados ing tembung sega, kembang, peteng).'
        },
        { 
          nama: 'Taling', 
          aksara: 'ꦏꦺ', 
          unine: 'é (ké)', 
          tuladha: 'Sate (ꦱꦠꦺ), Lele (ꦭꦺꦭꦺ)',
          kategori: 'Sandhangan Swara',
          panggonan: 'Ing ngarep (sisih kiwa) aksara',
          kegunaan: 'Ngowahi swara dadi vokal "é" taling (kados ing tembung sate, lele, rame). Kaserat ing ngarepe aksara.'
        },
        { 
          nama: 'Taling-Tarung', 
          aksara: 'ꦏꦺꦴ', 
          unine: 'o (ko)', 
          tuladha: 'Toko (ꦠꦺꦴꦏꦺꦴ), Soto (ꦱꦺꦴꦠꦺꦴ)',
          kategori: 'Sandhangan Swara',
          panggonan: 'Ngapit aksara (taling ing ngarep, tarung ing mburi)',
          kegunaan: 'Ngowahi swara dadi vokal "o". Aksara Jawa diapit ing tengah-tengah antarane taling lan tarung.'
        },
      ]
    },
    {
      kategori: 'Sandhangan Panyigeg Wanda (Konsonan Akhir)',
      items: [
        { 
          nama: 'Wignyan', 
          aksara: 'ꦏꦃ', 
          unine: '-h (kah)', 
          tuladha: 'Gajah (ꦒꦗꦃ), Wayah (ꦮꦪꦃ)',
          kategori: 'Panyigeg Wanda',
          panggonan: 'Ing mburi (sisih tengen) aksara',
          kegunaan: 'Nambah konsonan pungkasan mati "-h" ing pungkasaning wanda (suku kata).'
        },
        { 
          nama: 'Layar', 
          aksara: 'ꦏꦂ', 
          unine: '-r (kar)', 
          tuladha: 'Pasar (ꦥꦱꦂ), Mawar (ꦩꦮꦂ)',
          kategori: 'Panyigeg Wanda',
          panggonan: 'Ing dhuwur (ndhuwur) aksara',
          kegunaan: 'Nambah konsonan pungkasan mati "-r". Dilarang nggunakake aksara Ra dipangkon ing pungkasan tembung, kudu nganggo Layar.'
        },
        { 
          nama: 'Cecak', 
          aksara: 'ꦏꦁ', 
          unine: '-ng (kang)', 
          tuladha: 'Wayang (ꦮꦪꦁ), Cacing (ꦕꦕꦶꦁ)',
          kategori: 'Panyigeg Wanda',
          panggonan: 'Ing dhuwur (ndhuwur) aksara',
          kegunaan: 'Nambah konsonan pungkasan mati "-ng". Wujude bunder cilik ana buntute sithik ing dhuwur aksara.'
        },
        { 
          nama: 'Pangkon / Paten', 
          aksara: 'ꦏ꧀', 
          unine: 'Mateni aksara (k)', 
          tuladha: 'Bapak (ꦧꦥꦏ꧀), Anak (ꦲꦤꦏ꧀)',
          kategori: 'Panyigeg Wanda',
          panggonan: 'Ing mburi (sisih tengen) aksara pungkasan',
          kegunaan: 'Mateni swara vokal aksara ing pungkasan ukara utawa gatra saengga mung unine konsonan murni.'
        },
      ]
    },
    {
      kategori: 'Sandhangan Wyanjana (Sisipan)',
      items: [
        { 
          nama: 'Cakra', 
          aksara: 'ꦏꦿ', 
          unine: '+ra (kra)', 
          tuladha: 'Krasa (ꦏꦿꦱ), Prabu (ꦥꦿꦧꦸ)',
          kategori: 'Sandhangan Wyanjana',
          panggonan: 'Nyambung ing ngisor sikil aksara',
          kegunaan: 'Nyisipake swara konsonan "-r-" ing tengahing wanda (tuladha: kra, pra, tra).'
        },
        { 
          nama: 'Keret', 
          aksara: 'ꦏꦽ', 
          unine: '+re pepet (kre)', 
          tuladha: 'Kreta (ꦏꦽꦠ), Sregep (ꦱꦽꦒꦼꦥ꧀)',
          kategori: 'Sandhangan Wyanjana',
          panggonan: 'Nyambung ing ngisor sikil aksara kanthi bunderan pepet',
          kegunaan: 'Nyisipake swara "-re" pepet. Ngganteni gabungan cakra lan pepet kang ora kena ditulis bebarengan.'
        },
        { 
          nama: 'Pengkal', 
          aksara: 'ꦏꦾ', 
          unine: '+ya (kya)', 
          tuladha: 'Kyai (ꦏꦾꦲꦶ), Setya (ꦱꦼꦠꦾ)',
          kategori: 'Sandhangan Wyanjana',
          panggonan: 'Ing mburi sisih ngisor aksara',
          kegunaan: 'Nyisipake swara konsonan "-y-" ing tengahing suku kata utawa wanda (tuladha: kya, tya, dya).'
        },
      ]
    }
  ];

  // 4. Data Contoh Kalimat Panjang (Ukara Jangkep)
  const contohUkaraList: KalimatPanjangItem[] = [
    {
      judul: "Gugur Gunung Resik Desa",
      tingkat: "Gampil",
      latin: "Para warga padha gugur gunung ngresiki desa.",
      aksara: toJavanese("para warga padha gugur gunung ngresiki desa"),
      teges: "Para warga bergotong royong membersihkan desa.",
      bedhahan: "Nganggo sandhangan layar (-r), cecak (-ng), suku (u), wulu (i), taling (e)."
    },
    {
      judul: "Ngasah Kawruh ing Pawiyatan",
      tingkat: "Sedheng",
      latin: "Bocah sekolah kudu sregep sinau basa lan aksara Jawa.",
      aksara: toJavanese("bocah sekolah kudu sregep sinau basa lan aksara jawa"),
      teges: "Anak sekolah harus rajin belajar bahasa dan aksara Jawa.",
      bedhahan: "Nganggo pasangan Sa ing tembung 'basa lan aksara' (aksara Na dipateni pasangan Sa), sarta sandhangan keret (sre-)."
    },
    {
      judul: "Ngurmati Wong Tuwa",
      tingkat: "Sedheng",
      latin: "Bapak dhahar sekul liwet, dene Simbok ngunjuk wedang jahe.",
      aksara: toJavanese("bapak dhahar sekul liwet dene simbok ngunjuk wedang jahe"),
      teges: "Bapak makan nasi liwet, sedangkan Ibu minum minuman jahe.",
      bedhahan: "Nganggo pasangan Dha (bapak dhahar), pasangan Sa (dhahar sekul), sarta sandhangan taling-tarung (o) ing tembung Simbok."
    },
    {
      judul: "Piwulang Luhur Leluhur",
      tingkat: "Utama",
      latin: "Urip iku urup, tansah aweh pepadhang marang sapadha-padha.",
      aksara: toJavanese("urip iku urup tansah aweh pepadhang marang sapadha padha"),
      teges: "Hidup itu menyala memberi manfaat dan terang bagi sesama makhluk hidup.",
      bedhahan: "Nganggo pasangan Ha, wignyan (-h), cecak (-ng), suku, sarta paten pangkon."
    },
    {
      judul: "Tembang Macapat Pocung",
      tingkat: "Utama",
      latin: "Bapak pucung dudu watu dudu gunung, sangkane ing sabrang.",
      aksara: toJavanese("bapak pucung dudu watu dudu gunung sangkane ing sabrang"),
      teges: "Cangkriman tembang Pocung (gajah): bukan batu bukan gunung, asalnya dari seberang.",
      bedhahan: "Kombinasi pasangan Pa, cakra (+ra), cecak (-ng), lan sandhangan swara jangkep."
    }
  ];

  // 5. Data Bank Soal Kuis Ketik Berlevel (20 Soal per Level = 60 Soal Total)
  const bankKuisKetik: KuisKetikItem[] = [
    // ==========================================
    // LEVEL 1: DASAR (20 SOAL KATA PENDEK 2 AKSARA)
    // ==========================================
    { id: 1, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("kaca"), petunjuk: "Tembung 2 aksara: Ka + Ca", kunciLatin: ["kaca"], teges: "Cermin / Kaca" },
    { id: 2, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("bata"), petunjuk: "Tembung 2 aksara: Ba + Ta", kunciLatin: ["bata"], teges: "Batu bata bangunan" },
    { id: 3, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("raja"), petunjuk: "Tembung 2 aksara: Ra + Ja", kunciLatin: ["raja"], teges: "Ratu / Penguasa krajan" },
    { id: 4, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("sate"), petunjuk: "Nganggo sandhangan taling (é)", kunciLatin: ["sate", "saté"], teges: "Panganan daging sundukan" },
    { id: 5, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("buku"), petunjuk: "Nganggo sandhangan suku (u)", kunciLatin: ["buku"], teges: "Kitab / Piranti sinau maca" },
    { id: 6, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("toko"), petunjuk: "Nganggo sandhangan taling-tarung (o)", kunciLatin: ["toko"], teges: "Papan dodolan barang" },
    { id: 7, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("pasar"), petunjuk: "Nganggo sandhangan layar (-r)", kunciLatin: ["pasar"], teges: "Papan rame dol-tinuku" },
    { id: 8, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("gajah"), petunjuk: "Nganggo sandhangan wignyan (-h)", kunciLatin: ["gajah"], teges: "Kewan gedhe mawi tlalé" },
    { id: 9, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("wayang"), petunjuk: "Nganggo sandhangan cecak (-ng)", kunciLatin: ["wayang"], teges: "Seni ringgit / pagelaran kulit" },
    { id: 10, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("sega"), petunjuk: "Nganggo sandhangan pepet (e)", kunciLatin: ["sega"], teges: "Panganan pokok beras diliwet" },
    { id: 11, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("siti"), petunjuk: "Nganggo sandhangan wulu (i)", kunciLatin: ["siti"], teges: "Lemah / Siti bumi" },
    { id: 12, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("mata"), petunjuk: "Tembung 2 aksara: Ma + Ta", kunciLatin: ["mata"], teges: "Mripat kanggo ndeleng" },
    { id: 13, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("kaya"), petunjuk: "Tembung 2 aksara: Ka + Ya", kunciLatin: ["kaya"], teges: "Kados / Sugih bandha" },
    { id: 14, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("pari"), petunjuk: "Nganggo sandhangan wulu (i)", kunciLatin: ["pari"], teges: "Tetanduran ing sawah" },
    { id: 15, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("watu"), petunjuk: "Nganggo sandhangan suku (u)", kunciLatin: ["watu"], teges: "Sela / Watu atos ing kali" },
    { id: 16, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("sapu"), petunjuk: "Nganggo sandhangan suku (u)", kunciLatin: ["sapu"], teges: "Piranti kanggo reresik lante" },
    { id: 17, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("dalan"), petunjuk: "Nganggo paten pangkon ing aksara Na", kunciLatin: ["dalan"], teges: "Margi / Dalan liwat" },
    { id: 18, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("kopi"), petunjuk: "Nganggo taling-tarung lan wulu", kunciLatin: ["kopi"], teges: "Wedang ireng anget seger" },
    { id: 19, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("jamu"), petunjuk: "Nganggo sandhangan suku (u)", kunciLatin: ["jamu"], teges: "Loloh / Obat tradisional Jawa" },
    { id: 20, level: 'dasar', tipe: 'kata_dasar', aksaraSoal: toJavanese("jaran"), petunjuk: "Nganggo paten pangkon ing pungkasan", kunciLatin: ["jaran"], teges: "Kewan titihan playune banter" },

    // ==========================================
    // LEVEL 2: KALIMAT (20 SOAL KALIMAT SEHARI-HARI & PASANGAN)
    // ==========================================
    { id: 21, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("hana caraka"), petunjuk: "Larikan kawitan Aji Saka", kunciLatin: ["hana caraka", "ana caraka", "hanacaraka", "anacaraka"], teges: "Ada utusan napas kehidupan" },
    { id: 22, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("sinau aksara"), petunjuk: "Kegiyatan sinau ing pamulangan", kunciLatin: ["sinau aksara", "sinauaksara"], teges: "Belajar membaca aksara Jawa" },
    { id: 23, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("mangan nanas"), petunjuk: "Aksara Na dipateni pasangan Na", kunciLatin: ["mangan nanas", "mangannanas"], teges: "Makan buah nanas manis" },
    { id: 24, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("bapak tindak"), petunjuk: "Aksara Ka dipateni pasangan Ta", kunciLatin: ["bapak tindak", "bapaktindak"], teges: "Ayah berangkat bepergian" },
    { id: 25, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("tuku sate"), petunjuk: "Ukara gampil nganggo suku lan taling", kunciLatin: ["tuku sate", "tuku saté", "tukusate"], teges: "Membeli sate lezat" },
    { id: 26, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("wayang kulit"), petunjuk: "Kesenian warisan adiluhung Jawa", kunciLatin: ["wayang kulit", "wayangkulit"], teges: "Seni pertunjukan wayang kulit" },
    { id: 27, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("ngombe wedang"), petunjuk: "Nganggo cecak (-ng) lan taling", kunciLatin: ["ngombe wedang", "ngombewedang"], teges: "Meminum air hangat" },
    { id: 28, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("sepatu anyar"), petunjuk: "Nganggo sandhangan layar (-r)", kunciLatin: ["sepatu anyar", "sepatuanyar"], teges: "Sepatu baru untuk sekolah" },
    { id: 29, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("bocah pinter"), petunjuk: "Nganggo wulu, cecak, lan layar", kunciLatin: ["bocah pinter", "bocahpinter"], teges: "Anak yang pandai dan berilmu" },
    { id: 30, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("budhal sekolah"), petunjuk: "Nganggo wignyan (-h) ing pungkasan", kunciLatin: ["budhal sekolah", "budhalsekolah"], teges: "Berangkat ke sekolah pagi hari" },
    { id: 31, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("maca koran"), petunjuk: "Nganggo taling-tarung lan paten pangkon", kunciLatin: ["maca koran", "macakoran"], teges: "Membaca kabar koran" },
    { id: 32, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("resik desa"), petunjuk: "Kegiyatan gotong royong warga", kunciLatin: ["resik desa", "resikdesa"], teges: "Membersihkan lingkungan desa" },
    { id: 33, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("gajah kurus"), petunjuk: "Aksara Ha dipateni pasangan Ka", kunciLatin: ["gajah kurus", "gajahkurus"], teges: "Gajah yang bertubuh kurus" },
    { id: 34, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("nulis layang"), petunjuk: "Nganggo wulu, suku, cecak", kunciLatin: ["nulis layang", "nulislayang"], teges: "Menulis surat pesan" },
    { id: 35, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("padha padu"), petunjuk: "Tegese pasulayan / rebut bener", kunciLatin: ["padha padu", "padhapadu"], teges: "Saling berbantahan" },
    { id: 36, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("adus kali"), petunjuk: "Nganggo paten Sa dipateni pasangan Ka", kunciLatin: ["adus kali", "aduskali"], teges: "Mandi di sungai yang jernih" },
    { id: 37, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("sega liwet"), petunjuk: "Panganan tradisional sega gurih", kunciLatin: ["sega liwet", "segaliwet"], teges: "Nasi liwet hangat" },
    { id: 38, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("pitik cilik"), petunjuk: "Aksara Ka dipateni pasangan Ca", kunciLatin: ["pitik cilik", "pitikcilik"], teges: "Anak ayam yang kecil" },
    { id: 39, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("simbok dhahar"), petunjuk: "Basa krama kurmat marang ibu", kunciLatin: ["simbok dhahar", "simbokdhahar"], teges: "Ibu sedang bersantap makan" },
    { id: 40, level: 'sedang', tipe: 'kalimat', aksaraSoal: toJavanese("kembang mlathi"), petunjuk: "Nganggo pasangan Ma lan sandhangan wulu", kunciLatin: ["kembang mlathi", "kembangmlathi"], teges: "Bunga melati yang harum" },

    // ==========================================
    // LEVEL 3: MAHIR (20 SOAL PARIBASAN, UNGKAPAN LUHUR & CERITA AJI SAKA)
    // ==========================================
    { id: 41, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("urip iku urup"), petunjuk: "Filsafat Jawa babagan pigunaning gesang", kunciLatin: ["urip iku urup", "uripikuurup"], teges: "Hidup itu hendaknya menyala memberi manfaat" },
    { id: 42, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("data sawala"), petunjuk: "Bait kaping pindho Hanacaraka", kunciLatin: ["data sawala", "datasawala"], teges: "Terjadi perselisihan karena teguh pada janji" },
    { id: 43, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("padha jayanya"), petunjuk: "Bait kaping telu Hanacaraka", kunciLatin: ["padha jayanya", "padhajayanya"], teges: "Keduanya sama-sama sakti mandraguna" },
    { id: 44, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("maga bathanga"), petunjuk: "Bait pungkasan Hanacaraka", kunciLatin: ["maga bathanga", "magabathanga"], teges: "Keduanya gugur bersama menjadi mayat" },
    { id: 45, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("bocah sregep"), petunjuk: "Nganggo sandhangan keret (sre-)", kunciLatin: ["bocah sregep", "bocahsregep"], teges: "Anak yang giat dan rajin berusaha" },
    { id: 46, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("bapak pucung"), petunjuk: "Judhul tembang macapat cangkriman", kunciLatin: ["bapak pucung", "bapakpucung"], teges: "Tembang macapat Pocung" },
    { id: 47, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("andhap asor"), petunjuk: "Sifat budi pakerti luhur Jawa", kunciLatin: ["andhap asor", "andhapasor"], teges: "Sikap rendah hati dan sopan santun" },
    { id: 48, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("ajining dhiri"), petunjuk: "Ajining dhiri ana ing lathi", kunciLatin: ["ajining dhiri", "ajiningdhiri"], teges: "Kehormatan diri ada pada tutur kata" },
    { id: 49, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("sura dira jayaningrat"), petunjuk: "Filsafat ngasorake angkara murka", kunciLatin: ["sura dira jayaningrat", "suradirajayaningrat"], teges: "Segala keangkuhan lebur oleh kelembutan" },
    { id: 50, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("lebur dening pangastuti"), petunjuk: "Sambungane sura dira jayaningrat", kunciLatin: ["lebur dening pangastuti", "leburdeningpangastuti"], teges: "Hancur lebur oleh sifat kasih dan kebaikan" },
    { id: 51, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("alon alon waton kelakon"), petunjuk: "Paribasan babagan ketelitian lan kasabaran", kunciLatin: ["alon alon waton kelakon", "alonalonwatonkelakon"], teges: "Perlahan asal selamat dan tercapai tujuannya" },
    { id: 52, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("mikul dhuwur"), petunjuk: "Mikul dhuwur mendhem jero", kunciLatin: ["mikul dhuwur", "mikuldhuwur"], teges: "Menjunjung tinggi kehormatan orang tua" },
    { id: 53, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("mendhem jero"), petunjuk: "Sambungane mikul dhuwur", kunciLatin: ["mendhem jero", "mendhemjero"], teges: "Menutupi aib keluarga/orang tua rapat-rapat" },
    { id: 54, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("kraton medang kamulan"), petunjuk: "Kerajaan ing dongeng Aji Saka", kunciLatin: ["kraton medang kamulan", "kratonmedangkamulan"], teges: "Kerajaan Medang Kamulan tanah Jawa" },
    { id: 55, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("dewata cengkar"), petunjuk: "Ratu wengis ing Medang Kamulan", kunciLatin: ["dewata cengkar", "dewatacengkar"], teges: "Prabu Dewata Cengkar pemangsa manusia" },
    { id: 56, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("pulo majeti"), petunjuk: "Pulo papane Dora ngrumat keris", kunciLatin: ["pulo majeti", "pulomajeti"], teges: "Pulau Majeti tempat keris pusaka dijaga" },
    { id: 57, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("nyai sengkeran"), petunjuk: "Randha sepuh sing ditututi Aji Saka", kunciLatin: ["nyai sengkeran", "nyaisengkeran"], teges: "Ibu angkat Aji Saka di Medang Kamulan" },
    { id: 58, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("baya putih"), petunjuk: "Jilmaane Dewata Cengkar ing segara", kunciLatin: ["baya putih", "bayaputih"], teges: "Buaya putih penunggu Laut Selatan" },
    { id: 59, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("gugur gunung"), petunjuk: "Tembung gotong royong bebarengan", kunciLatin: ["gugur gunung", "gugurgunung"], teges: "Gotong royong bersama membangun desa" },
    { id: 60, level: 'mahir', tipe: 'paribasan', aksaraSoal: toJavanese("tresna budaya jawa"), petunjuk: "Slogan nglestarekake kabudayan", kunciLatin: ["tresna budaya jawa", "tresnabudayajawa"], teges: "Mencintai dan melestarikan budaya luhur Jawa" }
  ];

  // Handler Studio Pembuat Aksara
  const hasilAksaraStudio = (() => {
    if (!studioInput.trim()) return '';
    try {
      return toJavanese(studioInput);
    } catch {
      return 'Dereng trep panyerate';
    }
  })();

  const handleSalinAksara = () => {
    playGamelanClick();
    if (hasilAksaraStudio) {
      navigator.clipboard.writeText(hasilAksaraStudio);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  // Filter soal kuis adhedhasar level sing dipilih
  const soalSesuaiLevel = bankKuisKetik.filter(item => item.level === kuisLevel);
  const soalAktif = soalSesuaiLevel[kuisIndex] || soalSesuaiLevel[0];

  const handleGantiLevelKuis = (lvl: 'dasar' | 'sedang' | 'mahir') => {
    playGamelanClick();
    setKuisLevel(lvl);
    setKuisIndex(0);
    setKuisInput('');
    setKuisStatus('idle');
    setTampilPetunjuk(false);
    setTampilJawaban(false);
  };

  const handleCekJawabanKuis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!kuisInput.trim() || kuisStatus === 'bener' || !soalAktif) return;

    const normalisasiInput = kuisInput.trim().toLowerCase();
    const isBener = soalAktif.kunciLatin.some(kunci => kunci.toLowerCase() === normalisasiInput);

    if (isBener) {
      playCorrectChime();
      setKuisStatus('bener');
      setKuisSkor(prev => prev + 10);
    } else {
      playTetotSound();
      setKuisStatus('salah');
    }
  };

  const handleLanjutKuis = () => {
    playGamelanClick();
    setKuisStatus('idle');
    setKuisInput('');
    setTampilPetunjuk(false);
    setTampilJawaban(false);
    if (kuisIndex < soalSesuaiLevel.length - 1) {
      setKuisIndex(prev => prev + 1);
    } else {
      // Baleni saka awal level kasebut
      setKuisIndex(0);
    }
  };

  const handleSelectSandhangan = (item: SandhanganItem) => {
    playGamelanClick();
    setSelectedSandhangan(item);
  };

  const handleSelectPasangan = (item: PasanganItem) => {
    playGamelanClick();
    setSelectedPasangan(item);
  };

  const handleSelectAksara = (item: AksaraItem) => {
    playGamelanClick();
    setSelectedAksara(item);
  };

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
          className={`aksara-tab-btn ${activeTab === 'lagu' ? 'active' : ''}`}
          onClick={() => setActiveTab('lagu')}
        >
          🎵 Tembang Ngapalake
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
        <button 
          className={`aksara-tab-btn ${activeTab === 'ukara' ? 'active' : ''}`}
          onClick={() => setActiveTab('ukara')}
        >
          📜 Ukara Jangkep
        </button>
        <button 
          className={`aksara-tab-btn ${activeTab === 'cerita' ? 'active' : ''}`}
          onClick={() => setActiveTab('cerita')}
        >
          📖 Dongeng Aji Saka
        </button>
        <button 
          className={`aksara-tab-btn ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('studio')}
        >
          ✍️ Studio Aksara
        </button>
        <button 
          className={`aksara-tab-btn ${activeTab === 'kuis' ? 'active' : ''}`}
          onClick={() => setActiveTab('kuis')}
        >
          🎮 Kuis Ngetik
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
                <div 
                  key={index} 
                  className={`aksara-card-modern ${selectedAksara?.name === item.name ? 'selected' : ''}`}
                  onClick={() => handleSelectAksara(item)}
                  role="button"
                  tabIndex={0}
                  title={`Klik kanggo mangerteni aksara ${item.name}`}
                >
                  <div className="aksara-symbol">{item.char}</div>
                  <div className="aksara-label">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB KHUSUS: TEMBANG CARA GAMPIL NGAPALAKE WUJUD AKSARA JAWA */}
        {activeTab === 'lagu' && (
          <div className="lagu-container">
            <div className="aksara-section-info">
              <h3>🎵 Tembang Ngapalake Wujud Aksara Jawa</h3>
              <p>Metode nyanyian gampil (nada lagu <em>"Tanjung Perak"</em>) kanggo niteni kembaraning wujud lan ciri khas 20 aksara Jawa!</p>
            </div>

            {/* Kotak Lirik Inti Tembang */}
            <div className="lagu-lyrics-banner">
              <span className="lagu-badge-note">🎶 Tembang Ngapalake Aksara Jawa</span>
              <div className="lagu-lyrics-lines">
                <p>ha la da sa iku diwalik</p>
                <p>ra ga na ka pa ya padha</p>
                <p>wa ca dha nduwe cucuk</p>
                <p>nga ba nya nduwe payung</p>
                <p>ma tha eeee</p>
                <p>ja kaya er</p>
                <p>ta kaya es</p>
              </div>
            </div>

            {/* Visualisasi Kartu Analogi Tiap Bait Lagu */}
            <div className="lagu-cards-grid">
              {/* Bait 1: Diwalik */}
              <div className="lagu-feature-card">
                <div className="lagu-card-header">
                  <span className="lagu-chip">Bait 1</span>
                  <h4>ha la da sa iku diwalik</h4>
                </div>
                <div className="lagu-comparison-row">
                  <div className="lagu-char-pair">
                    <span className="lagu-jawa">ꦲ</span>
                    <span className="lagu-name">ha</span>
                    <span className="lagu-vs">↔️</span>
                    <span className="lagu-jawa">ꦭ</span>
                    <span className="lagu-name">la</span>
                  </div>
                  <div className="lagu-char-pair">
                    <span className="lagu-jawa">ꦢ</span>
                    <span className="lagu-name">da</span>
                    <span className="lagu-vs">↔️</span>
                    <span className="lagu-jawa">ꦱ</span>
                    <span className="lagu-name">sa</span>
                  </div>
                </div>
              </div>

              {/* Bait 2: Pada */}
              <div className="lagu-feature-card">
                <div className="lagu-card-header">
                  <span className="lagu-chip">Bait 2</span>
                  <h4>ra ga na ka pa ya padha</h4>
                </div>
                <div className="lagu-comparison-row">
                  <div className="lagu-char-pair">
                    <span className="lagu-jawa">ꦫ</span>
                    <span className="lagu-name">ra</span>
                    <span className="lagu-vs">≈</span>
                    <span className="lagu-jawa">ꦒ</span>
                    <span className="lagu-name">ga</span>
                  </div>
                  <div className="lagu-char-pair">
                    <span className="lagu-jawa">ꦤ</span>
                    <span className="lagu-name">na</span>
                    <span className="lagu-vs">≈</span>
                    <span className="lagu-jawa">ꦏ</span>
                    <span className="lagu-name">ka</span>
                  </div>
                  <div className="lagu-char-pair">
                    <span className="lagu-jawa">ꦥ</span>
                    <span className="lagu-name">pa</span>
                    <span className="lagu-vs">≈</span>
                    <span className="lagu-jawa">ꦪ</span>
                    <span className="lagu-name">ya</span>
                  </div>
                </div>
              </div>

              {/* Bait 3: Nduwe Cucuk */}
              <div className="lagu-feature-card">
                <div className="lagu-card-header">
                  <span className="lagu-chip">Bait 3</span>
                  <h4>wa ca dha nduwe cucuk</h4>
                </div>
                <div className="lagu-comparison-row">
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦮ</span>
                    <span className="lagu-name">wa</span>
                  </div>
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦕ</span>
                    <span className="lagu-name">ca</span>
                  </div>
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦝ</span>
                    <span className="lagu-name">dha</span>
                  </div>
                </div>
              </div>

              {/* Bait 4: Nduwe Payung */}
              <div className="lagu-feature-card">
                <div className="lagu-card-header">
                  <span className="lagu-chip">Bait 4</span>
                  <h4>nga ba nya nduwe payung</h4>
                </div>
                <div className="lagu-comparison-row">
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦔ</span>
                    <span className="lagu-name">nga</span>
                  </div>
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦧ</span>
                    <span className="lagu-name">ba</span>
                  </div>
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦚ</span>
                    <span className="lagu-name">nya</span>
                  </div>
                </div>
              </div>

              {/* Bait 5: Ma tha eeee, ja kaya er, ta kaya es */}
              <div className="lagu-feature-card">
                <div className="lagu-card-header">
                  <span className="lagu-chip">Bait 5</span>
                  <h4>ma tha eeee, ja kaya er, ta kaya es</h4>
                </div>
                <div className="lagu-comparison-row">
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦩ</span>
                    <span className="lagu-name">ma</span>
                  </div>
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦛ</span>
                    <span className="lagu-name">tha</span>
                  </div>
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦗ</span>
                    <span className="lagu-name">ja (er)</span>
                  </div>
                  <div className="lagu-char-single">
                    <span className="lagu-jawa">ꦠ</span>
                    <span className="lagu-name">ta (es)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PASANGAN AKSARA */}
        {activeTab === 'pasangan' && (
          <div>
            <div className="aksara-section-info">
              <h3>꧀ꦲ ꧀ꦤ ꧀ꦕ ꧀ꦫ ꧀ꦏ - Pasangan Aksara Jawa</h3>
              <p>Pasangan gunane kanggo <b>mateni (ngilangake swara vokal)</b> aksara sigeg sadurunge ing tengahing tembung utawa ukara. Tutul/klik salah siji pasangan kanggo ndeleng wujud gedhe lan katerangane!</p>
            </div>

            {/* Grid Kartu Pasangan Modern (Bisa Diklik & Pop-up Gede) */}
            <div className="pasangan-grid-modern">
              {pasanganList.map((item, index) => (
                <div 
                  key={index} 
                  className={`pasangan-card-modern ${selectedPasangan?.name === item.name ? 'selected' : ''}`}
                  onClick={() => handleSelectPasangan(item)}
                  role="button"
                  tabIndex={0}
                  title={`Klik kanggo ndeleng ${item.name}`}
                >
                  <div className="pasangan-char-display">{item.char}</div>
                  <div className="pasangan-label-name">{item.name}</div>
                  <span className={`badge-letak-card ${item.letak.includes('Tengen') ? 'badge-tengen' : 'badge-ngisor'}`}>
                    {item.letak}
                  </span>
                </div>
              ))}
            </div>

            {/* Tabel Lengkap Pasangan Aksara */}
            <h4 className="pasangan-table-title">📊 Tabel Rincian Pasangan & Tuladha</h4>
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
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pasanganList.map((p, idx) => (
                    <tr key={idx} className="pasangan-table-row" onClick={() => handleSelectPasangan(p)}>
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
                      <td>
                        <button 
                          type="button" 
                          className="btn-table-detail"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPasangan(p);
                          }}
                        >
                          🔍 Deleng
                        </button>
                      </td>
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
              <p>Sandhangan yaiku tandha diakritik kanggo ngowahi utawa nambah swara vokal lan konsonan ing aksara Jawa. Klik salah siji sandhangan kanggo ndeleng wujud gedhe lan katerangane!</p>
            </div>

            {sandhanganGroups.map((group, gIdx) => (
              <div key={gIdx} className="sandhangan-group-box">
                <h4 className="sandhangan-group-title">{group.kategori}</h4>
                <div className="sandhangan-grid">
                  {group.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx} 
                      className={`sandhangan-card ${selectedSandhangan?.nama === item.nama ? 'selected' : ''}`}
                      onClick={() => handleSelectSandhangan(item)}
                      role="button"
                      tabIndex={0}
                      title={`Klik kanggo ndeleng sandhangan ${item.nama}`}
                    >
                      <div className="sandhangan-char">{item.aksara}</div>
                      <div className="sandhangan-name">{item.nama}</div>
                      <div className="sandhangan-sound">Uni: <b>{item.unine}</b></div>
                      <div className="sandhangan-example">Tuladha: {item.tuladha}</div>
                      <div className="sandhangan-click-hint">🔍 Tutul kanggo ndeleng rincian</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: UKARA JANGKEP (CONTOH KALIMAT PANJANG) */}
        {activeTab === 'ukara' && (
          <div>
            <div className="aksara-section-info">
              <h3>📜 Tuladha Ukara Jangkep (Kalimat Panjang)</h3>
              <p>Sinau maca ukara Jawa jangkep kang nggabungake aksara nglegena, pasangan, lan sandhangan kanthi bedhahan structure lan tegese.</p>
            </div>

            <div className="ukara-grid-container">
              {contohUkaraList.map((item, idx) => (
                <div key={idx} className="ukara-card">
                  <div className="ukara-header">
                    <span className="ukara-number">#{idx + 1}</span>
                    <span className="ukara-title">{item.judul}</span>
                    <span className={`ukara-badge badge-${item.tingkat.toLowerCase()}`}>
                      {item.tingkat}
                    </span>
                  </div>

                  <div className="ukara-aksara-display">
                    {item.aksara}
                  </div>

                  <div className="ukara-body">
                    <div className="ukara-field">
                      <span className="ukara-label">📝 Wacan Latin:</span>
                      <p className="ukara-latin-text">"{item.latin}"</p>
                    </div>

                    <div className="ukara-field">
                      <span className="ukara-label">🇮🇩 Tegese (Arti):</span>
                      <p className="ukara-meaning-text">{item.teges}</p>
                    </div>

                    <div className="ukara-field ukara-bedhahan-box">
                      <span className="ukara-label">🔍 Bedhahan Aksara & Sandhangan:</span>
                      <p className="ukara-bedhahan-text">{item.bedhahan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CERITA & ASAL-USUL AKSARA JAWA (DONGENG AJI SAKA) */}
        {activeTab === 'cerita' && (
          <div className="cerita-container">
            <div className="aksara-section-info">
              <h3>📖 Asal-usul Aksara Jawa: Dumadine Carakan Aji Saka</h3>
              <p>Carita kepahlawanan Aji Saka ing Medang Kamulan lan kasetyane Dora lan Sembada kang nglairake 20 aksara Hanacaraka.</p>
            </div>

            {/* Sorotan 4 Larikan Filosofi Cerita */}
            <div className="cerita-hanacaraka-highlight">
              <h4 className="highlight-title">✨ Sajak Kasetyan Dora & Sembada (4 Gatra Hanacaraka)</h4>
              <div className="highlight-grid">
                <div className="highlight-card">
                  <span className="aksara-badge-row">ꦲ ꦤ ꦕ ꦫ ꦏ</span>
                  <h5>Ha Na Ca Ra Ka</h5>
                  <p className="highlight-makna">"Hana caraka" (Ana utusan / utusan urip)</p>
                  <span className="highlight-sub">Aji Saka ngutus Sembada njupuk pusaka marang Dora ing Pulo Majeti.</span>
                </div>
                <div className="highlight-card">
                  <span className="aksara-badge-row">ꦢ ꦠ ꦱ ꦮ ꦭ</span>
                  <h5>Da Ta Sa Wa La</h5>
                  <p className="highlight-makna">"Data sawala" (Padha padu / pasulayan)</p>
                  <span className="highlight-sub">Kekalihe padha rebut bener amarga ngugemi amanat sarta janji suci marang Aji Saka.</span>
                </div>
                <div className="highlight-card">
                  <span className="aksara-badge-row">ꦥ ꦝ ꦗ ꦪ ꦚ</span>
                  <h5>Pa Dha Ja Ya Nya</h5>
                  <p className="highlight-makna">"Padha jayanya" (Padha sektine lan kakuwatane)</p>
                  <span className="highlight-sub">Dora lan Sembada tandhing jurit, kridhane padha pinter lan sektine tanpa tandhing.</span>
                </div>
                <div className="highlight-card">
                  <span className="aksara-badge-row">ꦩ ꦒ ꦧ ꦛ ꦔ</span>
                  <h5>Ma Ga Ba Tha Nga</h5>
                  <p className="highlight-makna">"Maga bathanga" (Padha dadi bathang / nemahi pralaya)</p>
                  <span className="highlight-sub">Kekalihe nemahi pralaya bebarengan minangka bukti kasetyan mutlak marang bendarane.</span>
                </div>
              </div>
            </div>

            {/* Isi Babak Cerita Aji Saka */}
            <div className="cerita-chapters">
              {/* Babak 1 */}
              <div className="cerita-chapter-card">
                <div className="chapter-header">
                  <span className="chapter-badge">Babak 1</span>
                  <h4>⛵ Pengembaraan Aji Saka menyang Tanah Jawa</h4>
                </div>
                <div className="chapter-body">
                  <p>
                    Ing jaman biyen, ana satriya mudha kang linuwih asmane <strong>Aji Saka</strong> saka tanah Hindustan lelana menyang pulo Jawa. Aji Saka ora ijen, nanging kadherekake dening abdine loro kang setya tuhu, yaiku <strong>Dora</strong> lan <strong>Sembada</strong>. Kekalihe lelayaran tumuju negara kang subur makmur aran <strong>Medang Kamulan</strong>.
                  </p>
                  <p>
                    Sadurunge tekan Medang Kamulan, rombongan leren dhisik ing <strong>Pulo Majeti</strong>. Ing pulo iki, Aji Saka masrahake pusaka awujud keris marang <strong>Dora</strong> supaya dijaga kanthi becik. Aji Saka paring weling kenceng:
                  </p>
                  <blockquote className="cerita-quote">
                    "Dora, reksanen keris pusakaku iki. Aja pisan-pisan kokwenehake sapa wae, kajaba aku dhewe sing teka njupuk!"
                  </blockquote>
                  <p>
                    Dora saguh lan nampa dhawuh kasebut, dene Aji Saka lan Sembada nerusake lakune menyang Medang Kamulan.
                  </p>
                </div>
              </div>

              {/* Babak 2 */}
              <div className="cerita-chapter-card">
                <div className="chapter-header">
                  <span className="chapter-badge">Babak 2</span>
                  <h4>👹 Angkara Murka Prabu Dewata Cengkar</h4>
                </div>
                <div className="chapter-body">
                  <p>
                    Tekan ing Medang Kamulan, Aji Saka lan Sembada manggon ana ing daleme randha tuwa arane <strong>Nyai Sengkeran</strong>. Aji Saka misuwur amarga kapinterane lan kawicaksanane, mula akeh wong kalebu Ki Patih sing meguru marang panjenengane.
                  </p>
                  <p>
                    Nanging, wargane Medang Kamulan padha nandhang prihatin lan giris. Negarane dipimpin dening ratu kang wengis lan seneng memangsa daging manungsa, yaiku <strong>Prabu Dewata Cengkar</strong>. Saben dina kudu ana warga sing dikurbanake dadi mangsane sang raja.
                  </p>
                  <p>
                    Krungu sambate Ki Patih lan tangise rakyat, Aji Saka krenteg atine kanggo ngilangake angkara murka kasebut.
                  </p>
                </div>
              </div>

              {/* Babak 3 */}
              <div className="cerita-chapter-card">
                <div className="chapter-header">
                  <span className="chapter-badge">Babak 3</span>
                  <h4>👑 Ikete Aji Saka Ngalahake Sang Raja</h4>
                </div>
                <div className="chapter-body">
                  <p>
                    Kanthi kendel, Aji Saka seba ing ngarsane Prabu Dewata Cengkar lan masrahake awake dadi kurban panganan sabanjure. Sang Prabu seneng banget. Nanging sadurunge dipangan, Aji Saka nyuwun panyuwunan sepisan:
                  </p>
                  <blockquote className="cerita-quote">
                    "Kula lila dipun-mangsa dening Sang Prabu, nanging kula nyuwun lemah saambane iket udheng (kain sirah) kula menika."
                  </blockquote>
                  <p>
                    Prabu Dewata Cengkar ngguyu lakak-lakak lan nyarujuki amarga nganggep remeh iket kasebut. Nanging ajaib, nalika ikete Aji Saka dibeber, kain iku sansaya dawa lan amba nganti ngebaki kraton!
                  </p>
                  <p>
                    Sang Prabu terus mundur narik pucuke iket nganti tekan pinggir tebing <strong>Segara Kidul</strong>. Kanthi kridhane Aji Saka, iket dikipatake saengga Prabu Dewata Cengkar kecemplung ing segara lan sirna dadi <em>baya putih</em>. Rakyat Medang Kamulan banjur ngangkat Aji Saka dadi ratu anyar kang adil lan wicaksana.
                  </p>
                </div>
              </div>

              {/* Babak 4 */}
              <div className="cerita-chapter-card">
                <div className="chapter-header">
                  <span className="chapter-badge">Babak 4</span>
                  <h4>⚔️ Pasulayan lan Kasetyane Dora lan Sembada</h4>
                </div>
                <div className="chapter-body">
                  <p>
                    Sawise tentrem ing Medang Kamulan, Aji Saka kelingan pusakane ing Pulo Majeti. Panjenengane ngutus <strong>Sembada</strong> supaya menyang Pulo Majeti njupuk keris kasebut.
                  </p>
                  <p>
                    Satekane ing Pulo Majeti, Sembada ketemu Dora lan ngandhakake yen Aji Saka wis dadi ratu sarta ngutus dheweke njupuk keris pusaka. Nanging Dora nolak kanthi kukuh:
                  </p>
                  <blockquote className="cerita-quote">
                    "Sembada, aku tresna marang kowe minangka sedulur. Nanging aku wis sumpah marang Gusti Aji Saka, ora bakal masrahake keris iki kajaba panjenengane dhewe sing njupuk!"
                  </blockquote>
                  <p>
                    Sembada uga ngrasa kudu ngrampungake dhawuhe ratu. Kekalihe padha-padha ngugemi amanat, saengga nuwuhake pasulayan (perang tanding) kang rame. Amarga keduwure ilmu lan sektine padha, kekalihe nemahi pralaya (mati bebarengan) ing bantala.
                  </p>
                </div>
              </div>

              {/* Babak 5 */}
              <div className="cerita-chapter-card">
                <div className="chapter-header">
                  <span className="chapter-badge">Babak 5</span>
                  <h4>📜 Miyose Aksara Hanacaraka</h4>
                </div>
                <div className="chapter-body">
                  <p>
                    Aji Saka sing nyusul menyang Pulo Majeti banget getun lan nggetuni kahanan iku. Kanggo mengeti kasetyan lan luhure bebudene abdine loro kasebut, Aji Saka nganggit rerangken 20 aksara Jawa:
                  </p>
                  <div className="cerita-verse-box">
                    <p><strong>ꦲ ꦤ ꦕ ꦫ ꦏ</strong> (Ha Na Ca Ra Ka) = <em>Ana utusan</em></p>
                    <p><strong>ꦢ ꦠ ꦱ ꦮ ꦭ</strong> (Da Ta Sa Wa La) = <em>Padha pasulayan / rebut bener</em></p>
                    <p><strong>ꦥ ꦝ ꦗ ꦪ ꦚ</strong> (Pa Dha Ja Ya Nya) = <em>Padha sektine lan kekuwatane</em></p>
                    <p><strong>ꦩ ꦒ ꦧ ꦛ ꦔ</strong> (Ma Ga Ba Tha Nga) = <em>Padha nemahi pati / dadi bathang</em></p>
                  </div>
                  <p>
                    Kisah menika kaserat ing serat kina yaiku <strong>Serat Manik Moyo</strong> anggitane Karta Mursadah (1852). Wiwit wektu iku, aksara Jawa digunakake kanggo ngrekam kawruh, sejarah, lan kabudayan luhur ing saindenging Nusantara.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: STUDIO PEMBUAT AKSARA (KETIK LATIN -> AKSARA JAWA OTOMATIS) */}
        {activeTab === 'studio' && (
          <div className="studio-container">
            <div className="aksara-section-info">
              <h3>✍️ Studio Nulis Aksara Jawa (Konverter Interaktif)</h3>
              <p>Ketik tembung utawa ukara nganggo aksara Latin, sistem bakal ngowahi kanthi otomatis dadi aksara Jawa jangkep mawi pasangan lan sandhangan!</p>
            </div>

            <div className="studio-card-box">
              <div className="studio-input-section">
                <label className="studio-input-label">
                  ⌨️ Ketik Kalimat Latin Ing Kene:
                </label>
                <textarea
                  className="studio-textarea"
                  rows={3}
                  value={studioInput}
                  onChange={(e) => setStudioInput(e.target.value)}
                  placeholder="Tuladha: mangan sega liwet, sinau aksara jawa, bapak pucung..."
                />
                
                <div className="studio-quick-chips">
                  <span>💡 Coba klik tuladha cepet:</span>
                  <button type="button" onClick={() => setStudioInput('kula sinau aksara jawa')}>
                    "kula sinau aksara jawa"
                  </button>
                  <button type="button" onClick={() => setStudioInput('mangan sega liwet')}>
                    "mangan sega liwet"
                  </button>
                  <button type="button" onClick={() => setStudioInput('bapak pucung dudu watu')}>
                    "bapak pucung dudu watu"
                  </button>
                  <button type="button" onClick={() => setStudioInput('gajah kurus')}>
                    "gajah kurus"
                  </button>
                </div>
              </div>

              {/* Tampilan Hasil Aksara Jawa Realtime */}
              <div className="studio-output-section">
                <div className="studio-output-header">
                  <span className="studio-output-title">✨ Wujud Seratan Aksara Jawa:</span>
                  <button 
                    className="btn-studio-copy"
                    onClick={handleSalinAksara}
                    disabled={!hasilAksaraStudio}
                  >
                    {copyFeedback ? '✅ Sampun Disalin!' : '📋 Salin Aksara'}
                  </button>
                </div>

                <div className="studio-result-display">
                  {hasilAksaraStudio || <span className="placeholder-text">(Asil aksara Jawa bakal metu ing kene)</span>}
                </div>

                <div className="studio-tips-box">
                  <strong>💡 Tips Ngetik:</strong>
                  <ul>
                    <li>Gunakan konsonan rangkap untuk pasangan (misal: <code>bapak tindak</code> otomatis mematikan 'k' dengan pasangan 'Ta').</li>
                    <li>Huruf vokal: <code>i</code> (wulu), <code>u</code> (suku), <code>e</code> (pepet/taling), <code>o</code> (taling tarung).</li>
                    <li>Konsonan akhir: <code>-r</code> (layar), <code>-ng</code> (cecak), <code>-h</code> (wignyan).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: KUIS KETIK AKSARA JAWA */}
        {activeTab === 'kuis' && (
          <div className="kuis-container">
            <div className="aksara-section-info">
              <h3>🎮 Kuis Ngetik Aksara Jawa</h3>
              <p>Uji ketrampilan maca aksara Jawa kanthi milih tataran/level: saka tembung dhasar, ukara sadina-dina, nganti paribasan Jawa!</p>
            </div>

            {/* Pilihan Level Kuis (Dasar -> Sedang -> Mahir) */}
            <div className="kuis-level-selector">
              <button 
                type="button"
                className={`btn-level-pill ${kuisLevel === 'dasar' ? 'active' : ''}`}
                onClick={() => handleGantiLevelKuis('dasar')}
              >
                🌱 Level 1: Kata Dasar (Gampil)
              </button>
              <button 
                type="button"
                className={`btn-level-pill ${kuisLevel === 'sedang' ? 'active' : ''}`}
                onClick={() => handleGantiLevelKuis('sedang')}
              >
                🌿 Level 2: Kalimat (Sedheng)
              </button>
              <button 
                type="button"
                className={`btn-level-pill ${kuisLevel === 'mahir' ? 'active' : ''}`}
                onClick={() => handleGantiLevelKuis('mahir')}
              >
                🌳 Level 3: Paribasan (Mahir)
              </button>
            </div>

            <div className="kuis-card-box">
              {/* Progress & Skor */}
              <div className="kuis-score-bar">
                <div className="kuis-progress-badge">
                  Level {kuisLevel.toUpperCase()} • Soal {kuisIndex + 1} saka {soalSesuaiLevel.length}
                </div>
                <div className="kuis-score-badge">
                  ⭐ Skor Sampeyan: <strong>{kuisSkor}</strong>
                </div>
              </div>

              {/* Soal Aksara Jawa yang Diperbesar */}
              <div className="kuis-display-soal">
                <div className="kuis-aksara-jawa">
                  {soalAktif.aksaraSoal}
                </div>

                {/* Tombol Kecil Bantuan: Petunjuk & Kunci Jawaban */}
                <div className="kuis-help-actions">
                  <button 
                    type="button" 
                    className={`btn-help-chip ${tampilPetunjuk ? 'active' : ''}`}
                    onClick={() => {
                      playGamelanClick();
                      setTampilPetunjuk(!tampilPetunjuk);
                    }}
                  >
                    💡 {tampilPetunjuk ? 'Tutup Petunjuk' : 'Buka Petunjuk'}
                  </button>

                  <button 
                    type="button" 
                    className={`btn-help-chip ${tampilJawaban ? 'active' : ''}`}
                    onClick={() => {
                      playGamelanClick();
                      setTampilJawaban(!tampilJawaban);
                    }}
                  >
                    👁️ {tampilJawaban ? 'Tutup Jawaban' : 'Intip Jawaban'}
                  </button>
                </div>

                {/* Area Bantuan Tampil Hanya Saat Diklik */}
                {tampilPetunjuk && (
                  <div className="kuis-hint-bubble">
                    🔍 <strong>Petunjuk:</strong> {soalAktif.petunjuk}
                  </div>
                )}

                {tampilJawaban && (
                  <div className="kuis-answer-bubble">
                    ✨ <strong>Kunci Jawaban:</strong> {soalAktif.kunciLatin[0]} <em>({soalAktif.teges})</em>
                  </div>
                )}
              </div>

              {/* Form Input Jawaban Ketik */}
              <form className="kuis-form" onSubmit={handleCekJawabanKuis}>
                <label className="kuis-label">
                  Ketik Wacan Latin ing Kene:
                </label>
                <div className="kuis-input-group">
                  <input
                    type="text"
                    className={`kuis-input ${kuisStatus}`}
                    value={kuisInput}
                    onChange={(e) => {
                      setKuisInput(e.target.value);
                      if (kuisStatus !== 'idle') setKuisStatus('idle');
                    }}
                    placeholder="Contoh: hana caraka"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="btn-kuis-submit"
                    disabled={!kuisInput.trim() || kuisStatus === 'bener'}
                  >
                    Priksa Wangsulan 🚀
                  </button>
                </div>
              </form>

              {/* Feedback Hasil */}
              {kuisStatus === 'bener' && (
                <div className="kuis-feedback-box feedback-bener">
                  <div className="feedback-icon">🎉</div>
                  <div className="feedback-text">
                    <h4>Bener Banget! Jempolan!</h4>
                    <p>Wacanan: <strong>{soalAktif.kunciLatin[0]}</strong></p>
                    <p className="feedback-meaning">Tegese: {soalAktif.teges}</p>
                  </div>
                  <button className="btn-kuis-lanjut" onClick={handleLanjutKuis}>
                    Soal Sabanjure ➡️
                  </button>
                </div>
              )}

              {kuisStatus === 'salah' && (
                <div className="kuis-feedback-box feedback-salah">
                  <div className="feedback-icon">❌</div>
                  <div className="feedback-text">
                    <h4>Kurang Trep, Ayo Coba Maneh!</h4>
                    <p>Coba priksa maneh aksara lan sandhangane, utawa klik tombol petunjuk ing ndhuwur ya.</p>
                  </div>
                </div>
              )}

              {/* Tombol Lewati / Lanjut */}
              {kuisStatus !== 'bener' && (
                <div className="kuis-nav-footer">
                  <button 
                    type="button" 
                    className="btn-kuis-skip"
                    onClick={handleLanjutKuis}
                  >
                    Lewati Soal Iki ⏩
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* POPUP / MODAL DETAIL AKSARA JIKA DIKLIK (DIPERBESAR & ADA PENJELASAN) */}
      {selectedAksara && (
        <div className="aksara-modal-overlay" onClick={() => setSelectedAksara(null)}>
          <div className="aksara-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="aksara-modal-close" 
              onClick={() => setSelectedAksara(null)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="aksara-modal-header">
              <span className="aksara-modal-badge">Aksara Nglegena</span>
              <h2>Aksara {selectedAksara.name}</h2>
            </div>

            {/* Simbol Diperbesar */}
            <div className="aksara-modal-symbol-box">
              <span className="aksara-modal-symbol">{selectedAksara.char}</span>
            </div>

            {/* Penjelasan Detail */}
            <div className="aksara-modal-details">
              <div className="detail-row">
                <span className="detail-title">📖 Makna Filosofi:</span>
                <span className="detail-value">{selectedAksara.desc} - <em>{selectedAksara.makna}</em></span>
              </div>
              <div className="detail-row">
                <span className="detail-title">✏️ Tuladha Tembung:</span>
                <span className="detail-value highlight">{selectedAksara.tuladha}</span>
              </div>
            </div>

            <button className="btn-modal-done" onClick={() => setSelectedAksara(null)}>
              Sampun Paham 👍
            </button>
          </div>
        </div>
      )}

      {/* POPUP / MODAL DETAIL PASANGAN JIKA DIKLIK (DIPERBESAR & ADA PENJELASAN) */}
      {selectedPasangan && (
        <div className="aksara-modal-overlay" onClick={() => setSelectedPasangan(null)}>
          <div className="aksara-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="aksara-modal-close" 
              onClick={() => setSelectedPasangan(null)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="aksara-modal-header">
              <span className="aksara-modal-badge">Pasangan Aksara Jawa</span>
              <h2>{selectedPasangan.name}</h2>
            </div>

            {/* Simbol Diperbesar (Menampilkan Pasangan & Aksara Induk) */}
            <div className="aksara-modal-symbol-box pasangan-modal-box">
              <span className="aksara-modal-symbol">{selectedPasangan.char}</span>
            </div>

            {/* Penjelasan Detail Pasangan */}
            <div className="aksara-modal-details">
              <div className="detail-row">
                <span className="detail-title">🔤 Aksara Induk:</span>
                <span className="detail-value highlight">
                  {selectedPasangan.induk} ({selectedPasangan.name.replace('Pasangan ', '')})
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">📍 Panggonan Panyeratan:</span>
                <span className="detail-value">
                  <span className={`badge-letak ${selectedPasangan.letak.includes('Tengen') ? 'badge-tengen' : 'badge-ngisor'}`}>
                    {selectedPasangan.letak}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">✏️ Tuladha Tembung & Panggathuk:</span>
                <span className="detail-value highlight">{selectedPasangan.contoh}</span>
              </div>
              <div className="detail-row">
                <span className="detail-title">📝 Katerangan & Paugeran:</span>
                <span className="detail-value">{selectedPasangan.katrangan}</span>
              </div>
            </div>

            <button className="btn-modal-done" onClick={() => setSelectedPasangan(null)}>
              Sampun Paham 👍
            </button>
          </div>
        </div>
      )}

      {/* POPUP / MODAL DETAIL SANDHANGAN JIKA DIKLIK (DIPERBESAR & ADA PENJELASAN) */}
      {selectedSandhangan && (
        <div className="aksara-modal-overlay" onClick={() => setSelectedSandhangan(null)}>
          <div className="aksara-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="aksara-modal-close" 
              onClick={() => setSelectedSandhangan(null)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="aksara-modal-header">
              <span className="aksara-modal-badge">{selectedSandhangan.kategori}</span>
              <h2>Sandhangan {selectedSandhangan.nama}</h2>
            </div>

            {/* Simbol Sandhangan Diperbesar */}
            <div className="aksara-modal-symbol-box sandhangan-modal-box">
              <span className="aksara-modal-symbol sandhangan-symbol-accent">{selectedSandhangan.aksara}</span>
            </div>

            {/* Penjelasan Detail Sandhangan */}
            <div className="aksara-modal-details">
              <div className="detail-row">
                <span className="detail-title">🔊 Swanten / Uni:</span>
                <span className="detail-value highlight">
                  {selectedSandhangan.unine}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-title">📍 Panggonan Panyeratan:</span>
                <span className="detail-value">{selectedSandhangan.panggonan}</span>
              </div>
              <div className="detail-row">
                <span className="detail-title">✏️ Tuladha Panyeratan:</span>
                <span className="detail-value highlight">{selectedSandhangan.tuladha}</span>
              </div>
              <div className="detail-row">
                <span className="detail-title">📖 Kagunan & Paugeran:</span>
                <span className="detail-value">{selectedSandhangan.kegunaan}</span>
              </div>
            </div>

            <button className="btn-modal-done" onClick={() => setSelectedSandhangan(null)}>
              Sampun Paham 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
