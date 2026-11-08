import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export function getStorageClient() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'eu-central-1';

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Neon Object Storage environment variables are missing');
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

export async function uploadAsset(bucketName: string, key: string, data: string | Uint8Array, contentType: string = 'text/plain') {
  const s3 = getStorageClient();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: typeof data === 'string' ? Buffer.from(data) : data,
    ContentType: contentType,
  });
  return await s3.send(command);
}

export async function listBucketObjects(bucketName: string, prefix?: string) {
  const s3 = getStorageClient();
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });
  const response = await s3.send(command);
  return response.Contents || [];
}
