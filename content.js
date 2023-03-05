// Listen to the selected word
document.addEventListener('mouseup', (event) => {
  const selectedWord = window.getSelection().toString().trim();
  if (selectedWord.length > 0) {
    // Send the selected word to the background script
    chrome.runtime.sendMessage({ type: 'word_selected', word: selectedWord });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'display_popup') {
    const selectedWord = request.word;
    const result = request.result;
    console.log(selectedWord);
    console.log(result);
    // Display the selected word in a popup on the current webpage
    // You can use the DOM API to create the popup and display the word
    // ...

    const styles = `
      /* Insert your CSS styles here */
.container {
    background-color: transparent;
    border: 3px solid black;
    max-width: 400px;
    height: 350px;
    border-radius: 20px;
    box-shadow: 5px 5px 20px black;
}

.header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    border-radius: 16px 16px 0 0;
    padding: 0px 8px 0 8px;
    box-shadow: 0px 4px 6px -2px rgba(0,0,0,0.75);
    color: black;
}
    `;

    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    const popupHTML = document.createElement('div');
    popupHTML.innerHTML = `
      <main class="container">
        <div class="header" style="max-width: 100%; max-height: fit-content; background-color: white;">
            <h1 style="font-weight: bold; padding: 0; margin-top: 0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${selectedWord}</h1>            
            <div class="details" style="display:flex; gap: 20px; margin-bottom: 8px">
                <div class="phonetic" style="box-shadow: 3px 3px 10px -3px rgba(0,0,0,0.75); max-width: fit-content; border: 1px solid black; padding: 2px 4px; border-radius: 0 8px 0 8px;">${result.phonetics[0].text}</div>
                <div class="phonetic" style="box-shadow: 3px 3px 10px -3px rgba(0,0,0,0.75); max-width: fit-content; border: 1px solid black; padding: 2px 4px; border-radius: 0 8px 0 8px;">${result.meanings[0].partOfSpeech}</div>
            </div>
        </div>
        <div id="line" style="width: 100%; border: 1.5px solid black;"></div>
    </main>
    `;
    document.body.appendChild(popupHTML);
  }
});
