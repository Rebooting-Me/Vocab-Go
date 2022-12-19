chrome.runtime.onMessage.addListener(receiver)


function receiver(request, sender, sendResponse) {
  console.log(request)
  selectedWord = request.text
  console.log(selectedWord)
}

