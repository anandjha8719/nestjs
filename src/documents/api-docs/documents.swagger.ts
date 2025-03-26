import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateDocumentDto } from '../dto/update-document.dto';

export const ApiAuth = () => {
  return applyDecorators(ApiBearerAuth('Authorization'));
};

export const ApiUploadDocument = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Upload a file with title' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Document title' },
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload',
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Document uploaded successfully' }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid input' }),
    ApiAuth(),
  );
};

export const ApiGetAllDocuments = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve all documents' }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved documents list',
    }),
    ApiAuth(),
  );
};

export const ApiGetDocumentById = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get a specific document by ID' }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique document ID',
    }),
    ApiResponse({ status: 200, description: 'Document found successfully' }),
    ApiResponse({ status: 404, description: 'Document not found' }),
    ApiAuth(),
  );
};

export const ApiUpdateDocument = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update a document' }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique document ID',
    }),
    ApiBody({ type: UpdateDocumentDto }),
    ApiResponse({ status: 200, description: 'Document updated successfully' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiAuth(),
  );
};

export const ApiDeleteDocument = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a document' }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique document ID',
    }),
    ApiResponse({ status: 200, description: 'Document deleted successfully' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiAuth(),
  );
};

export const ApiTriggerIngestion = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Trigger document ingestion' }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique document ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Ingestion process started successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiAuth(),
  );
};

export const ApiRetryIngestion = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Retry document ingestion' }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique document ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Ingestion retry initiated successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiAuth(),
  );
};

export const ApiGetIngestionStatus = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get document ingestion status' }),
    ApiParam({
      name: 'id',
      type: 'number',
      required: true,
      description: 'Unique document ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Ingestion status retrieved successfully',
    }),
    ApiAuth(),
  );
};
