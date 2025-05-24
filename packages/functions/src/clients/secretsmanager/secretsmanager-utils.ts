import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

import { secretsClient } from './secretsmanager-client'

/**
 * Retrieves and caches secret values from AWS Secrets Manager.
 *
 * Uses a local in-memory cache to avoid repeated network calls for the same secret.
 *
 * @param secretId - The identifier of the secret in AWS Secrets Manager.
 * @returns The secret value string associated with the provided secretId.
 * @throws Any error encountered during the AWS Secrets Manager API call.
 */
export const getSecretValue = (() => {
  const cache = new Map<string, string>()

  return async (secretId: string): Promise<string | undefined> => {
    // Return cached value if already fetched
    const cached = cache.get(secretId)

    if (cached) {
      return cached
    }

    // Fetch the secret from AWS Secrets Manager
    const { SecretString } = await secretsClient.send(
      new GetSecretValueCommand({ SecretId: secretId })
    )

    // Cache and return the secret value
    if (SecretString) {
      cache.set(secretId, SecretString)
    }

    return SecretString
  }
})()
