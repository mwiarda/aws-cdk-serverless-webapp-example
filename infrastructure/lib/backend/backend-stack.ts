import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";

import { Construct } from "constructs";
import { appConfig } from "../../../app.config";
import { createApi } from "./api";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userpool = this.createIdentityProvider();
    const database = this.createDatabase();
    const storage = this.createStorage();
    const api = createApi(this, userpool, database, storage);
  }

  createIdentityProvider(): cognito.UserPool {
    const userPool = new cognito.UserPool(this, `${appConfig.name}-userpool`, {
      userPoolName: `${appConfig.name}-userpool`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        isAdmin: new cognito.StringAttribute({ mutable: true }),
      },
      signInCaseSensitive: false,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: appConfig.removalPolicy as cdk.RemovalPolicy,
    });
    
    const domain = userPool.addDomain(`${appConfig.name}-cognito-domain`, {
      cognitoDomain: {
        domainPrefix: `${appConfig.name.toLowerCase()}456798`, // Use random number to make this globally unique
      },
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      `${appConfig.name}-userpool-client`,
      {
        userPool
      }
    );
    
    const hosted_ui = new cognito.CfnUserPoolUICustomizationAttachment(this, `${appConfig.name}-userpool-hosted-ui`,
      {
        clientId: userPoolClient.userPoolClientId,
        userPoolId: userPool.userPoolId,
        css: ".banner-customizable {\nbackground: linear-gradient(#9940B8, #C27BDB)\n}" // Add custom css here
      });


      new cdk.CfnOutput(this, `${appConfig.name}-AuthenticationDomainName`, {
        exportName: `${appConfig.name}-AuthenticationDomainName`,
        description: "Domain name for cognito hosted ui",
        value: domain.domainName,
      });    
    return userPool;
  }

  createDatabase(): dynamodb.Table {
    return new dynamodb.Table(this, `${appConfig.name}-database`, {
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.DEFAULT,
      pointInTimeRecovery: true,
      removalPolicy: appConfig.removalPolicy as cdk.RemovalPolicy,
    });
  }

  createStorage(): s3.Bucket {
    return new s3.Bucket(this, `${appConfig.name}-storage-47823`, {
      // Added random number to make bucket name globally unique
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: appConfig.removalPolicy as cdk.RemovalPolicy,
    });
  }
}
