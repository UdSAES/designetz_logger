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

const {promisify} = require('util')
const readFile = promisify(require('fs').readFile)
const createLogger = require('../index')

async function main() {
  let log = createLogger({
    name: 'log_to_stdout'
  })

  let fileContent

  try {
    fileContent = await readFile('./some/path/to/essential/config.txt', {encoding: 'utf8'})
  } catch (error) {
    log.fatal('essential config file could not be loaded', 60010, error)
    process.exit(1)
  }
  
  log.info('essential config file successfully loaded', 30025)
  // do something with config ...
}

main()
