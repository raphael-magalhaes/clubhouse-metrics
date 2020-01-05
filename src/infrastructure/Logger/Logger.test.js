jest.mock('./Stopwatch/Stopwatch', id => id => {
  // Stopwatch dependency works by starting the stopwatch when it receives
  // a valid id and it calculate and returns the time passed when it receives
  // the same id again. The following implementation is just a way to mock
  // Stopwatch so we can fake it being called for the second time only when
  // the id matches "stopWatchId".
  return id === 'stopwatchId' ? 42 : undefined
})

beforeEach(() => {
  global.console = { log: jest.fn() }
})

afterEach(() => {
  delete process.env.LOGGING_ENABLED
})

describe('Logger', () => {
  it('should log the received value when logging is globally enabled.', () => {
    // Given
    process.env.LOGGING_ENABLED = true
    const Logger = require('../../infrastructure').Logger

    // When
    Logger('Foo')

    // Then
    expect(console.log).toBeCalledWith('Foo')
  })

  it('should not log the received value when logging is disabled.', () => {
    // Given
    process.env.LOGGING_ENABLED = false
    const Logger = require('../../infrastructure').Logger

    // When
    Logger('Foo')

    // Then
    expect(console.log).not.toHaveBeenCalled()
  })

  it(`should log the received value with the time passed between calls with the same id identifier, 
      replacing #{time} with the time passed.`, () => {
    // Given
    process.env.LOGGING_ENABLED = true
    const Logger = require('../../infrastructure').Logger

    // When
    Logger('Foo #{time} bar', 'stopwatchId')

    // Then
    expect(console.log).toBeCalledWith(` → Foo 42 bar\n`)
  })
})
