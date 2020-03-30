import { DataSource } from 'apollo-datasource'
import { ApolloError } from 'apollo-server-errors'
import { InMemoryLRUCache } from 'apollo-server-caching'

import { createCachingMethods } from './cache'
import { isCollectionOrModel } from './helpers'

class MongoDataSource extends DataSource {
  constructor(collection) {
    super()

    if (!isCollectionOrModel(collection)) {
      throw new ApolloError(
        'MongoDataSource constructor must be given a collection or Mongoose model'
      )
    }

    this.model = collection
    this.collection = collection
  }

  // https://github.com/apollographql/apollo-server/blob/master/packages/apollo-datasource/src/index.ts
  initialize({ context, cache } = {}) {
    this.context = context

    const methods = createCachingMethods({
      collection: this.collection,
      cache: cache || new InMemoryLRUCache()
    })

    Object.assign(this, methods)
  }
}

export { MongoDataSource }
