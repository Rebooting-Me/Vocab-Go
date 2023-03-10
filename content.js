// color palette dark:#5B3758; less dark:#C65B7C; light:#F9627D; lighter:#F9ADA0; green:#83B692

// Listen to the selected word
document.addEventListener("mouseup", (event) => {
  const selectedWord = window.getSelection().toString().trim();
  const selection = window.getSelection();

  if (
    !selection.isCollapsed &&
    /\S/.test(selection.toString()) &&
    selectedWord.length > 0
  ) {
    console.log("selection:", selection);
    const range = selection.getRangeAt(0);
    console.log("range:", range);
    const rect = range.getBoundingClientRect();
    console.log("rect:", rect);
    // Send the selected word to the background script
    chrome.runtime.sendMessage({
      type: "word_selected",
      word: selectedWord,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "display_popup") {
    const selectedWord = request.word;
    const result = request.result;
    const top = request.top;
    const bottom = request.bottom;
    const left = request.left;
    console.log(selectedWord);
    // Display the selected word in a popup on the current webpage
    // You can use the DOM API to create the popup and display the word
    // ...

    const styles = `
      .popupHTML {
          position: fixed;
          background-color: #1A1E27;
          border: 3px solid black;
          max-width: 450px;
          max-height: auto;
          border-radius: 20px;
          box-shadow: 5px 5px 20px black;
          z-index: 100000;
      }

      .header_acha {
          display: flex;
          justify-content: center;
          flex-direction: column;
          border-radius: 16px;
          padding: 0 8px 0 10px;
          color: black;
          max-width: 100%;
          max-height: auto;
          background-color: white;
          box-shadow: 5px 5px 20px black;
      }
      .details_acha{
        display:flex;
        gap: 20px;
        margin: 0 0 8px 0;
      }
      .phonetic_acha {
        box-shadow: 3px 3px 10px -3px rgba(0,0,0,0.75);
        max-width: fit-content;
        border: 1px solid black;
        padding: 0 4px;
        border-radius: 0 8px 0 8px;
        font-size: medium;
        transition: transform 0.1s ease-in-out;
      }
      .phonetic_acha:hover {
        transform: translateY(-3px) !important;
        color: #C65B7C !important;
      }
      .pehla_anchor_acha {
        text-decoration: none;
        color: inherit
      }
      .pehla_anchor_acha:hover {
        text-decoration: none;
      }
      #p1_acha {
        font-size: xx-large;
        font-weight: bold;
        padding: 0;
        margin-top: 0;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      #p2_acha {
        color: white;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: large;
        font-weight: bold;
        margin: 0;
        padding: 5px 0 0 10px;
        max-width: fit-content;
      }
      .middle_acha {
        margin-top: 2px;
        max-width: fit-content;
        max-height: fit-content;
        padding: 0 10px 10px 10px;
      }
      #p3_acha {
        color: white;
        font-size: large;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      #button1_acha {
        transition: 0.1s ease-in-out;
        margin: 0 0 20px 20px;
        padding: 0;
        text-decoration:none;
        border: none;
        background-color: transparent;
      }
      #button1_acha:hover {
        transform: scale(1.11) !important;
      }
      #button1_acha:active {
        transform: translateY(3px) !important;
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    const popupHTML = document.createElement("div");
    popupHTML.innerHTML = `
        <div class="header_acha">
            <div style="display: flex; justify-content: space-between;">
                <p id="p1_acha">${selectedWord}</p>
                <button id="button1_acha"><img style="width: 1.8rem;" src=${chrome.runtime.getURL(
                  "cancel.svg"
                )} alt="image" ></button>
            </div>          
            <div class="details_acha">
                <div class="phonetic_acha"><a class="pehla_anchor_acha" href=${
                  result.sourceUrl
                } target="blank">${result.phonetics[0].text}</a></div>
                <div class="phonetic_acha"><a class="pehla_anchor_acha" href=${
                  result.sourceUrl
                } target="blank">${result.meanings[0].partOfSpeech}</a></div>
            </div>
        </div>
        <div>
          <p id="p2_acha">Definition :</p>
          <div class="middle_acha">
              <p id="p3_acha">${result.meanings[0].definition}</p>
          </div>
        </div>
    `;
    
    popupHTML.classList.add("popupHTML");
    popupHTML.appendChild(styleElement);
    document.body.appendChild(popupHTML);

    // Get the dimensions of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the position of the popup relative to the viewport
    const popupWidth = popupHTML.offsetWidth;
    const popupHeight = popupHTML.offsetHeight;
    const popupTop = bottom + 10; // Add some padding between the selected word and the popup
    const popupLeft = left - popupWidth / 2;

    // Check if the popup goes outside the viewport and adjust it if needed
    if (popupLeft < 0) {
      popupHTML.style.left = 0;
    } else if (popupLeft + popupWidth > viewportWidth) {
      popupHTML.style.left = viewportWidth - popupWidth + "px";
    } else {
      popupHTML.style.left = popupLeft + "px";
    }

    if (popupTop + popupHeight > viewportHeight) {
      popupHTML.style.top = viewportHeight - popupHeight + "px";
    } else {
      popupHTML.style.top = popupTop + "px";
    }

    const close = document.querySelector('#button1_acha');
    close.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      selection.removeAllRanges();
      popupHTML.remove();
      window.removeEventListener("scroll", null);
    })

    // Remove the popup when the user clicks outside of it
    document.addEventListener("click", function (event) {
      if (!popupHTML.contains(event.target)) {
        popupHTML.remove();
        window.removeEventListener("scroll", null);
      }
    });
  }
});

let timeoutID = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "reset_timeout") {
    console.log("resetting timeout");
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      chrome.runtime.sendMessage({ type: "clear_cache" });
    }, 1000 * 60 * 5); // Clear cache after 5 minutes of inactivity
  }
});