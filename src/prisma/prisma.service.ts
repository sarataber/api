import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '../config/env';


@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly pool: Pool;

    constructor() {
        const connectionString = DATABASE_URL!;
        console.log(DATABASE_URL);

        if (!connectionString) {
            throw new Error('DATABASE_URL is missing');
        }

        const pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
            keepAlive: true,
        });

        const adapter = new PrismaPg(pool);
        super({ adapter });

        this.pool = pool;
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
    }


}