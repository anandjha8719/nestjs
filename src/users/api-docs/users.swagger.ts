import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update-user.dto';

export const ApiAuth = () => {
  return applyDecorators(ApiBearerAuth('Authorization'));
};

export const ApiCreateUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description: 'Create a user account (Admin only)',
    }),
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
            description: 'User name (Optional)',
          },
          role: {
            type: 'string',
            example: 'ADMIN',
            description: 'Role of user (Optional, default: EDITOR)',
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'User successfully created' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiAuth(),
  );
};

export const ApiGetUserById = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve a user by ID',
      description:
        'Fetch user details by their unique identifier (Admin or Editor)',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique identifier of the user',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'User details retrieved successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
    ApiAuth(),
  );
};

export const ApiUpdateUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a user',
      description: 'Update user details (Admin only)',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique identifier of the user to update',
      example: 1,
    }),
    ApiBody({ type: UpdateUserDto, description: 'User update details' }),
    ApiResponse({ status: 200, description: 'User successfully updated' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
    ApiAuth(),
  );
};

export const ApiDeleteUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a user',
      description: 'Permanently remove a user account (Admin only)',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique identifier of the user to delete',
      example: 1,
    }),
    ApiResponse({ status: 200, description: 'User successfully deleted' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
    ApiAuth(),
  );
};
