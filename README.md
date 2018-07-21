# designetz-logger
A tiny node.js package to log events according to the logging conventions in the Designetz project.

![Set of logos](./docs/logos_uds_aes_designetz_bmwi.png)

## License
See the [LICENSE](./LICENSE) file for license rights and limitations (ISC).

## Install
```
$ npm install designetz-logger
```

## Usage
### Importing the package
To use the package it needs to be imported via require

```javascript
const createLogger = require('designetz-logger')
```

### Creating a logger instance
The `designetz_logger` package is exported as a single function which is used to create new logger instances. The function takes a single parameter object which can be used to set optional parameters.
Example:
```javascript
const log = createLogger({
  name: 'nameOfLogger',
  target: console.log,
  levelFilter: 20
})
```

The optional parameters have the following meaning:
* `name`: the value of the name attribute used in each log entry (standard is `''`)
* `target`: the stream the log entry gets written to as serialized JSON object (standard is `console.log` --> log entries are written to STDOUT)
* `levelFilter`: the inclusive lower threshold for the log level. Log entries with a smaller level will not be written to target (standard is `0` --> everything is logged)

### Writing log entries
The logger instance has functions to log events in 6 different levels:
* `fatal` (level 60): A fatal event occured, the application will exit
* `error` (level 50): A malfunction occured (e.g. an operation could not be completed successfully), but the application will keep running
* `warn` (level 40): A possible problem has been detected (e.g. memory is running low) but the application is still fully functional
* `info` (level 30): A noteworthy event for normal operation has occured (e.g. a request has been received)
* `debug` (level 20): A noteworthy event for debugging has occured (e.g. a request to a sub-sequent service has been sent)
* `trace` (level 10): A noteworthy event for tracing has occured (e.g. a auxiliary calculation result has been calculated)

For convenience, the logger instance provides the method `any` which derives the log level automatically based on the first digit of the given code.

Each function takes three parameters:
* `msg`: A human readable message of type `string` (this parameter is mandatory)
* `code`: A machine readable code of type `number` to filter events (this parameter is mandatory)
* `error`: An instance of type `Error` with information on the root cause of the event (this parameter is optional)

Example with explicit determination of the log level:
```javascript
'use strict'

const createLogger = require('designetz-logger')

// create logger without assigning log target --> default is STDOUT
let log = createLogger({
  name: 'log_to_stdout'
})

// explicit log of info message
log.info('info message with code 30000', 30000)
```

The output on `STDOUT` looks like this:
```json
{"name":"log_to_stdout","hostname":"hostxyz","pid":15072,"level":30,"msg":"info message with code 30000","code":30000,"time":"2018-07-21T14:00:31.783Z"}
```

Example with automatic derivation of the log level:
```javascript
'use strict'

const createLogger = require('designetz-logger')

// create logger without assigning log target --> default is STDOUT
let log = createLogger({
  name: 'log_to_stdout'
})

// implicit log of info message
log.any('info message with code 30000', 30000)
```

The output on `STDOUT` looks like this:
```json
{"name":"log_to_stdout","hostname":"hostxyz","pid":15072,"level":30,"msg":"info message with code 30000","code":30000,"time":"2018-07-21T14:00:31.783Z"}
```

The properties `name`, `hostname`, `pid`, `level` and `time` are automatically added to the log entry, whereas `msg`, `code` and `error` are the parameters given to the log instance function call.

Where appropriate, an error object (instance of type `Error`) should be provided as third parameter to `fatal`, `error`, `warn`, `info`, `debug`, `trace` and `any`. The error object will be serialized in a way that it includes as much as possible information for debugging:

```javascript
'use strict'

const {promisify} = require('util')
const readFile = promisify(require('fs').readFile)
const createLogger = require('designetz-logger')

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
```

In case the log file cannot be loaded, the log entry looks like this:
```json
{"name":"log_to_stdout","hostname":"hostxyz","pid":19991,"level":60,"msg":"essential config file could not be loaded","code":60010,"err":{"errno":-2,"code":"ENOENT","syscall":"open","path":"./some/path/to/essential/config.txt","name":"Error","message":"ENOENT: no such file or directory, open './some/path/to/essential/config.txt'","stack":"Error: ENOENT: no such file or directory, open './some/path/to/essential/config.txt'"},"time":"2018-07-21T14:29:13.378Z"}
```