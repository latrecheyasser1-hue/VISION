import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

const DEFAULT_R2_ENDPOINT = 'https://73b22fc72b6c98643bbab88ae6dbbfad.r2.cloudflarestorage.com';
const DEFAULT_R2_KEY_ID = 'c62c2d58a45a508da6bf33839e661585';
const DEFAULT_R2_SECRET = '24dd0a0922dbf40e23ae26ffb23be7d6889d240c7e812dc755aac7eedfbf1144';
const DEFAULT_R2_PUBLIC_URL = 'https://pub-688a9ac86fa04eaebf3f982ff63502d9.r2.dev';

export function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT || DEFAULT_R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || DEFAULT_R2_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || DEFAULT_R2_SECRET;
  const region = 'auto'; // Cloudflare R2 uses 'auto'

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
  const baseUrl = (process.env.R2_PUBLIC_URL || DEFAULT_R2_PUBLIC_URL).replace(/\/$/, '');
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
