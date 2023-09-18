'use strict';

import { lambdaHandler } from '../../app.mjs';
import { expect } from 'chai';
var event, context;

describe('Tests users', async function () {
    it('verifies successful response', async () => {
        event = {
            httpMethod: 'GET',
            path: '/users',
        };
        const result = await lambdaHandler(event, context)
        console.log('Tests users result', result);
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);
        // console.log('response', response);

        expect(response).to.be.an('object');
        expect(response.data).to.be.an('array');
        response.data.forEach(user => {
            expect(user).to.have.property('email');
        });
    });
});

describe('Test users-find', async function () {
    it('verifies successful response', async () => {
        event = {
            httpMethod: 'GET',
            path: '/users/find',
            queryStringParameters: {
                email: 'sally@milz.com',
            }
        };
        const result = await lambdaHandler(event, context)
        console.log('Test users-find result', result);
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);
        // console.log('response', response);

        expect(response).to.be.an('object');
        expect(response.data).to.be.an('object');
        expect(response.data
            ).to.have.property('email');
    });
});

// Given Environment Variables
// const environmentalVariables = {
//     handler: process.env._HANDLER,
//     aws_region: process.env.AWS_REGION,
//     aws_execution_env: process.env.AWS_EXECUTION_ENV,
//     aws_lambda_function_name: process.env.AWS_LAMBDA_FUNCTION_NAME,
//     aws_lambda_function_name: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
//     aws_lambda_function_version: process.env.AWS_LAMBDA_FUNCTION_VERSION,
//     aws_lambda_log_group_name: process.env.AWS_LAMBDA_LOG_GROUP_NAME,
//     aws_lambda_log_stream_name: process.env.AWS_LAMBDA_LOG_STREAM_NAME,
//     aws_lambda_runtime_api: process.env.AWS_LAMBDA_RUNTIME_API,
//     lang: process.env.LANG,
//     tz: process.env.TZ,
//     lambda_task_root: process.env.LAMBDA_TASK_ROOT,
//     lambda_runtime_dir: process.env.LAMBDA_RUNTIME_DIR,
//     path: process.env.PATH,
//     ld_library_path: process.env.LD_LIBRARY_PATH,
// };

