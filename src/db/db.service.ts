import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { log } from 'node:console';

@Injectable()
export class DbService {
    constructor(private readonly prismaService: PrismaService) { }

    async checkDb() {
        log("ffff")
        const count = await this.prismaService.document.count();
        log(count)
        return { documentsCount: count };
    }
}