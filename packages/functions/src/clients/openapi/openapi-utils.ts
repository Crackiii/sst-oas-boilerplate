import { Context } from 'openapi-backend'
import path from 'path'

import { AUTH_NAME, HandlerParams } from './openapi-backend'

/**
 * Dynamically imports a handler function from a module and returns
 * an async function that invokes it with the given parameters.
 *
 * @param handler - A string in the format 'moduleName.functionName'.
 * @returns An async function that takes HandlerParams and returns the result of the imported handler.
 */
export const importHandler = (handler: string) => {
  const [modulePath, func] = handler.split('.')

  return async (...params: HandlerParams) =>
    (await import(path.join(__dirname, '..', modulePath)))[func](...params)
}

/**
 * Extracts the first value from a parameter that may be a string or an array of strings.
 *
 * @param param - The parameter value, either a string or an array of strings.
 * @returns The first string in the array or the string itself.
 */
const getParamValue = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param

/**
 * Retrieves a parameter from the request path or query and returns its value or a default.
 *
 * @param c - The OpenAPI Backend context.
 * @param paramName - The name of the parameter to retrieve.
 * @param default_value - The default value to return if the parameter is not found.
 * @returns The parameter value or the default value.
 */
export const getParam = (
  c: Context,
  paramName: string,
  default_value?: string
): string =>
  getParamValue(c.request.params[paramName] || c.request.query[paramName]) ??
  default_value!

/**
 * Retrieves the authentication token from the security context.
 *
 * @param c - The OpenAPI Backend context.
 * @returns The authentication token, or undefined if not present.
 */
export const getAuthToken = (c: Context): string | undefined =>
  c.security[AUTH_NAME]?.token

/**
 * Retrieves the user ID from the security context.
 *
 * @param c - The OpenAPI Backend context.
 * @returns The user ID or 'unknown' if not present.
 */
export const getUserId = (c: Context): string =>
  c.security[AUTH_NAME]?.['userId'] || 'unknown'

/**
 * Retrieves a header value from the request, handling case-insensitivity.
 *
 * @param c - The OpenAPI Backend context.
 * @param headerName - The name of the header to retrieve.
 * @returns The header value or undefined if not present.
 */
export const getHeader = (
  c: Context,
  headerName: string
): string | undefined => {
  const lowercaseHeaderName = headerName.toLowerCase()
  const capitalizedHeaderName = headerName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')

  const headerValue =
    c.request.headers[lowercaseHeaderName] ??
    c.request.headers[capitalizedHeaderName]

  return headerValue ? getParamValue(headerValue) : undefined
}

/**
 * Determines cache control behavior based on request headers.
 *
 * @param c - The OpenAPI Backend context.
 * @returns An object containing a revalidate flag and the cacheControl header value.
 */
export const getCacheControl = (
  c: Context
): { revalidate: boolean; cacheControl?: string } => {
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
