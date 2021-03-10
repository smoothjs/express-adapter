import test from 'japa'
import { HttpException, PayloadTooLargeException } from '@smoothjs/smooth'
import { transformException, MulterExceptions } from '../src'

test.group('transformException', () => {
  test('error is undefined', async (assert) => {
    const error = undefined

    assert.isUndefined(transformException(error))
  })

  test('error is instance of HttpException', async (assert) => {
    const error = new HttpException('error', 500)

    assert.instanceOf(error, HttpException)
  })

  test('return "PayloadTooLargeException"', async (assert) => {
    const error = {
      message: MulterExceptions.LIMIT_FILE_SIZE,
    }

    assert.instanceOf(transformException(error as any), PayloadTooLargeException)
  })

  test('should return "BadRequestException"', async (assert) => {
    const error = {
      message: MulterExceptions.LIMIT_FIELD_KEY,
    }

    assert.instanceOf(transformException(error as any), HttpException)
  })
})
