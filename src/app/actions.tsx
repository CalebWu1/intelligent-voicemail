'use server';
import { put } from '@vercel/blob';

// Uploads the file to Vercel Blob and returns the URL
export async function uploadVoiceNote(formData: FormData) {
  const file = formData.get('file') as File;

  const blob = await put(`voicemails/${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}