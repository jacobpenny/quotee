chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    const selection = window.getSelection()
    if (selection.rangeCount) {
      const container = document.createElement('div')
      for (var i = 0, len = selection.rangeCount; i < len; ++i) {
        container.appendChild(selection.getRangeAt(i).cloneContents())
      }
      sendResponse(container.innerHTML)
    } else {
      sendResponse(null)
    }
  }
)
