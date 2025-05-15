import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import createHttpError from 'http-errors'

import config from '../../config'
import { replyJSON } from '../lambda/lambda-utils'
import { logger } from '../lambda/powertools'

import { ApiHandler } from './openapi-backend'

export const notFound: ApiHandler = async () => {
  throw new createHttpError.NotFound()
}

export const validationFail: ApiHandler = async (c) => {
  return replyJSON(
    { status: 400, error: c.validation.errors },
    { statusCode: 400 }
  )
}

export const notImplemented: ApiHandler = async (c) => {
  if (config.MOCK_ENABLED) {
    const { status, mock } = c.api.mockResponseForOperation(
      c.operation.operationId as string
    )

    return replyJSON(mock, { statusCode: status })
  } else {
    throw new createHttpError.NotImplemented(
      `${c.operation.operationId} is not implemented`
    )
  }
}

export const postResponseHandler: ApiHandler = async (c, event) => {
  const response = c.response as APIGatewayProxyStructuredResultV2
  const statusCode = response?.statusCode || 200

  logger.info('done', {
    statusCode,
    operationId: c.operation?.operationId,
    ...event?.requestContext?.http
  })

  return c.response
}
