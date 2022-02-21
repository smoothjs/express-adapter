import { InRequestScope } from 'typescript-ioc'
import { Request as ExpressRequest } from 'express'

@InRequestScope
export class Request {
    constructor(private request: ExpressRequest) {}

    public headers() {
        return this.request.headers
    }
}