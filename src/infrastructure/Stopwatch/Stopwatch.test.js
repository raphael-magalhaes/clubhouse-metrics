const Stopwatch = require('./Stopwatch')

const setNow = now => (Date.now = jest.fn(() => now))

describe('Stopwatch', () => {
  it('should return undefined if no id is provided.', () => {
    // Given
    const result = Stopwatch()

    // Then
    expect(result).toBe(undefined)
  })

  it('should return undefined if an undefined id is provided.', () => {
    // Given
    const result = Stopwatch(undefined)

    // Then
    expect(result).toBe(undefined)
  })

  it(`should start counting when an id is provided for the first time and stop counting 
    and return the time passed in seconds when it receives the same id again.`, () => {
    // Given
    setNow(1)
    Stopwatch('testing')

    // When
    setNow(10001)
    const result = Stopwatch('testing')

    // Then
    expect(result).toBe(10)
  })

  it(`should be able to receive the same id multiple times.`, () => {
    // Given
    setNow(1000)
    Stopwatch('testing')
    setNow(2000)
    const firstResult = Stopwatch('testing')

    setNow(3000)
    Stopwatch('testing')
    setNow(3500)
    const secondResult = Stopwatch('testing')

    setNow(5000)
    Stopwatch('testing')
    setNow(18720)
    const thirdResult = Stopwatch('testing')

    // Then
    expect(firstResult).toBe(1)
    expect(secondResult).toBe(0.5)
    expect(thirdResult).toBe(13.72)
  })

  it(`should be able to track multiple ids concurrently.`, () => {
    // Given
    setNow(1000)
    Stopwatch('firstId')
    setNow(1000)
    Stopwatch('secondId')
    setNow(1000)
    Stopwatch('thirdId')

    // When
    setNow(124456)
    const firstIdResult = Stopwatch('firstId')

    setNow(7000)
    const secondIdResult = Stopwatch('secondId')

    setNow(4140)
    const thirdIdResult = Stopwatch('thirdId')

    // Then
    expect(firstIdResult).toBe(123.456)
    expect(secondIdResult).toBe(6)
    expect(thirdIdResult).toBe(3.14)
  })
})
