type AppConfig = {
    name: string,
    removalPolicy: string   // Will be casted to cdk.RemovalPolicy
}

export const appConfig : AppConfig = {
    name: "SampleApp",
    removalPolicy: "destroy"
}