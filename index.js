// designetz_logger
//
// Copyright 2018 The designetz_logger Developers. See the LICENSE file at
// the top-level directory of this distribution and at
// https://github.com/UdSAES/designetz_logger/LICENSE
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS.IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.
//
// designetz_logger may be freely used and distributed under the ISC license

'use strict'
const os = require('os')
const _ = require('lodash')
const serializeError = require('serialize-error')

function noop() {
}

function createLogger(options) {
  options = _.cloneDeep(options) || {}
  options.name = options.name || ''
  options.target = options.target || console.log
  options.levelFilter = options.levelFilter || 0

  const logTemplate = {
    name: options.name,
    hostname: os.hostname(),
    pid: process.pid,
  }
  
  function setLevelFilter(levelFilter) {
    options.levelFilter = levelFilter
  }

  function log(level, msg, code, err) {
    if (level < options.levelFilter) {
      return
    }

    const entry = JSON.parse(JSON.stringify(logTemplate))
    entry.level = level
    entry.msg = msg
    entry.code = code

    if (_.isError(err)) {
      entry.err = serializeError(err)
    }
    entry.time = new Date()
    options.target(JSON.stringify(entry))
  }

  function fatal(msg, code, err) {
    log(60, msg, code, err)
  }

  function error(msg, code, err) {
    log(50, msg, code, err)
  }

  function warn(msg, code, err) {
    log(40, msg, code, err)
  }

  function info(msg, code, err) {
    log(30, msg, code, err)
  }

  function debug(msg, code, err) {
    log(20, msg, code, err)
  }

  function trace(msg, code, err) {
    log(10, msg, code, err)
  }

  function any(msg, code, err) {
    const codeString = code + ''

    switch (codeString[0]) {
      case '6':
        fatal(msg, code, err)
        break;
      case '5':
        error(msg, code, err)
        break;
      case '4':
        warn(msg, code, err)
        break;
      case '3':
        info(msg, code, err)
        break;
      case '2':
        debug(msg, code, err)
        break;
      case '1':
        trace(msg, code, err)
        break;
      default:
        throw new Error('invalid code ' + code)
    }
  }

  const lognInstance = {
    log: log,
    fatal: fatal,
    error: error,
    warn: warn,
    info: info,
    debug: debug,
    trace: trace,
    any: any,
    setLevelFilter
  }

  return lognInstance
}

exports = createLogger
module.exports = exports
