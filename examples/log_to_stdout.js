'use strict'

const createLogger = require('../index')

// create logger without assigning log target --> default is STDOUT
let log = createLogger({
  name: 'log_to_stdout'
})


// log info message
// --> {"name": log_to_stdout", "level": 30, "msg": "info message with code 30000", "code": 30000, ...} written to STDOUT
log.info('info message with code 30000', 30000)


// same with any --> 30000 transforms to level 30, i.e. info
// --> {"name": log_to_stdout", "level": 30, "msg": "info message with code 30000", "code": 30000, ...} written to STDOUT
log.any('info message with code 30000', 30000)

// log info message with contradicting code
// --> {"name": log_to_stdout", "level": 30, "msg": "info message with code 40000", "code": 40000, ...} written to STDOUT
log.info('info message with code 40000', 40000)

// same with any --> 40000 transforms to level 40, i.e. warn
// --> {"name": log_to_stdout", "level": 40, "msg": "info message with code 40000", "code": 40000, ...} written to STDOUT
log.any('info message with code 40000', 40000)

// create logger with assigning log target
log = createLogger({
  name: 'log_to_stderror',
  target: console.error
})

// log error message
// --> {"name": log_to_stderror", "level": 50, "msg": "info message with code 50000", "code": 50000, ...} written to STDERR
log.error('error message with code 50000', 50000)

// optional error object
try {
  throw new Error('artifical error')
} catch (error) {
  // {"name": log_to_stderror", "level": 50, "msg": "info message with code 50000", "code": 50000, ..., "err": "Error: artificial error <<STACKTRACE>>"} written to STDERR
  log.error('error message with code 50000', 50000, error)
}

// create logger with level filter
log = createLogger({
  name: 'log_with_filter',
  levelFilter: 40
})

// --> {"name": log_with_filter", "level": 60, "msg": "info message with code 60000", "code": 60000, ...} written to STDOUT
log.any('error message with code 60000', 60000)

// --> {"name": log_with_filter", "level": 50, "msg": "info message with code 50000", "code": 50000, ...} written to STDOUT
log.any('error message with code 50000', 50000)

// --> {"name": log_with_filter", "level": 40, "msg": "info message with code 40000", "code": 40000, ...} written to STDOUT
log.any('error message with code 40000', 40000)

// --> nothing written to STDOUT as automatically assigned level 30 is smaller than filter level 40
log.any('error message with code 30000', 30000)

// change level filter
log.setLevelFilter(10)

// --> {"name": log_with_filter", "level": 30, "msg": "info message with code 30000", "code": 30000, ...} written to STDOUT
log.any('error message with code 30000', 30000)
