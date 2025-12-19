const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data.json');

function load() {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
