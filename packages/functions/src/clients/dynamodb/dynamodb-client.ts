import { DataMapper } from '@aws/dynamodb-data-mapper'
import DynamoDBWrapper from '@dazn/lambda-powertools-dynamodb-client'
import { DynamoDB } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import config from '../../config'

let client: DynamoDB

/**
 * Returns a singleton AWS DynamoDB client configured for the specified region.
 * Subsequent calls return the same instance.
 *
 * @returns {DynamoDB} The initialized DynamoDB client.
 */
export const getDynamoDBClient = (): DynamoDB => {
  if (!client) {
    client = new DynamoDB({ region: 'us-east-1' })
  }

  return client
}

let mapper: DataMapper

/**
 * Returns a singleton DataMapper instance for interacting with DynamoDB.
 * Initializes the mapper with the shared DynamoDB client.
 *
 * @returns {DataMapper} The initialized DataMapper.
 */
export const getDataMapper = (): DataMapper => {
  if (!mapper) {
    mapper = new DataMapper({
      client: getDynamoDBClient()
    })
  }

  return mapper
}

/**
 * Provides a DynamoDB DocumentClient for high-level data operations.
 * If local endpoints are enabled in config, returns a client pointing to the local endpoint;
 * otherwise returns the wrapped production client.
 *
 * @returns {DocumentClient | typeof DynamoDBWrapper} The appropriate DocumentClient instance or wrapper.
 */
export const getDocumentClient = ():
  | DocumentClient
  | typeof DynamoDBWrapper => {
  if (config.USE_LOCAL_ENDPOINTS) {
    return new DocumentClient({ endpoint: config.AWS_ENDPOINT })
  }

  return DynamoDBWrapper
}
