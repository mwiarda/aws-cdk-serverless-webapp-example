#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { BackendStack } from '../lib/backend/backend-stack';
import { FrontendStack } from '../lib/frontend/frontend-stack';
import { appConfig } from '../../app.config';

const app = new cdk.App();
new FrontendStack(app, `${appConfig.name}-FrontendStack`);
new BackendStack(app, `${appConfig.name}-BackendStack`);