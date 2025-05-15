import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

export const secretsClient = new SecretsManagerClient({
  region: 'us-east-1'
})
