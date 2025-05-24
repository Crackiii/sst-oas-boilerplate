import type * as Lambda from 'aws-lambda'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { Context, Handler } from 'openapi-backend'

export interface AuthorizerResultContext {
  userId: string
  username: string
  userPoolId: string
  userPoolClientId: string
  [claim: string]: string | number | boolean
}

export type AuthorizerContextV2 = {
  lambda: AuthorizerResultContext
} & APIGatewayProxyEventV2['requestContext']

export interface JWTToken {
  /** Issuer of token (URL) */
  iss: string
  /** Issued at time (UNIX Timestamp) */
  iat: number
  /** Expiry time (UNIX Timestamp) */
  exp: number
  /** Token type (access / id / refresh) */
  token_use: 'access' | 'id' | 'refresh'
}

export interface IdTokenClaims extends JWTToken {
  /** Cognito username */
  ['cognito:username']: string
}

export interface AccessTokenClaims extends JWTToken {
  /** Cognito groups */
  ['cognito:groups']: string[]
  /** User pool client id */
  ['client_id']: string
}

export interface SecurityContext {
  /** The raw JWT bearer token */
  token?: string
  /** Aggregated claims from authorizer and token */
  claims: AuthorizerResultContext & Partial<IdTokenClaims>
  /** User identifier */
  userId?: string
  /** User email or username */
  email?: string
}

/**
 * OpenAPI security handler that extracts authentication information
 * from either a Lambda authorizer context or a Bearer token.
 *
 * @param c - The OpenAPI Backend execution context.
 * @param event - The API Gateway V2 event which may include authorizer data.
 * @returns A SecurityContext with token, aggregated claims, userId, and email.
 * @throws HttpError(401) if neither authorizer context nor token is present.
 */
export const authSecurityHandler: Handler = (
  c: Context,
  event?: Lambda.APIGatewayProxyEventV2
): SecurityContext => {
  const authorizerContext = (
    event?.requestContext as Lambda.APIGatewayEventRequestContextV2WithAuthorizer<AuthorizerContextV2>
  )?.authorizer

  const claims = { ...authorizerContext?.lambda }
  const token = getBearerToken(c)

  if (token) {
    const tokenClaims = parseBearerToken(token)

    Object.assign(
      claims,
      tokenClaims,
      { userId: claims['custom:userId'] },
      authorizerContext?.lambda
    )
  }

  if (!authorizerContext && !token) {
    throw new createHttpError[401]('Unauthorized')
  }

  return {
    token,
    claims,
    userId: claims['custom:userId'] as string,
    email: (claims.email as string) ?? (claims['cognito:username'] as string)
  }
}

/**
 * Extracts the Bearer token from the Authorization header of an OpenAPI request.
 *
 * @param c - The OpenAPI Backend execution context.
 * @returns The Bearer token string if present, otherwise undefined.
 */
export const getBearerToken = (c: Context): string | undefined => {
  const authHeader =
    c.request.headers['authorization'] || c.request.headers['Authorization']
  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader

  return headerValue?.replace('Bearer ', '')
}

/**
 * Decodes a JWT Bearer token and returns the ID token claims.
 *
 * @param bearerToken - The raw JWT Bearer token string.
 * @returns The decoded ID token claims.
 * @throws HttpError(401) if the token cannot be decoded or is invalid.
 */
const parseBearerToken = (bearerToken: string): IdTokenClaims => {
  try {
    const token = jwt.decode(bearerToken) as IdTokenClaims

    if (!token) throw new Error('Unable to decode token')

    return token
  } catch (err) {
    console.error(err)
    throw new createHttpError[401]('Bad Authorization header')
  }
}
