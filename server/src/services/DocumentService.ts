import { Client as MinIOClient } from 'minio';
import { DocumentInfo } from '../models/Appointment';
import logger from '../shared/logger';
import fs from 'fs';
import path from 'path';

export class DocumentService {
  private minioClient: MinIOClient;
  private bucketName: string;

  constructor() {
    this.minioClient = new MinIOClient({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });

    this.bucketName = process.env.MINIO_BUCKET_NAME || 'appointment-documents';
    this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');

        // Set public read policy for the bucket
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };

        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy)
        );
        logger.info(`Created bucket: ${this.bucketName}`);
      }
    } catch (error) {
      logger.error(
        `Failed to ensure bucket exists: ${(error as Error).message}`
      );
    }
  }

  async uploadDocument(
    file: Express.Multer.File,
    documentName: string,
    userId: number
  ): Promise<DocumentInfo> {
    try {
      // Check if file exists
      if (!file || !file.path) {
        throw new Error('File not found or invalid');
      }

      // Check if file exists on disk
      if (!fs.existsSync(file.path)) {
        throw new Error(`File not found at path: ${file.path}`);
      }

      const fileExtension = path.extname(file.originalname);
      const objectName = `user_${userId}/${documentName}_${Date.now()}${fileExtension}`;

      // Upload file to MinIO
      await this.minioClient.fPutObject(
        this.bucketName,
        objectName,
        file.path,
        {
          'Content-Type': file.mimetype,
          'Content-Disposition': `inline; filename="${file.originalname}"`,
        }
      );

      // Clean up local file
      fs.unlinkSync(file.path);

      // Generate presigned URL or public URL
      const url = await this.getDocumentUrl(objectName);

      return {
        name: documentName,
        url,
      };
    } catch (error) {
      logger.error(`Document upload failed: ${(error as Error).message}`);
      throw new Error(`Document upload failed: ${(error as Error).message}`);
    }
  }

  async uploadMultipleDocuments(
    files: Express.Multer.File[],
    documentNames: string[],
    userId: number
  ): Promise<DocumentInfo[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadDocument(file, documentNames[index] || 'Document', userId)
    );

    return Promise.all(uploadPromises);
  }

  async deleteDocument(url: string): Promise<void> {
    try {
      const objectName = this.extractObjectNameFromUrl(url);
      await this.minioClient.removeObject(this.bucketName, objectName);
      logger.info(`Deleted document: ${objectName}`);
    } catch (error) {
      logger.error(`Document deletion failed: ${(error as Error).message}`);
    }
  }

  private async getDocumentUrl(objectName: string): Promise<string> {
    // Option 1: Use presigned URL (expires after specified time)
    // return await this.minioClient.presignedGetObject(this.bucketName, objectName, 24 * 60 * 60); // 24 hours

    // Option 2: Use public URL (if bucket is public)
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';
    return `${protocol}://${endpoint}:${port}/${this.bucketName}/${objectName}`;
  }

  private extractObjectNameFromUrl(url: string): string {
    const urlParts = url.split('/');
    const bucketIndex = urlParts.indexOf(this.bucketName);
    return urlParts.slice(bucketIndex + 1).join('/');
  }

  async getDocumentStream(objectName: string): Promise<NodeJS.ReadableStream> {
    try {
      return await this.minioClient.getObject(this.bucketName, objectName);
    } catch (error) {
      logger.error(
        `Failed to get document stream: ${(error as Error).message}`
      );
      throw new Error(
        `Failed to get document stream: ${(error as Error).message}`
      );
    }
  }
}
