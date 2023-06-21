import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path"

import { Bucket } from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { appConfig } from '../../../../app.config';

// Create a new AppSync API
export function createApi(stack: cdk.Stack, userpool: cognito.UserPool, database: Table, storage: Bucket){
  const api = new appsync.GraphqlApi(stack, `${appConfig.name}-api`, {
    name: `${appConfig.name}-api`,
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'schema.graphql')),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: appsync.AuthorizationType.USER_POOL,
        userPoolConfig: {
          userPool: userpool
        }
      },
    },
  });

  // Create a new Lambda function
  // I'm bundling multiple resolvers into one lambda function here.
  // This has advantages and drawbacks. One particular drawback is no fine-grained control over permissions.
  const lambdaFunction = new NodejsFunction(stack, `${appConfig.name}-api-resolver`, {
    runtime: lambda.Runtime.NODEJS_18_X,
    functionName: `${appConfig.name}-api-resolver`,
    handler: 'handler',
    entry: path.join(__dirname, 'lambdaResolver/index.ts'),
  });

  // Make sure lambda function has access to our database and storage
  database.grantReadWriteData(lambdaFunction);
  storage.grantReadWrite(lambdaFunction);

  // Create a new data source for the Lambda function
  const lambdaDataSource = api.addLambdaDataSource('lambdaDataSource', lambdaFunction);

  // Create multiple resolvers for the data source
  lambdaDataSource.createResolver(`${appConfig.name}-getHelloWorld`, {
    typeName: 'Query',
    fieldName: 'getHelloWorld',
    requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
    responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
  });

  lambdaDataSource.createResolver(`${appConfig.name}-getIdentity`, {
    typeName: 'Query',
    fieldName: 'getIdentity',  
    requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
    responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
  });

  // Output the api url
  new cdk.CfnOutput(stack, `${appConfig.name}-api-url`, {
    value: api.graphqlUrl,
    description: "GraphQL URL",
    exportName: `${appConfig.name}-api-url`
})
}