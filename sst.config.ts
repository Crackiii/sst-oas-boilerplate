/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app() {
    return {
      name: "sst-openapi-boilerplate-stack",
      home: "aws",
    };
  },

  async run() {
    const lambdaFunction = new sst.aws.Function('FunctionName', {
      handler: 'index.handler',
    })

    return {
      functions: [lambdaFunction.name],
    };
  },
});
