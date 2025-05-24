import middy from '@middy/core'
import * as Lambda from 'aws-lambda'

// correlation headers used by dazn: https://github.com/getndazn/dazn-lambda-powertools
const CORRELATION_HEADERS =
  'awsRequestId, x-correlation-id, call-chain-length, debug-log-enabled'

/**
 * Middleware to add CORS support to AWS Lambda handlers using Middy.
 *
 * @returns A middleware object with before and after hooks to handle CORS preflight and response headers.
 */
export const withCors = () => {
  return {
    /**
     * Handles CORS preflight (OPTIONS) requests by returning the appropriate headers early.
     *
     * @param handler - The Middy request object containing the AWS Lambda event.
     * @returns A response object with CORS headers if the request is an OPTIONS preflight, otherwise undefined.
     */
    before: (handler: middy.Request) => {
      const lambdaEvent = handler.event as Lambda.APIGatewayProxyEventV2

      const isPreflightRequest =
        lambdaEvent.requestContext.http.method.toLowerCase() === 'options'

      if (isPreflightRequest) {
        return {
          statusCode: 200,
          headers: {
            'access-control-allow-origin':
              lambdaEvent.headers['Origin'] ||
              lambdaEvent.headers['origin'] ||
              '*',
            'access-control-allow-headers': `Authorization, Content-Type, x-ivy-org-id, ${CORRELATION_HEADERS}`,
            'access-control-allow-methods':
              'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'access-control-allow-credentials': 'true'
          }
        } as Lambda.APIGatewayProxyStructuredResultV2
      }
    },

    /**
     * Injects CORS headers into the response for non-preflight requests.
     *
     * @param handler - The Middy request object containing the AWS Lambda event and response.
     */
    after: (handler: middy.Request) => {
      const lambdaEvent = handler.event as Lambda.APIGatewayProxyEventV2
      const response =
        handler.response as Lambda.APIGatewayProxyStructuredResultV2

      const isPreflightRequest =
        lambdaEvent.requestContext.http.method.toLowerCase() === 'options'

      if (!isPreflightRequest) {
        response.headers = {
          ...response.headers,
          'access-control-allow-origin':
            lambdaEvent.headers['Origin'] ||
            lambdaEvent.headers['origin'] ||
            '*',
          'access-control-allow-headers': `Authorization, Content-Type, x-ivy-org-id, ${CORRELATION_HEADERS}`,
          'access-control-allow-methods':
            'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'access-control-allow-credentials': 'true'
        }
      }
    }
  }
}
