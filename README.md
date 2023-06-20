# aws-cdk-serverless-webapp-example
This GitHub repository serves as a sample application demonstrating the power and simplicity of building a serverless web application using the AWS Cloud Development Kit (CDK).

With this project, you'll discover how to leverage the capabilities of serverless components and the AWS CDK to rapidly construct scalable, cost-effective, and flexible web applications. The repository provides a comprehensive example that showcases the integration of various AWS services and serverless resources.

Components: 
- Vue frontend
- AWS Lambda function backend
- Cognito Identity management
- AppSync GraphQl interface
- DynamoDB database
- S3 file storage

Get started today and explore the world of serverless web applications with AWS CDK!


# Infrastructure deployment

## Setup aws credentials
Setup the credentials for the AWS account and region you want to deploy in using either environment variables or the `~/.aws/credentials` file.
See instructions in the AWS docs: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html.
I'm going to assume that the credentials are either set as environment variables or as default profile. 
For using named profiles `--profile XXX` has to be appended to all cdk commands.

## Deploy infrastructure
1) Install dependencies
    ```
    cd ./infrastructure
    yarn
    ```
2) Bootstrap environment (only once)
    ```
    yarn cdk bootstrap
    ```
3) Deploy infrastructure
    ```
    yarn cdk deploy --all
    ```

## Other useful infrastructure commands
1) Check for differences between deployed infrastructure and code
    ```
    yarn cdk diff
    ```
2) List stacks in cdk App 
    ```
    yarn cdk list
    ```    
3) Compile / Synth code to cloudformation template
    ```
    yarn cdk synth
    ```

3) Destroy infrastructure stacks
    ```
    yarn cdk destroy 
    ```


## Frontend deployment
1) Build for deployment
    ```
    yarn 
    yarn build
    ```

2) Deploy zip manually on amplify (https://eu-central-1.console.aws.amazon.com/amplify/home?region=eu-central-1#/d2altjqgd78go3/create/manual)