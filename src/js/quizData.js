// Quiz content. Each option awards points to one or more result types.
// To add a question: push another { q, options: [{ text, pts: { type: n } }] }.

export const RESULTS = {
  samseng: {
    title: 'Oyen Samseng',
    mood: 'samseng',
    quote: '"Ini kawasan aku. Kau siapa?"',
    desc:
      'Ketua kawasan taman perumahan. Semua kucing jiran bayar "yuran perlindungan" dalam bentuk ikan bilis. Telinga koyak sikit, tapi itu tanda pengalaman. Jalan senget sebab dia nak, bukan sebab sakit.',
    basePower: 8000,
    stats: { Kesamsengan: 99, Kemanjaan: 12, Kelaparan: 70, 'Sel Otak': 40 },
  },
  manja: {
    title: 'Oyen Manja',
    mood: 'manja',
    quote: '"Usap aku. Sekarang. Okay cukup. GIGIT."',
    desc:
      'Nampak comel, gesel kaki, golek-golek minta usap perut. Tapi ingat: perut tu perangkap. Tiga kali usap boleh, kali keempat kau kena gigit manja. Sayang kau, tapi lebih sayang tuna.',
    basePower: 3000,
    stats: { Kesamsengan: 25, Kemanjaan: 100, Kelaparan: 65, 'Sel Otak': 45 },
  },
  pencuri: {
    title: 'Oyen Pencuri Ikan',
    mood: 'pencuri',
    quote: '"Ikan apa? Aku tak nampak pun ikan."',
    desc:
      'Ninja dapur yang paling dikehendaki. Mak pusing belakang 0.5 saat, ikan goreng hilang. Bukti? Tiada. Mulut berminyak? Kebetulan. Pakar strategi tahap Sun Tzu, tapi cuma untuk satu benda: makanan.',
    basePower: 7000,
    stats: { Kesamsengan: 60, Kemanjaan: 35, Kelaparan: 100, 'Sel Otak': 75 },
  },
  tidur: {
    title: 'Oyen Tidur 20 Jam',
    mood: 'tidur',
    quote: '"Jangan kacau, aku tengah recharge."',
    desc:
      'Atlet tidur bertaraf Olimpik. Boleh tidur atas lantai, dalam kotak, atas laptop, dalam sinki. Bangun cuma untuk makan, lepas tu tidur balik sebab penat makan. Hidup dia lagi tenang dari hidup kau.',
    basePower: 2000,
    stats: { Kesamsengan: 10, Kemanjaan: 55, Kelaparan: 50, Kemalasan: 100 },
  },
  drama: {
    title: 'Oyen Drama Queen',
    mood: 'drama',
    quote: '"MIAAAAAW!!! (dia ok je sebenarnya)"',
    desc:
      'Pelakon utama drama Melayu pukul 7. Mangkuk separuh kosong? Tragedi. Pintu tertutup? Penderaan. Terpijak ekor sikit? Merajuk tiga hari, lepas tu buat-buat tak kenal kau. Layak dapat Anugerah Skrin.',
    basePower: 5000,
    stats: { Kesamsengan: 45, Kemanjaan: 70, Drama: 100, 'Sel Otak': 30 },
  },
  otak: {
    title: 'Oyen Satu Sel Otak',
    mood: 'otak',
    quote: '"..." *tenung dinding kosong 40 minit*',
    desc:
      'Hari ni giliran dia pegang sel otak kongsi semua kucing oren. Malangnya dia tertinggal kat mana entah. Lari langgar dinding, kejar ekor sendiri, masuk kotak yang terlalu kecil. Tapi dia bahagia, dan itu yang penting.',
    basePower: 1,
    powerLabel: '1 (tapi yakin)',
    stats: { Kesamsengan: 40, Kemanjaan: 80, Kelaparan: 85, 'Sel Otak': 1 },
  },
};

export const QUESTIONS = [
  {
    q: 'Pukul 5 pagi. Oyen kau tengah buat apa?',
    options: [
      { text: 'Jerit "MIAAAW" depan pintu bilik macam kena rompak', pts: { drama: 2 } },
      { text: 'Tidur. Obviously. Dia tak pernah bangun sebelum tengah hari', pts: { tidur: 2 } },
      { text: 'Lari satu rumah macam kena kejar hantu, lepas tu langgar dinding', pts: { otak: 2 } },
      { text: 'Baru balik "meeting" dengan kucing taman sebelah. Telinga koyak sikit', pts: { samseng: 2 } },
    ],
  },
  {
    q: 'Mak tengah goreng ikan kat dapur. Oyen kau...',
    options: [
      { text: 'Dah standby atas kabinet. Mata tak berkelip langsung', pts: { pencuri: 2 } },
      { text: 'Gesel kaki mak sambil "meow" manja. Minta sikit je', pts: { manja: 2 } },
      { text: 'Tunggu mak pusing belakang 0.5 saat. Ikan hilang.', pts: { pencuri: 2, samseng: 1 } },
      { text: 'Tak sedar pun. Tengah tidur dalam bakul kain', pts: { tidur: 2 } },
    ],
  },
  {
    q: 'Kucing jiran masuk kawasan rumah. Reaksi Oyen?',
    options: [
      { text: 'Kembang bulu, jalan senget: "WOI, INI KAWASAN AKU"', pts: { samseng: 2 } },
      { text: 'Lari sembunyi belakang kau, lepas tu marah kau sebab tak lindung dia', pts: { drama: 2 } },
      { text: 'Ajak main. Lepas tu lupa itu kucing siapa', pts: { otak: 2, manja: 1 } },
      { text: 'Tengok sekejap, menguap, sambung tidur', pts: { tidur: 2 } },
    ],
  },
  {
    q: 'Kau balik kerja. Macam mana Oyen sambut kau?',
    options: [
      { text: 'Lari datang, golek-golek, minta usap perut (lepas tu gigit)', pts: { manja: 2 } },
      { text: 'Pandang dari jauh macam bos tengok staf datang lambat', pts: { samseng: 2 } },
      { text: 'Tunjuk mangkuk kosong: "Woi, mana makanan aku?"', pts: { pencuri: 2 } },
      { text: 'Tak perasan pun. Dia tengah tenung dinding kosong', pts: { otak: 2 } },
    ],
  },
  {
    q: 'Kau bagi makanan kering biasa, bukan wet food. Apa jadi?',
    options: [
      { text: 'Pandang kau dengan muka "kau ingat aku ni siapa?"', pts: { drama: 2 } },
      { text: 'Makan habis, lepas tu pergi curi makanan kucing lain', pts: { pencuri: 2 } },
      { text: 'Makan sambil tidur. Ya, dia boleh buat dua-dua serentak', pts: { tidur: 2 } },
      { text: 'Makan, muntah, makan balik. Bangga.', pts: { otak: 2 } },
    ],
  },
  {
    q: 'Tempat tidur kegemaran Oyen?',
    options: [
      { text: 'Atas laptop kau, masa kau tengah meeting Zoom', pts: { manja: 2 } },
      { text: 'Atas peti ais, supaya boleh pantau seluruh empayar (dan peti ais)', pts: { samseng: 2, pencuri: 1 } },
      { text: 'Mana-mana. Lantai, kotak, sinki. Dia tak memilih', pts: { tidur: 2 } },
      { text: 'Dalam kotak yang terlalu kecil untuk badan dia', pts: { otak: 2 } },
    ],
  },
  {
    q: 'Kau tak sengaja terpijak ekor Oyen. Respon dia?',
    options: [
      { text: 'Menjerit macam drama pukul 7, lepas tu merajuk 3 hari', pts: { drama: 2 } },
      { text: 'Terus cakar balik. Hutang darah dibayar darah', pts: { samseng: 2 } },
      { text: 'Dia pulak yang datang minta maaf, lepas tu manja-manja', pts: { manja: 2 } },
      { text: 'Dia pun tak tahu itu ekor dia', pts: { otak: 2 } },
    ],
  },
  {
    q: 'Kalau Oyen kau ada Instagram, bio dia apa?',
    options: [
      { text: 'Ketua Taman Seri Oyen 😎 | DM untuk rundingan ikan', pts: { samseng: 2 } },
      { text: 'Professional ikan goreng taster 🐟 | Dapur mak = dapur aku', pts: { pencuri: 2 } },
      { text: 'Aku sayang kau... bila ada makanan 🥺🧡', pts: { manja: 2 } },
      { text: 'Hidup aku penuh tragedi 😭 | Mangkuk separuh kosong', pts: { drama: 2 } },
    ],
  },
];
