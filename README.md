# designetz_logger
A tiny node.js package to log events according to the logging conventions in the Designetz project.

![Set of logos](./docs/logos_uds_aes_designetz_bmwi.png)

## License
See the [LICENSE](./LICENSE) file for license rights and limitations (ISC).

## Install
```
$ npm install designetz_logger
```

## Usage
To use the package it needs to be imported via require

```javascript
const logger = require('designetz_logger')
```

The `designetz_logger` package is exported as a single function which is used to create new logger instances. The function takes a single parameter which is the name of the logger.
Example:
```javascript
const log = logger('logger_instance')
```

The logger instance has functions to log events in 6 different levels:
* `fatal` (level 60): A fatal event occured, the application will exit
* `error` (level 50): A malfunction occured (e.g. an operation could not be completed successfully), but the application will keep running
* `warn` (level 40): A possible problem has been detected (e.g. memory is running low) but the application is still fully functional
* `info` (level 30): A noteworthy event for normal operation has occured (e.g. a request has been received)
* `debug` (level 20): A noteworthy event for debugging has occured (e.g. a request to a sub-sequent service has been sent)
* `trace` (level 10): A noteworthy event for tracing has occured (e.g. a auxiliary calculation result has been calculated)

Each function takes three parameters:
* `msg`: A human readable message of type `string` (this parameter is mandatory)
* `code`: A machine readable code of type `number` to filter events (this parameter is mandatory)
* `error`: An instance of type `Error` with information on the root cause of the event (this parameter is optional)

Example:
```javascript
const fs = require('fs-extra')
const designetz_logger = require('designetz_logger')

const PATH_TO_CONFIG_FILE = './config/config_1.json'

const log = designetz_logger('designetz_logger_example')

let configFileContent = null
try {
  configFileContent = await fs.readJson(PATH_TO_CONFIG_FILE)
} catch (error) {
  log.error('reading config file failed', 60001, error)
  process.exit(1)
}

log.info('config file successfully read', 30002)
```

The output on the console for the above example will either be
```json
{"name":"designetz_logger_example","hostname":"somehost","pid":29944,"level":60,"msg":"reading config file failed","code":60001,"time":"2018-05-22T12:25:15.459Z", "error": {}}
```

if the config file cannot be loaded, or

```json
{"name":"designetz_logger_example","hostname":"somehost","pid":29944,"level":30,"msg":"config file successfully read","code":30002,"time":"2018-05-22T12:25:15.459Z"}
```

if the config has successfully been loaded.

The properties `name`, `hostname`, `pid`, `level` and `time` are automatically added to the log entry, whereas `msg`, `code` and `error` are the parameters given to the log instance function call.

