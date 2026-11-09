import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

export function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const region = 'auto'; // Cloudflare R2 uses 'auto'

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Cloudflare R2 storage credentials are not properly configured in environment variables.');
  }

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || 'vision';
}

export function getR2PublicUrl(key: string): string {
  const baseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
  if (!baseUrl) {
    throw new Error('R2_PUBLIC_URL environment variable is required.');
  }
  const cleanKey = key.replace(/^\//, '');
  return `${baseUrl}/${cleanKey}`;
}

export async function uploadToR2(
  key: string,
  data: string | Uint8Array | Buffer,
  contentType: string = 'application/octet-stream'
) {
  const s3 = getR2Client();
  const bucket = getR2BucketName();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: typeof data === 'string' ? Buffer.from(data) : data,
    ContentType: contentType,
  });
  await s3.send(command);
  return {
    bucket,
    key,
    publicUrl: getR2PublicUrl(key),
  };
}

export async function listR2Objects(prefix?: string) {
  const s3 = getR2Client();
  const bucket = getR2BucketName();
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });
  const response = await s3.send(command);
  return response.Contents || [];
}

export async function deleteFromR2(key: string) {
  const s3 = getR2Client();
  const bucket = getR2BucketName();
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return await s3.send(command);
}
