import * as Lambda from 'aws-lambda'
import { isHttpError } from 'http-errors'

import { logger } from './powertools'

/**
 * Utility to create JSON result object with defaults
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
 * Convert error into JSON response
 */
export const handleErrors = (err: Error) => {
  if (isHttpError(err)) {
    // render http errors thrown by handler as JSON
    const { statusCode, message } = err

    return replyJSON({ status: statusCode, error: message }, { statusCode })
  } else {
    // log non-http errors thrown by handlers and return an opaque 500
    logger.error('Error', { error: err })

    return replyJSON(
      { status: 500, error: 'Unknown API error' },
      { statusCode: 500 }
    )
  }
}
