let words = [
  "spam",
  "yiban"
];

module.exports = {
  getWords: () => words,
  addWord: (word) => {
    if (!words.includes(word.toLowerCase())) words.push(word.toLowerCase());
  },
  removeWord: (word) => {
    words = words.filter(w => w !== word.toLowerCase());
  }
};
