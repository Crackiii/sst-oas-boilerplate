import path from 'path'

import { Context } from 'openapi-backend'

import { AUTH_NAME, HandlerParams } from './openapi-backend'

export const importHandler = (handler: string) => {
  const [modulePath, func] = handler.split('.')

  return async (...params: HandlerParams) =>
    (await import(path.join(__dirname, '..', modulePath)))[func](...params)
}

const getParamValue = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param

export const getParam = (
  c: Context,
  paramName: string,
  default_value?: string
): string =>
  getParamValue(c.request.params[paramName] || c.request.query[paramName]) ??
  default_value

export const getAuthToken = (c: Context): string => c.security[AUTH_NAME]?.token

export const getUserId = (c: Context): string =>
  c.security[AUTH_NAME]?.['userId'] || 'unknown'

export const getHeader = (c: Context, headerName: string): string => {
  const lowercaseHeaderName = headerName.toLowerCase()
  const capitalizedHeaderName = headerName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')

  const headerValue =
    c.request.headers[lowercaseHeaderName] ??
    c.request.headers[capitalizedHeaderName]

  return getParamValue(headerValue)
}

export const getCacheControl = (c: Context) => {
  const cacheControl = getHeader(c, 'cache-control')
  const pragma = getHeader(c, 'pragma')

  return {
    revalidate: Boolean(
      pragma === 'no-cache' ||
      cacheControl === 'no-cache' ||
      cacheControl?.startsWith?.('max-age=')
    ),
    cacheControl
  }
}
