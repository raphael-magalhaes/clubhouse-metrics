const mockFs = jest.fn()
mockFs.writeFileSync = jest.fn()
jest.mock('fs', () => mockFs)

const mockCSVStringify = jest.fn()
jest.mock('csv-stringify', () => mockCSVStringify)

const FileSystem = require('../../infrastructure').FileSystem

const toFormattedJSONString = data => JSON.stringify(data, null, 4)

describe('FileSystem', () => {
  describe('saveAsJson function', () => {
    it('should forward parameters received without changing them.', () => {
      // Given
      const data = { foo: 'bar' }
      const path = 'relative/path/fileName.json'

      // When
      FileSystem.saveAsJSON(data, path)

      // Then
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(path, toFormattedJSONString(data))
    })
  })

  describe('saveAsCSV function', () => {
    it('should forward parameters received without changing them.', () => {
      // Given
      const data = { foo: 'bar' }
      const path = 'relative/path/fileName.json'
      const config = {}

      // When
      FileSystem.saveAsCSV(data, path, config)

      // Then
      expect(mockCSVStringify).toHaveBeenCalledWith(data, config, expect.any(Function))
    })
  })

  describe('readFile function', () => {
    it('should read and return the file without changing it.', () => {
      // Given
      const expected = { foo: 'bar' }
      mockFs.readFileSync = jest.fn(() => '{ "foo": "bar" }')
      const path = 'relative/path/fileName.json'

      // When
      const received = FileSystem.readFile(path)

      // Then
      expect(received).toEqual(expected)
    })

    it('should return undefined when it is not possible to read the file.', () => {
      // Given
      mockFs.readFileSync = jest.fn(() => undefined)
      const path = 'relative/path/fileName.json'
      const FileSystem = require('../../infrastructure').FileSystem

      // When
      const received = FileSystem.readFile(path)

      // Then
      expect(received).toBe(undefined)
    })
  })

  describe('debug.saveAsJSON function', () => {
    beforeEach(() => delete process.env.DEBUG_MODE_ENABLED)

    it('should forward parameters received without changing them when debugging is enabled.', () => {
      // Given
      const data = { foo: 'bar' }
      const path = 'relative/path/fileName.json'
      process.env.DEBUG_MODE_ENABLED = true
      const FileSystem = require('../../infrastructure').FileSystem
      FileSystem.saveAsJSON = jest.fn()

      // When
      FileSystem.debug.saveAsJSON(data, path)

      // Then
      expect(FileSystem.saveAsJSON).toHaveBeenCalledWith(data, path)
    })

    it('should not forward parameters received when debugging is disabled.', () => {
      // Given
      const data = { foo: 'bar' }
      const path = 'relative/path/fileName.json'
      process.env.DEBUG_MODE_ENABLED = false
      const FileSystem = require('../../infrastructure').FileSystem
      FileSystem.saveAsJSON = jest.fn()

      // When
      FileSystem.debug.saveAsJSON(data, path)

      // Then
      expect(FileSystem.saveAsJSON).not.toHaveBeenCalled()
    })
  })
})
