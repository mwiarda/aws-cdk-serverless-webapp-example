import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3"

import { Construct } from "constructs";
import { appConfig } from "../../../app.config";

export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deploymentUser = new cdk.aws_iam.User(this, `${appConfig.name}-deployment-user`,{
        userName: `${appConfig.name}-deployment-user`,
    });
    const accessKey = new cdk.aws_iam.CfnAccessKey(this, `${appConfig.name}-deployment-access-key`, {
        userName: deploymentUser.userName
    });

    const deploymentBucket = new s3.Bucket(this, `${appConfig.name}-deployment-bucket`, {
        encryption: s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        removalPolicy: appConfig.removalPolicy as cdk.RemovalPolicy,
    });
    deploymentBucket.grantReadWrite(deploymentUser);

    // Create outputs to make the generated information accessible
    new cdk.CfnOutput(this, `${appConfig.name}-deployment-bucket-name`, {
        value: deploymentBucket.bucketName,
        description: "Name of the S3 bucket used for deployment",
        exportName: `${appConfig.name}-deployment-bucket-name`
    })
    
    new cdk.CfnOutput(this, `${appConfig.name}-deployment-user-access-key-id`, {
        value: accessKey.ref,
        description: "Access Key Id for user to be used in deployment pipeline",
        exportName: `${appConfig.name}-deployment-user-access-key-id`
    })
    
    new cdk.CfnOutput(this, `${appConfig.name}-deployment-user-secret-access-key`, {
        value: accessKey.attrSecretAccessKey,
        description: "Secret Access Key for user to be used in deployment pipeline",
        exportName: `${appConfig.name}-deployment-user-secret-access-key`
    })
  }
}
