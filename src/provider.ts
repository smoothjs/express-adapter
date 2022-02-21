import { ExpressAdapter } from './express-adapter'
import { HttpAdapter, Provider } from '@smoothjs/smooth'
import { Container, Singleton, OnlyInstantiableByContainer } from 'typescript-ioc'
import { Request } from './request'

@OnlyInstantiableByContainer
@Singleton
export class ExpressProvider extends Provider {
    public register() {
        Container.bind(HttpAdapter).factory(this.adapterFactory)
    }

    private adapterFactory() {
        return new ExpressAdapter()
    }
}