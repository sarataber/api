import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PresignRequestDto } from './dto/presign.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) { }

  async presignUpload(dto: PresignRequestDto) {
    // מחזיר URL + key. client מעלה ל-S3 ישירות.
    return this.s3.presignUpload({
      filename: dto.filename,
      contentType: dto.contentType,
    });
  }

  async create(dto: CreateDocumentDto) {
    // שומר metadata ב-DB אחרי שהלקוח העלה ל-S3
    return this.prisma.document.create({
      data: {
        title: dto.title,
        s3Key: dto.key,
        contentType: dto.contentType ?? null,
        size: dto.size ?? null,
      },
    });
  }

  async list() {
    return this.prisma.document.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteSoft(id: string) {
    return this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async presignDownload(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id, deletedAt: null } });
    if (!doc || doc.deletedAt) {
      throw new NotFoundException('Document not found');;
    }
    return this.s3.presignDownload({ key: doc.s3Key });
  }
}