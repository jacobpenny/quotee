# Quotee

Simple Chrome extension for keeping track of snippets of text from around the web. It is mostly an excuse to play with
[cycle.js](http://cycle.js.org/) and [RxJS](https://github.com/Reactive-Extensions/RxJS) but I've found it useful. Syncs across devices by using Chrome's storage.sync API.

## Development

Install the dependencies:
```
npm install
```

### Test

```
npm test
```
or to watch files and run tests automatically:
```
npm run test:watch
```

### Build
```
npm run build
```
or to watch files and build automatically:
```
npm run build:watch
```

### Publish
This will create a .zip file which can be uploaded to the Chrome webstore.
```
npm run publish
```

### Known issues

After installation or reloading of the extension open tabs need to be refreshed to inject the content script.

### TODO

Handle storage limitations gracefully
