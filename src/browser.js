'use strict'

const urlHttp = require('url-http/lightweight')
const { flattie: flatten } = require('flattie')
const { encode: stringify } = require('qss')
const whoops = require('whoops')

const factory = require('./factory')
const { default: ky } = require('./ky')

const MicrolinkError = whoops('MicrolinkError')

const got = async (url, opts) => {
  try {
    if (opts.timeout === undefined) opts.timeout = false
    const response = await ky(url, opts)
    const body = await response.json()
    const { headers, status: statusCode } = response
    return { url: response.url, body, headers, statusCode }
  } catch (err) {
    if (err.response) {
      const { response } = err
      err.response = {
        ...response,
        headers: Array.from(response.headers.entries()).reduce(
          (acc, [key, value]) => {
            acc[key] = value
            return acc
          },
          {}
        ),
        statusCode: response.status,
        body: await response.text()
      }
    }
    throw err
  }
}

module.exports = factory({
  MicrolinkError,
  urlHttp,
  stringify,
  got,
  flatten,
  VERSION: '__MQL_VERSION__'
})
