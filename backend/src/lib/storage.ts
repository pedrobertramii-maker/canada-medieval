import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.storage.cloudinary.cloudName,
  api_key: env.storage.cloudinary.apiKey,
  api_secret: env.storage.cloudinary.apiSecret,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

export async function uploadImage(
  buffer: Buffer,
  folder: string = env.storage.cloudinary.folder,
  fileName?: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${env.storage.cloudinary.folder}/${folder}`,
        public_id: fileName ? fileName.replace(/\.[^/.]+$/, '') : undefined,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.error('Erro ao deletar imagem:', e);
  }
}
