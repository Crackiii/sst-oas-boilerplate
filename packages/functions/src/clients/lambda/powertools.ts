import { Logger } from '@aws-lambda-powertools/logger'
import { Tracer } from '@aws-lambda-powertools/tracer'

const logger = new Logger()
const tracer = new Tracer()

export { logger, tracer }
