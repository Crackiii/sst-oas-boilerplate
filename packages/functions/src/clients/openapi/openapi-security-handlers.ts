import { APIGatewayProxyEventV2 } from 'aws-lambda'
import createHttpError from 'http-errors'
import type * as Lambda from 'aws-lambda'

import jwt from 'jsonwebtoken'
import { Context, Handler } from 'openapi-backend'

export interface AuthorizerResultContext {
  userId: string
  username: string
  userPoolId: string
  userPoolClientId: string
  [claim: string]: string | number | boolean
}

export declare type AuthorizerContextV2 = {
  lambda: AuthorizerResultContext
} & APIGatewayProxyEventV2['requestContext']

export interface JWTToken {
  /**
   * Issuer of token (URL)
   */
  iss: string
  /**
   * Issued at time (UNIX Timestamp)
   */
  iat: number
  /**
   * Expiry time (UNIX Timestamp)
   */
  exp: number
  /**
   * Token type (access / id / refresh)
   */
  token_use: 'access' | 'id' | 'refresh'
}
export interface IdTokenClaims extends JWTToken {
  /**
   * Cognito username
   */
  ['cognito:username']: string
}
export interface AccessTokenClaims extends JWTToken {
  /**
   * Cognito username
   */
  ['cognito:groups']: string[]
  /**
   * User pool client id
   */
  ['client_id']: string
}

export interface SecurityContext {
  userId?: string
  token?: string
  email?: string
  claims: AuthorizerResultContext
}
export const authSecurityHandler: Handler = (
  c: Context,
  event?: Lambda.APIGatewayProxyEventV2
): SecurityContext => {
  // add claims from passed authorizer context
  const authorizerContext = (
    event?.requestContext as Lambda.APIGatewayEventRequestContextV2WithAuthorizer<AuthorizerContextV2>
  )?.authorizer as AuthorizerContextV2
  const claims = { ...authorizerContext?.lambda }

  // add token from header
  const token = getBearerToken(c)

  if (token) {
    // add claims from token
    const tokenClaims = parseBearerToken(token)

    Object.assign(
      claims,
      {
        ...tokenClaims,
        userId: claims['custom:userId']
      },
      authorizerContext?.lambda
    )
  }

  if (!authorizerContext && !token) {
    throw new createHttpError[401]('Unauthorized')
  }

  // this value gets added to c.security["StickyAuth"]
  return {
    token,
    claims,
    userId: claims['custom:userId'] as string,
    email: (claims.email as string) ?? (claims['cognito:username'] as string)
  }
}

export const getBearerToken = (c: Context) => {
  const authHeader =
    c.request.headers['authorization'] || c.request.headers['Authorization']
  const authHeaderString = Array.isArray(authHeader)
    ? authHeader[0]
    : authHeader

  return authHeaderString?.replace('Bearer ', '')
}

const parseBearerToken = (bearerToken: string): IdTokenClaims => {
  try {
    const token = jwt.decode(bearerToken) as IdTokenClaims

    if (!token) {
      throw new Error('Unable to decode token')
    }

    return token
  } catch (err) {
    throw new createHttpError[401]('Bad Authorization header')
  }
}
