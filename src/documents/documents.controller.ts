import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Document title',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload a file with title',
    description:
      'Receives form-data with title(text) & file(file). Requires a valid JWT token obtained from the login endpoint.',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueName}${path.extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'application/pdf',
          'text/plain',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(`File type ${file.mimetype} not supported`),
            false,
          );
        }
      },
    }),
  )
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //   console.log(' Received file:', file);
    return this.documentsService.create(createDocumentDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all documents',
    description: 'Fetches a list of all documents. Requires valid JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved documents list',
  })
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific document by ID',
    description: 'Retrieves details of a document by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the document',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Document found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a document',
    description:
      'Updates an existing document. Restricted to Admin and Editor roles.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the document to update',
    required: true,
    example: 1,
  })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a document',
    description:
      'Permanently removes a document. Restricted to Admin role only.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the document to delete',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }

  @Post(':id/ingest')
  @ApiOperation({
    summary: 'Trigger document ingestion',
    description:
      'Initiates the ingestion process for a specific document. Restricted to Admin and Editor roles.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the document to ingest',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestion process started successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  triggerIngestion(@Param('id') id: string) {
    return this.documentsService.triggerIngestion(+id);
  }

  @Post(':id/retry')
  @ApiOperation({
    summary: 'Retry document ingestion',
    description:
      'Retries the ingestion process for a document that previously failed. Restricted to Admin and Editor roles.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the document to retry ingestion',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestion retry initiated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  retryIngestion(@Param('id') id: string) {
    return this.documentsService.retryIngestion(+id);
  }

  @Get(':id/status')
  @ApiOperation({
    summary: 'Get document ingestion status',
    description:
      'Retrieves the current ingestion status of a specific document',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the document',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestion status retrieved successfully',
  })
  getIngestionStatus(@Param('id') id: string) {
    return this.documentsService.getIngestionStatus(+id);
  }
}
