import Rx from 'rx'

function chromeStorageDriver(writeEffects$) {
  writeEffects$.subscribe((writeEffects) => _writeToStorage(writeEffects))
  const storageGet = Rx.Observable.fromCallback(chrome.storage.sync.get, chrome.storage.sync)

  return {
    getState$,
    get: storageGet
  }
}

function _writeToStorage(writeEffects) {
  _.each(writeEffects, effect => {
    if (effect.type === 'remove') {
      chrome.storage.sync.remove(effect.keys)
    }
    if (effect.type === 'set') {
      chrome.storage.sync.set(effect.items)
    }
  })
}


function getState$(key) {
  const storageGet = Rx.Observable.fromCallback(chrome.storage.sync.get, chrome.storage.sync)
  const state$ = Rx.Observable.fromEventPattern(
    (h) => {
      chrome.storage.onChanged.addListener(h)
    },
    (h) => {},
    (changes, namespace) => {
      return changes
    }
  )
  .filter(changes => key in changes)
  .map(changes => {
    return {[key]: changes[key].newValue}
  })
  .merge(storageGet(key))

  return state$
}

export default chromeStorageDriver
