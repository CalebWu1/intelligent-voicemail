// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({});

// export async function transcribeAudio(blobUrl: string) {
//   const model = ai.models

//   const prompt = `
//     Listen to this voicemail. 
//     1. Transcribe the text accurately.
//     2. Assign a priority: Emergency, High, Medium, or Low.
//     3. Suggest 2-3 medical tags.
//     Return as JSON.
//   `;

//   // Fetch the audio from the blob URL and send to Gemini
//   const response = await fetch(blobUrl);
//   const audioBuffer = await response.arrayBuffer();

//   const result = await model.generateContent([
//     prompt,
//     {
//       inlineData: {
//         data: Buffer.from(audioBuffer).toString("base64"),
//         mimeType: "audio/mpeg"
//       }
//     }
//   ]);

//   return JSON.parse(result.response.text());
// }