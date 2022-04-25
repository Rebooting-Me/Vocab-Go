var loc = window.location.href //Fetches the current location


window.addEventListener('mouseup', wordSelected)

function wordSelected() {
  let word = window.getSelection().toString().trim();
  console.log(word)
  if(word.length > 0){
    let message = {
      text: word
    }
    chrome.runtime.sendMessage(message);
  }
}