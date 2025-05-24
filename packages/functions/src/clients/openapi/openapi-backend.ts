import * as Lambda from 'aws-lambda'
import { Context, Document, OpenAPIBackend } from 'openapi-backend'

import * as defaultHandlers from './openapi-default-handlers'
import { authSecurityHandler } from './openapi-security-handlers'

/**
 * The name of the security scheme registered in the OpenAPI definition.
 */
export const AUTH_NAME = 'OpenAPIAuth'

/**
 * The parameters passed to each API handler function.
 *
 * @remarks
 * The handler receives the OpenAPI Context, the optional API Gateway V2 event,
 * and the optional AWS Lambda context object.
 */
export type HandlerParams = [
  /** The OpenAPI Backend execution context. */
  Context,
  /** The API Gateway Proxy V2 event, if invoked via AWS API Gateway. */
  Lambda.APIGatewayProxyEventV2?,
  /** The AWS Lambda context object, if invoked as a Lambda function. */
  Lambda.Context?
]

/**
 * The shape of an API handler function using APIGatewayProxyStructuredResultV2.
 */
export type ApiHandler = (
  ...params: HandlerParams
) => Promise<Lambda.APIGatewayProxyStructuredResultV2>

/**
 * Creates and configures a new OpenAPIBackend instance with default and security handlers.
 *
 * @param definition - The path to the OpenAPI definition file or a parsed Document object.
 * @returns A configured OpenAPIBackend instance ready to handle API requests.
 */
export const createAPI = (definition: string | Document): OpenAPIBackend => {
  // Initialize the OpenAPI backend with quick mode enabled
  const api = new OpenAPIBackend({
    definition,
    quick: true
  })

  // Register default request and error handlers
  api.register({ ...defaultHandlers })

  // Register the security handler under the specified AUTH_NAME
  api.registerSecurityHandler(AUTH_NAME, authSecurityHandler)

  return api
}
