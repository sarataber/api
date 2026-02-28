import { Controller, Get } from "@nestjs/common"
import { DbService } from "./db.service"
import { log } from "node:console"

@Controller("db")
export class DbController {

    constructor(private readonly dbService: DbService) { }
    @Get("db-check")
    async dbCheck() {
        log("hi")
        return await this.dbService.checkDb()
    }
}