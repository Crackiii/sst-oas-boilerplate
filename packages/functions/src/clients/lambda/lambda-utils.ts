import * as Lambda from 'aws-lambda'
import { isHttpError } from 'http-errors'

import { logger } from './powertools'

/**
 * Constructs a standardized API Gateway JSON response.
 *
 * @param json - The response payload to serialize as JSON.
 * @param opts - Optional override settings for the response, such as statusCode or headers.
 * @returns An APIGatewayProxyStructuredResultV2 with default headers, status code, and serialized body.
 */
export function replyJSON(
  json: unknown,
  opts?: Partial<Lambda.APIGatewayProxyStructuredResultV2>
): Lambda.APIGatewayProxyStructuredResultV2 {
  const defaultHeaders = {
    'content-type': 'application/json',
    'cache-control': 'no-cache,no-store,must-revalidate',
    expires: '0'
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: json ? JSON.stringify(json) : '',
    ...opts,
    headers: {
      ...defaultHeaders,
      ...opts?.headers
    }
  }
}

/**
 * Converts thrown errors into JSON API Gateway responses.
 *
 * Renders HTTPError instances as their statusCode and message,
 * and logs other errors before returning a generic 500 response.
 *
 * @param err - The error thrown during request handling.
 * @returns An APIGatewayProxyStructuredResultV2 representing the error response.
 */
export const handleErrors = (
  err: Error
): Lambda.APIGatewayProxyStructuredResultV2 => {
  if (isHttpError(err)) {
    const { statusCode, message } = err

    return replyJSON({ status: statusCode, error: message }, { statusCode })
  } else {
    logger.error('Unhandled error in handler', { error: err })

    return replyJSON(
      { status: 500, error: 'Unknown API error' },
      { statusCode: 500 }
    )
  }
}
