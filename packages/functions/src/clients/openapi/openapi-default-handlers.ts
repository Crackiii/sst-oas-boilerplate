import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import createHttpError from 'http-errors'

import config from '../../config'
import { replyJSON } from '../lambda/lambda-utils'
import { logger } from '../lambda/powertools'
import { ApiHandler } from './openapi-backend'

/**
 * Handler invoked when no matching operation is found in the API definition.
 * Always throws a 404 Not Found error.
 *
 * @returns Never returns normally; always throws a NotFound HTTP error.
 * @throws createHttpError.NotFound
 */
export const notFound: ApiHandler = async () => {
  throw new createHttpError.NotFound()
}

/**
 * Handler invoked when request validation fails.
 * Returns a JSON response with validation error details and a 400 status code.
 *
 * @param c - The OpenAPI Backend execution context, containing validation errors.
 * @returns A JSON response with the validation errors and HTTP 400 status.
 */
export const validationFail: ApiHandler = async (c) => {
  return replyJSON(
    { status: 400, error: c.validation.errors },
    { statusCode: 400 }
  )
}

/**
 * Handler invoked for operations that are declared but not implemented.
 * If mocking is enabled in config, returns a mock response; otherwise, throws 501 Not Implemented.
 *
 * @param c - The OpenAPI Backend execution context, containing the operation details and mock utilities.
 * @returns A JSON response with mock data and corresponding status when mocking is enabled.
 * @throws createHttpError.NotImplemented when mocking is disabled.
 */
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

/**
 * Post-response handler that logs the result of the operation and returns the response.
 *
 * @param c - The OpenAPI Backend execution context, containing the response and operation metadata.
 * @param event - The optional AWS Lambda proxy event, used for logging HTTP request context.
 * @returns The original response object from the OpenAPI Backend.
 */
export const postResponseHandler: ApiHandler = async (
  c,
  event
): Promise<APIGatewayProxyStructuredResultV2> => {
  const response = c.response as APIGatewayProxyStructuredResultV2
  const statusCode = response?.statusCode || 200

  logger.info('done', {
    statusCode,
    operationId: c.operation?.operationId,
    ...event?.requestContext?.http
  })

  return response
}
