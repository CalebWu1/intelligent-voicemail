'use client';

import { Mic, Square } from "lucide-react";

interface RecordButtonProps {
  isRecording: boolean;
  toggleRecording: () => void;
}

export function RecordButton({ isRecording, toggleRecording }: RecordButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Recording Status Label */}
      {isRecording && (
        <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-red-100 flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Recording...</span>
        </div>
      )}
      <button
        onClick={toggleRecording}
        className={`
          group flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 active:scale-90
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-100' 
            : 'bg-[#1A0B3C] hover:bg-[#2D165C] hover:-translate-y-1'
          }
        `}
      >
        {isRecording ? (
          <Square className="text-white fill-current" size={24} />
        ) : (
          <Mic className="text-white group-hover:scale-110 transition-transform" size={28} />
        )}
      </button>
    </div>
  );
}