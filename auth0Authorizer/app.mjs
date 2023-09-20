import {authenticate} from './jwtUtil.mjs';
// Environment variable access
import dotenv from 'dotenv';
dotenv.config();

let data;

// Lambda function wrapper around authenticate
export const lambdaHandler = async (event, context, callback) => {
    console.log({event, context, callback})
  try {
    data = await authenticate(event, context, callback);
  }
  catch (err) {
      console.log(err);
      return context.fail("Unauthorized");
  }
  return data;
};
