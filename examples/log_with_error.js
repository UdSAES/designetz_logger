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
