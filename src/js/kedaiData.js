// ==========================================================================
// KEDAI OYEN: edit this file to update the shop and the donation section.
// ==========================================================================
//
// Links must start with https:// (anything else is ignored for safety).
// Leave a link as '' and the button shows "Link akan datang" until you fill it.

export const DONATION = {
  // Put your DuitNow QR image at public/belanja/duitnow-qr.png (square PNG/JPG).
  // Set to '' to hide the QR box.
  qrImage: 'belanja/duitnow-qr.png',
  qrName: '', // optional: the account name people see when they scan
  // Short reassurance shown under the steps ('' to hide).
  qrNote: 'Bila scan, nama penerima yang keluar ialah pembuat website Oyen. Normal, bukan scam 😹',
  // Optional extra ways to support. Remove any you don't use.
  links: [
    { label: 'Ko-fi', icon: '☕', url: '' },
    { label: 'Touch ’n Go eWallet', icon: '💙', url: '' },
  ],
  // What supporters "buy" for Oyen. Shown as fun tiers. They're just labels;
  // the person enters the amount in their banking app.
  tiers: [
    { amount: 'RM3', label: 'Seekor ikan bilis', emoji: '🐟' },
    { amount: 'RM5', label: 'Ikan kembung goreng', emoji: '🍽️' },
    { amount: 'RM10', label: 'Ikan goreng mak (premium)', emoji: '👑' },
    { amount: 'RM20', label: 'Satu tin tuna. Oyen terharu.', emoji: '🥹' },
  ],
};

export const CATEGORIES = [
  { id: 'makanan', label: 'Makanan', emoji: '🍗' },
  { id: 'pasir', label: 'Pasir & Tandas', emoji: '🚽' },
  { id: 'mainan', label: 'Mainan', emoji: '🧶' },
  { id: 'rehat', label: 'Tidur & Rehat', emoji: '😴' },
];

// Affiliate products. Use your Shopee Affiliate (or other) links in `url`.
// `image` is optional: put a file in public/kedai/ and use 'kedai/name.jpg'.
// Without an image, the big emoji is shown.
export const PRODUCTS = [
  {
    name: 'Makanan kering kucing dewasa',
    category: 'makanan',
    emoji: '🥣',
    review: 'Bukan ikan goreng, tapi boleh la. Aku makan sambil pandang dapur.',
    rating: 8,
    url: '',
    image: '',
  },
  {
    name: 'Wet food tuna (tin)',
    category: 'makanan',
    emoji: '🥫',
    review: 'Bunyi tin dibuka = lagu kebangsaan aku.',
    rating: 10,
    url: '',
    image: '',
  },
  {
    name: 'Snek kucing (treats)',
    category: 'makanan',
    emoji: '🍬',
    review: 'Aku buat muka comel, kau bagi ni. Deal.',
    rating: 9,
    url: '',
    image: '',
  },
  {
    name: 'Pasir kucing tofu',
    category: 'pasir',
    emoji: '🪣',
    review: 'Senang gali. Senang sepah satu rumah jugak.',
    rating: 8,
    url: '',
    image: '',
  },
  {
    name: 'Bekas tandas bertutup',
    category: 'pasir',
    emoji: '🚪',
    review: 'Privasi penting. Aku pun ada maruah.',
    rating: 7,
    url: '',
    image: '',
  },
  {
    name: 'Mainan bulu (teaser wand)',
    category: 'mainan',
    emoji: '🪶',
    review: 'Aku tahu tu kau yang gerak. Tapi aku tetap kejar.',
    rating: 9,
    url: '',
    image: '',
  },
  {
    name: 'Laser pointer',
    category: 'mainan',
    emoji: '🔴',
    review: 'Titik merah tu musuh negara. Satu hari nanti aku tangkap.',
    rating: 10,
    url: '',
    image: '',
  },
  {
    name: 'Papan cakar (scratcher)',
    category: 'mainan',
    emoji: '🪵',
    review: 'Aku guna ni. Kadang-kadang. Sofa lagi sedap.',
    rating: 6,
    url: '',
    image: '',
  },
  {
    name: 'Katil kucing donut',
    category: 'rehat',
    emoji: '🍩',
    review: 'Aku tidur 20 jam sehari. Benda ni pelaburan.',
    rating: 10,
    url: '',
    image: '',
  },
  {
    name: 'Air pancut kucing (fountain)',
    category: 'rehat',
    emoji: '⛲',
    review: 'Air mangkuk biasa? Aku bukan kucing kampung. Okay aku kucing kampung.',
    rating: 8,
    url: '',
    image: '',
  },
];
