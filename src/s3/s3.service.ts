import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_S3_BUCKET, AWS_SECRET_ACCESS_KEY, S3_PREFIX } from "../config/env";

@Injectable()
export class S3Service {

    private readonly bucket: string;
    private readonly prefix: string;
    private readonly s3: S3Client;
    constructor() {
        const region = AWS_REGION;
        const _bucket = AWS_S3_BUCKET;
        if (!region) throw new Error('AWS_REGION is missing');
        if (!_bucket) throw new Error('AWS_S3_BUCKET is missing');

        this.bucket = _bucket;
        this.prefix = (S3_PREFIX || 'uploads').replace(/\/$/, '');

        this.s3 = new S3Client({
            region,
            credentials: AWS_ACCESS_KEY_ID
                ? {
                    accessKeyId: AWS_ACCESS_KEY_ID!,
                    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
                }
                : undefined,
        });
    }

    private sanitizeFilename(name: string): string {
        // מנקה תווים בעייתיים
        return String(name).replace(/[^\w.\-()]/g, '_');
    }

    async presignUpload(params: { filename: string; contentType: string }) {
        const uuid = randomUUID();
        const safeName = this.sanitizeFilename(params.filename);
        const key = `${this.prefix}/${uuid}-${safeName}`;

        const cmd = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: params.contentType,
        });

        const uploadUrl = await getSignedUrl(this.s3, cmd, { expiresIn: 300 }); // 5 דקות
        return { uploadUrl, key, bucket: this.bucket };
    }

    async presignDownload(params: { key: string }) {
        const cmd = new GetObjectCommand({
            Bucket: this.bucket,
            Key: params.key,
        });

        const downloadUrl = await getSignedUrl(this.s3, cmd, { expiresIn: 300 });
        return { downloadUrl };
    }
}

