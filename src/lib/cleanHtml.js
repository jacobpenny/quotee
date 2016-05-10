import cheerio from 'cheerio'
import _ from 'lodash'

const ATTR_WHITELIST = ['href']

export default function(html) {
  const $ = cheerio.load(html)
  $('*').each((index, element) => {
    _.each(element.attribs, (value, key) => {
      if (!(_.includes(ATTR_WHITELIST, key))) $(element).removeAttr(key)
    })
  })
  return $.html()
}
