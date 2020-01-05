const mockRequest = jest.fn()

const http = require('../../infrastructure').HTTP
jest.mock('request-promise-native', () => mockRequest)

describe('HTTP', () => {
  describe('call function', () => {
    it('should forward parameters received without changing them.', () => {
      // Given
      const config = {}
      const callback = () => {}

      // When
      http.call(config, callback)

      // Then
      expect(mockRequest).toHaveBeenCalledWith(config, callback)
    })

    it('should return the result without changing it.', async () => {
      // Given
      const config = {}
      const callback = () => {}
      const expected = { foo: 'bar' }
      mockRequest.mockResolvedValue(expected)

      // When
      const received = await http.call(config, callback)

      // Then
      expect(received).toBe(expected)
    })
  })
})
