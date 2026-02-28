import { Module } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { S3Module } from "src/s3/s3.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports:[S3Module,PrismaModule],
    controllers:[DocumentsController],
    providers:[DocumentsService]
    
})
export class DocumentModule{

}