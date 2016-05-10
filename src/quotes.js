import 'purecss/build/pure-min.css'
import './style.css'

import _ from 'lodash'
import {run} from '@cycle/core'
import {makeDOMDriver, div, p, span, a, h2, b} from '@cycle/dom'
import chromeStorageDriver from './lib/chromeStorageDriver'

function makeQuoteListVTree(quotes) {
  const quoteList = quotes.map((q) => {
    return div('.pure-u-1-1 .quote-container', [
      div('.quote-box', [
        div('.pure-g', [
          div('.pure-u-23-24 .quote-text', {innerHTML: q.html}),
          div('.pure-u-1-24 .delete-quote-bar', [
            span('.delete-quote', {attributes: {id: q.id}}, '✖')
          ]),
          div('.pure-u-1-1', [
            span(q.title)
          ]),
          div('.pure-u-4-5', [
            a('.quote-link', {attributes: {target: '_blank', href: q.url}}, q.url)
          ]),
          div('.pure-u-1-5 .date-box', [
            span(`${q.localeDateString} @ ${q.localeTimeString}`)
          ])
        ])
      ])
    ])
  })

  return div(quoteList)
}

function makeNoQuotesVTree() {
  return div('.no-quotes-container',
    p('You don\'t have any quotes! Select some text, right click, and choose ' +
      '\'Save to Quotee\' to get some!')
  )
}

function main({DOM, storage}) {
  const quoteIds$ = storage.getState$('quoteIds').map(res => res.quoteIds)
  const state$ = quoteIds$.flatMap(quoteIds => {
    return storage.get(quoteIds)
  })

  const vtree$ = state$.map(state => {
    const quotes = _.chain(state).values().filter(obj => obj.html).value()
    const headerVTree =
      div('.pure-g .header', [
        div('.pure-u-1-2', h2('quotee')),
        div('.pure-u-1-2', b('.delete-all', 'Delete All'))
      ])

    return div([
      headerVTree,
      quotes.length ? makeQuoteListVTree(quotes) : makeNoQuotesVTree()
    ])
  })

  const deleteQuote$ = DOM.select('.delete-quote').events('click').withLatestFrom(
    state$,
    (ev, state) => {
      const id = ev.target.getAttribute('id')
      const newQuoteIds = _.pull(_.keys(state), id)
      return [
        {
          type: 'remove',
          keys: [id]
        },
        {
          type: 'set',
          items: {
            quoteIds: newQuoteIds
          }
        }
      ]
    }
  )
  const deleteAll$ = DOM.select('.delete-all').events('click').withLatestFrom(
    state$,
    (ev, state) => {
      if (_.keys(state).length && window.confirm('Are you sure you want to delete all your quotes?')) {
        return [
          {
            type: 'remove',
            keys: _.keys(state)
          },
          {
            type: 'set',
            items: {
              quoteIds: []
            }
          }
        ]
      }
    }
  )

  return {
    DOM: vtree$,
    storage: deleteQuote$.merge(deleteAll$)
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  storage: chromeStorageDriver
}

run(main, drivers)
