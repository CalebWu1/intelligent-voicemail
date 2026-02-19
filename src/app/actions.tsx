'use server';
import { put } from '@vercel/blob';

// Uploads the file to Vercel Blob and returns the URL
export async function uploadVoiceNote(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error("No file provided");

  const blob = await put(`voicemails/${file.name}`, file, {
    access: 'public',
    // allowOverwrite: true,
    // Uncomment after testing
    addRandomSuffix: true,
  });

  return blob.url;
}