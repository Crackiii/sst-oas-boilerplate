import middy from '@middy/core'
import * as Lambda from 'aws-lambda'

// correlation headers used by dazn: https://github.com/getndazn/dazn-lambda-powertools
const CORRELATION_HEADERS =
  'awsRequestId, x-correlation-id, call-chain-length, debug-log-enabled'

export const withCors = () => {
  return {
    // preflight requests (OPTIONS) can be early returned before reaching the lambda main handler
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

    // We still have to return CORS headers for all requests
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
