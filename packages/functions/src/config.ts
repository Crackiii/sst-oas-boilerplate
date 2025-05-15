import yn from 'yn'

const config = {
  USE_LOCAL_ENDPOINTS:
    process.env.STAGE === 'local' || process.env.STAGE === 'test',
  STAGE: process.env.STAGE,
  AWS_ENDPOINT: process.env.AWS_ENDPOINT || 'https://example.com',
  TRACING: yn(process.env.TRACING),
  MOCK_ENABLED: yn(process.env.MOCK_ENABLED)
}

export default config
