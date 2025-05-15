import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

import { secretsClient } from './secretsmanager-client'

export const getSecretValue = (() => {
  const cache = new Map()

  return async (secretId: string) => {
    const cached = cache.get(secretId)

    if (cached) return cached

    const { SecretString } = await secretsClient.send(
      new GetSecretValueCommand({ SecretId: secretId })
    )

    cache.set(secretId, SecretString)

    return SecretString
  }
})()
