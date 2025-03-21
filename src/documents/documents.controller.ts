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

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
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
        console.log('eeee');
        console.log(
          '📌 File received in filter:',
          file.originalname,
          file.mimetype,
        );
        const allowedTypes = [
          'application/pdf',
          'text/plain',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          console.log('✅ File accepted');
          cb(null, true);
        } else {
          console.log('❌ File rejected:', file.mimetype);
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
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }

  @Post(':id/ingest')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  triggerIngestion(@Param('id') id: string) {
    return this.documentsService.triggerIngestion(+id);
  }

  @Post(':id/retry')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  retryIngestion(@Param('id') id: string) {
    return this.documentsService.retryIngestion(+id);
  }

  @Get(':id/status')
  getIngestionStatus(@Param('id') id: string) {
    return this.documentsService.getIngestionStatus(+id);
  }
}
