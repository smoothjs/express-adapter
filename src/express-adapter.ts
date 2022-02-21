import * as http from 'http'
import * as https from 'https'
import express from 'express'
import { Config } from '@smoothjs/config'
import * as bodyParser from 'body-parser'
import { HttpAdapter, RequestHandler, isFunction } from '@smoothjs/smooth'
import { Container, OnlyInstantiableByContainer, Singleton } from 'typescript-ioc'

@OnlyInstantiableByContainer
@Singleton
export class ExpressAdapter extends HttpAdapter {
  constructor(instance?: any) {
    super(instance || express())
  }

  public status(response: any, statusCode: number) {
    return response.status(statusCode)
  }

  public render(response: any, view: string, options: any) {
    return response.render(view, options)
  }

  public redirect(response: any, statusCode: number, url: string) {
    return response.redirect(statusCode, url)
  }

  public setNotFoundHandler(handler: Function, prefix?: string) {
    return this.use(handler)
  }

  public listen(port: string | number, callback?: () => void)
  public listen(port: string | number, hostname: string, callback?: () => void)
  public listen(port: any, ...args: any[]) {
    return this.httpServer.listen(port, ...args)
  }

  public set(...args: any[]) {
    return this.instance.set(...args)
  }

  public engine(...args: any[]) {
    return this.instance.engine(...args)
  }

  public setBaseViewsDir(path: string | string[]) {
    return this.set('views', path)
  }

  public setViewEngine(engine: string) {
    return this.set('view engine', engine)
  }

  public setHeader(response: any, name: string, value: string) {
    return response.append(name, value)
  }

  public initHttpServer() {
    const isHttpsEnabled = Container.get(Config).get('app.https.enabled', false)

    if (isHttpsEnabled) {
      this.httpServer = https.createServer(Container.get(Config).get('app.https.options', {}), this.getInstance())

      return
    }

    this.httpServer = http.createServer(this.getInstance())
  }

  public createMiddlewareFactory(
    requestMethod: string
  ): (path: string, callback: RequestHandler) => any {
    switch (requestMethod) {
      case 'ALL':
        return this.use.bind(this)
      case 'POST':
        return this.post.bind(this)
      case 'DELETE':
        return this.delete.bind(this)
      case 'PUT':
        return this.put.bind(this)
      case 'PATCH':
        return this.patch.bind(this)
      case 'OPTIONS':
        return this.options.bind(this)
      case 'HEAD':
        return this.head.bind(this)
      default: {
        return this.get.bind(this)
      }
    }
  }

  public useBodyParser() {
    const parserMiddleware = {
      jsonParser: bodyParser.json(),
      urlencodedParser: bodyParser.urlencoded({ extended: true }),
    }

    Object.keys(parserMiddleware)
      .filter((parser) => !this.isMiddlewareApplied(parser))
      .forEach((parserKey) => this.use(parserMiddleware[parserKey]))
  }

  public sendResponse(response: any, ...args) {
    return response.send(...args)
  }

  private isMiddlewareApplied(name: string): boolean {
    const app = this.getInstance()
    return (
      !!app._router &&
      !!app._router.stack &&
      isFunction(app._router.stack.filter) &&
      app._router.stack.some((layer: any) => layer && layer.handle && layer.handle.name === name)
    )
  }

  public close() {
    if (!this.httpServer) {
      return undefined
    }

    return new Promise((resolve) => this.httpServer.close(resolve))
  }

  public getRequestHostname(request: any): string {
    return request.hostname
  }
}
