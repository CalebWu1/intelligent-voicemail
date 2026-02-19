'use client';

import { useState, useRef } from "react";
import { Edit2, Users, Code, MoreHorizontal } from 'lucide-react';
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { DashboardChart } from "./dashboardChart";
import { RecordButton } from "./recordbutton";
import { uploadVoiceNote } from "../actions";
import { api } from "~/trpc/react";

export function DashboardWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Router Initialisation
  const { mutate, data, isPending } = api.voicemail.transcribe.useMutation({
    onSuccess: (data) => {
      console.log("Transcription:", data);
      // do something with data e.g. set state
    },
    onError: (error) => {
      console.error("Transcription failed:", error);
    },
  });

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported("audio/webm") 
      ? "audio/webm" 
      : MediaRecorder.isTypeSupported("audio/mp4") 
      ? "audio/mp4" 
      : "audio/webm";
    const recorder = new MediaRecorder(stream, {mimeType});
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: mimeType });
        // Add number to voicemail to fix overriding
        const audioFile = new File([audioBlob], "voicemail.mp3", { type: mimeType });

        const formData = new FormData();
        formData.append('file', audioFile);
        try {
          const blobUrl = await uploadVoiceNote(formData);
          mutate({ voicemailUrl: blobUrl, mimeType: mimeType });
          console.log("Uploaded successfully:", blobUrl);
        } catch (error) {
          console.error("Upload failed:", error);
        }

        stream.getTracks().forEach(track => track.stop());
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      await startRecording();
    } else {
      setIsRecording(false);
      // Access the ref to stop the recording immediately
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    }
  };

  return (
    <div className='flex flex-col h-screen overflow-hidden'>

      <div className="z-20 shrink-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} sidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
          <header className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-[#1A0B3C]">Overnight Voicemails</h2>
            <div className="flex items-center gap-3">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-shadow shadow-sm active:scale-95">
                <Edit2 size={14} /> Edit
              </button>
              <div className="flex items-center border border-slate-200 rounded-full bg-white divide-x divide-slate-200 overflow-hidden shadow-sm">
                <button className="p-2.5 hover:bg-slate-50 text-slate-500"><Users size={18} /></button>
                <button className="px-4 py-1.5 hover:bg-slate-50 text-slate-500 text-sm font-semibold">Share</button>
                <button className="p-2.5 hover:bg-slate-50 text-slate-500"><Code size={18} /></button>
                <button className="p-2.5 hover:bg-slate-50 text-slate-500"><MoreHorizontal size={18} /></button>
              </div>
            </div>
          </header>

          <div className="flex-1">
            <DashboardChart />
          </div>
 
          <RecordButton isRecording={isRecording} toggleRecording={toggleRecording}/>
        </main>
      </div>
    </div>
  );
}