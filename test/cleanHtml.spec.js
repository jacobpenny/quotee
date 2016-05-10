import cleanHtml from '../src/lib/cleanHtml'
import expect from 'expect'

describe('cleanHtml', () => {

  it('removes fluff attributes', () => {
    const HTML = '<p draggable="true" id="123">TEST</p>'
    const result = cleanHtml(HTML)
    expect(result).toEqual('<p>TEST</p>')
  })

  it('leaves href attributes intact', () => {
    const HTML = '<a draggable="true" href="http://example.com">TEST</a>'
    const result = cleanHtml(HTML)
    expect(result).toEqual('<a href="http://example.com">TEST</a>')
  })

})
