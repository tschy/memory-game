
// to better memorize the repetitive Teth, Meth, Seth, Leth words,
// think of "Thomas Moore's solemn lines" or "too much silly laughter".
const sheepNames = [
    "Yan", "Tyan", "Tethera", "Methera", "Pimp",
    "Sethera", "Lethera", "Hovera", "Dovera", "Dik",
];

const flowerWords = [
    "Lily", "Rose", "Tulip", "Dahlia",
    "Iris", "Hibiscus", "Hortensia", "Calla Lily",
    "Sunflower", "Peony", "Orchid", "Daisy",
    "Magnolia", "Daffodil", "Lilac"
];

const happyWords = [
    "flow", "joy", "fun", "thrill", "love", "smile",
    "peace", "hope", "charm", "glow", "grace", "cheer",
    "bliss", "pride", "faith", "light", "trust", "zeal",
    "calm", "glee", "warmth", "dream", "shine", "kind",
];

const allWords = [sheepNames, flowerWords, happyWords];

export function getWords(num: number) {
    return allWords.filter((list) => list.length >= num)[0];
}