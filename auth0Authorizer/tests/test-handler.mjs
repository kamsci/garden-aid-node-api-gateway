'use strict';

import { lambdaHandler } from '../app.mjs';
import { expect } from 'chai';
var event, context;

// Get temporary test access token from Auth0
const ACCESS_TOKEN = "";

describe('Tests auth0', async function () {
    it('verifies successful response', async () => {
        event = {
            "type" : "TOKEN",
            "authorizationToken" : `Bearer ${ACCESS_TOKEN}`,
            "methodArn":"arn:aws:execute-api:us-east-1:1234567890:apiId/stage/method/resourcePath"
        };

        const result = await lambdaHandler(event, context)

        console.log('Tests auth0 result', result);
        expect(result).to.be.an('object');
        expect(result).to.have.property('principalId');
    });
});