import * as Lambda from 'aws-lambda'
import { OpenAPIBackend, Context, Document } from 'openapi-backend'

import * as defaultHandlers from './openapi-default-handlers'
import { authSecurityHandler } from './openapi-security-handlers'

export const AUTH_NAME = 'OpenAPIAuth'

export type HandlerParams = [
  Context,
  Lambda.APIGatewayProxyEventV2?,
  Lambda.Context?
]
export type ApiHandler = (
  ...params: HandlerParams
) => Promise<Lambda.APIGatewayProxyStructuredResultV2>

export const createAPI = (definition: string | Document) => {
  const api = new OpenAPIBackend({
    definition,
    quick: true
  })

  // register default handlers
  api.register({ ...defaultHandlers })

  api.registerSecurityHandler(AUTH_NAME, authSecurityHandler)

  return api
}
