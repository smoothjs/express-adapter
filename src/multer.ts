import { Hook } from '@smoothjs/smooth'
import multer from 'multer'
import { MulterOptions } from './interfaces/multer-options'
import { transformException } from './utils'
import { MulterField } from './interfaces/multer-field'
import { Config } from '@smoothjs/config'
import { Container } from 'typescript-ioc'

const config: Config = Container.get(Config)

export function AnyFilesInterceptor(localOptions?: MulterOptions): MethodDecorator {
  const options: MulterOptions = config.get('multer', {
    dest: './uploads',
  })

  const upload = (multer as any)({
    ...options,
    ...localOptions,
  })

  return Hook(async (request: any, response: any, next: Function) => {
    upload.any()(request, response, (err: any) => {
      if (err) {
        const error = transformException(err)
        return next(error)
      }
      next()
    })
  })
}

export function FileFieldsInterceptor(
  uploadFields: MulterField[],
  localOptions?: MulterOptions
): MethodDecorator {
  const options: MulterOptions = config.get('multer', {
    dest: './uploads',
  })

  const upload = (multer as any)({
    ...options,
    ...localOptions,
  })

  return Hook(async (request: any, response: any, next: Function) => {
    upload.fields(uploadFields)(request, response, (err: any) => {
      if (err) {
        const error = transformException(err)
        return next(error)
      }
      next()
    })
  })
}

export function FileInterceptor(fieldName: string, localOptions?: MulterOptions): MethodDecorator {
  const options: MulterOptions = config.get('multer', {
    dest: './uploads',
  })

  const upload = (multer as any)({
    ...options,
    ...localOptions,
  })

  return Hook(async (request: any, response: any, next: Function) => {
    upload.single(fieldName)(request, response, (err: any) => {
      if (err) {
        const error = transformException(err)
        return next(error)
      }
      next()
    })
  })
}

export function FilesInterceptor(
  fieldName: string,
  maxCount?: number,
  localOptions?: MulterOptions
): MethodDecorator {
  const options: MulterOptions = config.get('multer', {
    dest: './uploads',
  })

  const upload = (multer as any)({
    ...options,
    ...localOptions,
  })

  return Hook(async (request: any, response: any, next: Function) => {
    upload.array(fieldName, maxCount)(request, response, (err: any) => {
      if (err) {
        const error = transformException(err)
        return next(error)
      }
      next()
    })
  })
}
