import { AppSyncIdentityCognito, AppSyncResolverHandler, Context, Event } from 'aws-lambda';

export const handler: AppSyncResolverHandler<any, any> = async (event: Event, context: Context) => {
    if (event.info.fieldName == "getHelloWorld"){
        return "helloWorld";
    }
    else if (event.info.fieldName == "getIdentity"){
        const identity = event.identity as AppSyncIdentityCognito;
        return JSON.stringify(identity);
    }
    else return undefined;
    
};