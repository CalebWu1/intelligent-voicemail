'use server';
import { put } from '@vercel/blob';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

// Uploads the file to Vercel Blob and returns the URL
export async function uploadVoiceNote(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file) throw new Error("No file provided");

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 25MB limit");
  }

  if (file.type && !file.type.startsWith('audio/')) {
    throw new Error("Invalid file type: expected an audio file");
  }

  const blob = await put(`voicemails/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return blob.url;
}
