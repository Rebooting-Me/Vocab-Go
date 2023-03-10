chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'word_selected') {
    const selectedWord = request.word;
    const top = request.top;
    const bottom = request.bottom;
    const left = request.left;
    console.log(selectedWord)
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + selectedWord)
      .then(response => response.json())
      .then(data => {
        const meanings = [];
        data.forEach((entry) => {
          entry.meanings.forEach((meaning) => {
            const definition = meaning.definitions.reduce(
              (longest, current) =>
                current.definition.length > longest.length
                  ? current.definition
                  : longest,
              ""
            );
            meanings.push({ partOfSpeech: meaning.partOfSpeech, definition });
          });
        });

        const phonetics = [];
        data.forEach((entry) => {
          const text = entry.phonetic;
          phonetics.push({ text });
        });
        data.forEach((entry) => {
          entry.phonetics.forEach((phonetic) => {
            const audio =
              phonetic.audio ||
              (entry.phonetics.length > 1 ? entry.phonetics[1].audio : "");
            phonetics.push({ audio });
          });
        });
        
        const sourceUrl = data[0].sourceUrls[0];
        const result = { phonetics, meanings, sourceUrl};
        // Send the selected word data back to the content script to display in a popup
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'display_popup', result: result, word: selectedWord, top: top, bottom: bottom, left: left});
        });
      })
      .catch(error => console.error(error));
    
  }
});