'use strict'

const createLogger = require('../index.js')
const assert = require('assert')


function createTestableLogTarget() {

  const lines = []
  const logFunction = function (s) {
    lines.push(s)
  }

  const testableLogTarget = {
    lines,
    logFunction
  }
  
  return testableLogTarget
}

describe('./index.js', () => {
  describe('createLogger()', () => {
    
    let testableLogTarget
    beforeEach(() => {
      testableLogTarget = createTestableLogTarget()
    })
    it('should return a logger instance', () => {
      const log = createLogger()
      assert(log != null)
      assert(typeof (log.any) === 'function')
      assert(typeof (log.fatal) === 'function')
      assert(typeof (log.error) === 'function')
      assert(typeof (log.warn) === 'function')
      assert(typeof (log.info) === 'function')
      assert(typeof (log.debug) === 'function')
      assert(typeof (log.trace) === 'function')
    })

    it('should set the name of the logger accordingly', () => {
      const log = createLogger({
        name: 'new_name',
        target: testableLogTarget.logFunction
      })
      log.any('some message', 10000)
      assert.equal(JSON.parse(testableLogTarget.lines[0]).name, 'new_name')
    })

    it('should set the level filter of the logger accordingly', () => {
      const log = createLogger({
        name: 'new_name',
        levelFilter: 40,
        target: testableLogTarget.logFunction
      })

      log.any('some message', 40000)
      assert.equal(testableLogTarget.lines.length, 1)
      log.any('some message', 50000)
      assert.equal(testableLogTarget.lines.length, 2)
      log.any('some message', 30000) // message should be filtered
      assert.equal(testableLogTarget.lines.length, 2)
    })

    describe('any()', () => {
      let testableLogTarget
      beforeEach(() => {
        testableLogTarget = createTestableLogTarget()
      })

      it('should log a message in the correct format with automatically assigning the correct level', () => {
        const testData = [
          [10000, 10, 'message 10000'],
          [20000, 20, 'message 20000'],
          [30000, 30, 'message 20000'],
          [40000, 40, 'message 20000'],
          [50000, 50, 'message 20000'],
          [60000, 60, 'message 20000']
        ]

        const log = createLogger({
          name: 'new_name',
          target: testableLogTarget.logFunction
        })

        testData.forEach((item, index) => {
          log.any(item[2], item[0])
          const logItem = JSON.parse(testableLogTarget.lines[index])
          assert.equal(logItem.msg, item[2])
          assert.equal(logItem.level, item[1])
          assert.equal(logItem.code, item[0])
        })
      })
    })
  })
})