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
    const bottom = request.bottom;
    const left = request.left;

    let audio = [];
    // to check if audio file is present
    for (let i = 0; i < result.phonetics.length; i++) {
      if (result.phonetics[i].audio !== undefined) {
        audio.push(result.phonetics[i].audio);
      }
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles.css");
    document.head.appendChild(link);
    
    const popupHTML = document.createElement("div");
    popupHTML.innerHTML = `
        <div class="header_acha">
            <div style="display: flex; justify-content: space-between;">
                <p id="p1_acha">${selectedWord}</p>
                <button id="button1_acha"><img style="width: 1.8rem;" src=${chrome.runtime.getURL(
                  "cancel.svg"
                )} alt="image" ></button>
            </div>
            <div class="details_wrapper_acha" style="display: flex;">
                <div class="details_acha">
                  <div class="phonetic_acha"><a class="pehla_anchor_acha" href=${
                    result.sourceUrl
                  } target="blank">${result.phonetics[0].text}</a></div>
                  <div class="phonetic_acha"><a class="pehla_anchor_acha" href=${
                    result.sourceUrl
                  } target="blank">${result.meanings[0].partOfSpeech}</a></div>
                </div>
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

    const close = document.querySelector("#button1_acha");
    close.addEventListener("mouseup", () => {
      const selection = window.getSelection();
      selection.removeAllRanges();
      popupHTML.remove();
      window.removeEventListener("scroll", null);
    });

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


{/* <button id="button2_acha"><img src=${chrome.runtime.getURL(
                  "speaker.svg"
)} alt="speaker-image"></button> */}