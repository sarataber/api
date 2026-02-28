import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PresignRequestDto } from './dto/presign.dto';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Post('presign')
  presign(@Body() dto: PresignRequestDto) {
    return this.documents.presignUpload(dto);
  }

  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.documents.create(dto);
  }

  @Get()
  list() {
    return this.documents.list();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documents.deleteSoft(id);
  }

  @Get(':id/download')
  download(@Param('id') id: string) {
    return this.documents.presignDownload(id);
  }
}