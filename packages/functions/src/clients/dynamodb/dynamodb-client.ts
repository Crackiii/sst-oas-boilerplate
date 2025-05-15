import { DataMapper } from '@aws/dynamodb-data-mapper'
import DynamoDBWrapper from '@dazn/lambda-powertools-dynamodb-client'
import { DynamoDB } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import config from '../../config'

let client: DynamoDB

export const getDynamoDBClient = () => {
  if (!client) {
    client = new DynamoDB({ region: 'us-east-1' })
  }

  return client
}

let mapper: DataMapper

export const getDataMapper = () => {
  if (!mapper) {
    mapper = new DataMapper({
      client: getDynamoDBClient()
    })
  }

  return mapper
}

export const getDocumentClient = () => {
  if (config.USE_LOCAL_ENDPOINTS) {
    return new DocumentClient({ endpoint: config.AWS_ENDPOINT })
  }

  return DynamoDBWrapper
}
