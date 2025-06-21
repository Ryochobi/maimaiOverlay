const fs = require('fs');
const https = require('https');
const http = require('http');
const config = require('./config');

// === CONFIGURATION ===
const jsonUrl = config.zetarakuURL; 
const outputFile = config.outputFile;
const propertyToExtract = 'songs'; // Property to extract

// === FUNCTION TO FETCH JSON ===
function fetchJson(url, callback) {
  const protocol = url.startsWith('https') ? https : http;

  protocol.get(url, (res) => {
    let data = '';

    if (res.statusCode !== 200) {
      callback(new Error(`Request failed. Status code: ${res.statusCode}`));
      return;
    }
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        callback(null, json);
      } catch (err) {
        callback(new Error('Invalid JSON received'));
      }
    });
  }).on('error', (err) => {
    callback(err);
  });
}

function filterSongsByLevel(data, minLevel, maxLevel) {
  return data.flatMap(song => {
    return song.sheets
      .filter(sheet => {
        const level = sheet.internalLevelValue;
        return level >= minLevel && level <= maxLevel;
      })
      .map(sheet => (
        {
        id: song.songId,
        values: {
          ...song,
          ...sheet,
          songId: undefined,
          sheets: undefined,
          isNew: undefined,
          comment: undefined,
          releaseDate: undefined,
          regions: undefined,
          regionOverrides: undefined,
          isSpecial: undefined,
          levelValue: undefined
        }
      }));
  });
}

fetchJson(jsonUrl, (err, data) => {
  if (err) {
    console.error('❌ Error:', err.message);
    return;
  }

  if (!Array.isArray(data[propertyToExtract])) {
    console.error('❌ Expected JSON to be an array');
    return;
  }

  console.log(filterSongsByLevel(data[propertyToExtract],config.minLevel, config.maxLevel))
  let songData = filterSongsByLevel(data[propertyToExtract],config.minLevel, config.maxLevel).filter(song => config.difficulties.includes(song.values.difficulty) ||
    song.values.type == 'utage');

  fs.writeFileSync(outputFile, JSON.stringify(songData, null, 2));
  console.log(`✅ Extracted "${propertyToExtract}" from ${jsonUrl} items into ${outputFile}`);
});
