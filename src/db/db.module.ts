import { Module } from "@nestjs/common";
import { DbController } from "./db.controller";
import { DbService } from "./db.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports:[PrismaModule],
    controllers: [DbController],
    providers: [DbService]
})
export class DbModule { }