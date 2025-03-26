import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

export const ApiAuthController = () => {
  return applyDecorators(ApiBearerAuth());
};

export const ApiRegister = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            example: 'anand@test.com',
            description: 'User email (Required)',
          },
          password: {
            type: 'string',
            example: 'pass12345',
            description: 'User password (Required)',
          },
          name: {
            type: 'string',
            example: 'Anand',
            description: 'User first name (Optional)',
          },
          role: {
            type: 'string',
            example: 'ADMIN',
            description: 'Role of user (Optional, default: EDITOR)',
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'User registered successfully' }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid input' }),
  );
};

export const ApiLogin = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Login to get an access token' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            example: 'anand@test.com',
            description: 'User email (Required)',
          },
          password: {
            type: 'string',
            example: 'pass12345',
            description: 'User password (Required)',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Successful login, returns JWT token',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid credentials',
    }),
  );
};

export const ApiGetProfile = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get the profile of the logged-in user',
      description:
        'Requires a valid JWT token in the Authorization header (Bearer <token>).',
    }),
    ApiResponse({ status: 200, description: 'Returns the user profile' }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
  );
};
