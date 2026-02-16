import React, { useState, useRef } from 'react';
import { Mic, Upload, Loader2, FileText, X } from 'lucide-react';

interface TranscriptionModuleProps {
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceTranscription: React.FC<TranscriptionModuleProps> = ({ onTranscriptionComplete }) => {
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsTranscribing(true);

    try {
      // Integration Point: Here is where you would call your Gemini API function
      // const text = await transcribeWithGemini(file);
      
      // Simulating API Latency
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const mockText = "Patient reports persistent chest pain for 3 days...";
      
      onTranscriptionComplete(mockText);
    } catch (error) {
      console.error("Transcription failed", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="mx-4 mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Mic size={16} className="text-pink-500" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">Voice Scribe</span>
      </div>

      {!fileName ? (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 px-4 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center gap-2 hover:bg-white/5 hover:border-pink-500/50 transition-all group"
        >
          <Upload size={20} className="text-slate-400 group-hover:text-pink-400" />
          <span className="text-[10px] text-slate-400 font-medium">Upload audio memo</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="audio/*" 
            className="hidden" 
          />
        </button>
      ) : (
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {isTranscribing ? (
              <Loader2 size={18} className="text-pink-500 animate-spin shrink-0" />
            ) : (
              <FileText size={18} className="text-emerald-400 shrink-0" />
            )}
            <div className="truncate">
              <p className="text-[11px] text-white font-medium truncate">{fileName}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">
                {isTranscribing ? 'Transcribing...' : 'Completed'}
              </p>
            </div>
          </div>
          {!isTranscribing && (
            <button onClick={() => setFileName(null)} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      )}

      <p className="mt-3 text-[9px] text-slate-500 leading-tight italic">
        Powered by Gemini 3 Flash for medical-grade accuracy.
      </p>
    </div>
  );
};