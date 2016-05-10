import cleanHtml from './lib/cleanHtml'

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.create({url: 'src/quotes.html'})
});

chrome.contextMenus.create({
  title: 'Save to Quotee',
  type: 'normal',
  contexts: ['selection'],
  onclick: requestSelectedHTMLFromTabAndPersist
});

function appendToQuoteIds(id) {
  chrome.storage.sync.get('quoteIds', (res) => {
    const newQuoteIds = res.quoteIds || []
    newQuoteIds.push(id)
    chrome.storage.sync.set({quoteIds: newQuoteIds})
  })
}

function buildQuote(title, url, html, date) {
  return {
    title,
    url,
    html,
    ISODateString: date.toISOString(),
    localeDateString: date.toLocaleDateString(),
    localeTimeString: date.toLocaleTimeString(),
    id: 'q' + date.getTime().toString()
  }
}

function requestSelectedHTMLFromTabAndPersist(info, tab) {
  chrome.tabs.sendMessage(tab.id, {info: info}, (html) => {
    if (!html) return
    const quote = buildQuote(tab.title, tab.url, cleanHtml(html), new Date())
    chrome.storage.sync.set({[quote.id]: quote}, () => {
      appendToQuoteIds(quote.id)
    });
  })
}
