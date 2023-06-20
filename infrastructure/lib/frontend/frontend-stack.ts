import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";
import { appConfig } from "../../../app.config";

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, appConfig.name, {
      // We just use this amplify app for hosting.
      // Deployment will be manual to be flexible where we hold our code.
    });

    // Add some cloudformation outputs to make some information available programatically (i.e. with aws cli)
    new cdk.CfnOutput(this, `${appConfig.name}-AmplifyAppId`, {
      exportName: `${appConfig.name}-AmplifyAppId`,
      description: "Amplify app id",
      value: amplifyApp.appId,
    });
    new cdk.CfnOutput(this, `${appConfig.name}-AmplifyDefaultDomain`, {
      exportName: `${appConfig.name}-AmplifyDefaultDomain`,
      description: "Amplify default domain",
      value: amplifyApp.defaultDomain,
    });
  }
}
