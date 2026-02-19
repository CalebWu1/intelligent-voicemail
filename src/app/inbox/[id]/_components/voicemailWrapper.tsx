'use client';

import { useState } from "react";
import { ArrowLeft, Play, CheckCircle, UserPlus, Clock, Tag, ExternalLink, Mic, Save, X, Pencil } from 'lucide-react';
import { Navbar } from "~/app/_components/navbar";
import { Sidebar } from "~/app/_components/sidebar";
import type { UrgencyLevel, Voicemail, Department } from "generated/prisma";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface EditForm {
  patientName: string;
  doctorName: string;
  summary: string;
  transcript: string;
  priority: UrgencyLevel;
  department: Department;
  medicalTags: string;
}


export function VoicemailWrapper({ voicemail }: { voicemail: Voicemail }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Inbox')
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    patientName: voicemail.patientName ?? '',
    doctorName: voicemail.doctorName ?? '',
    summary: voicemail.summary ?? '',
    transcript: voicemail.transcript ?? '',
    priority: voicemail.priority,
    department: voicemail.department,
    medicalTags: voicemail.medicalTags.join(', '),
  });

  const tagColor = (tag: string) => {
    const colors: Record<string, string> = {
      General: "bg-slate-100 text-slate-700",
      Refill: "bg-blue-100 text-blue-700",
      Cardiovascular: "bg-rose-100 text-rose-700",
      Skeletal: "bg-stone-100 text-stone-700",
      Muscular: "bg-orange-100 text-orange-700",
      Nervous: "bg-violet-100 text-violet-700",
      Respiratory: "bg-sky-100 text-sky-700",
      Digestive: "bg-emerald-100 text-emerald-700",
      Urinary: "bg-cyan-100 text-cyan-700",
      Immune: "bg-indigo-100 text-indigo-700",
      Endocrine: "bg-fuchsia-100 text-fuchsia-700",
      Integumentary: "bg-amber-100 text-amber-700",
      Reproductive: "bg-pink-100 text-pink-700",
      Pediatrics: "bg-yellow-100 text-yellow-700",
      Fever: "bg-red-100 text-red-700",
      Rash: "bg-purple-100 text-purple-700",
    };
    return colors[tag] ?? "bg-slate-100 text-slate-700";
  };

  const urgencyColor = (urgency: UrgencyLevel) => {
    const colors: Record<string, string> = {
      EMERGENCY: "bg-red-500 text-white",
      HIGH: "bg-orange-500 text-white",
      MEDIUM: "bg-yellow-500 text-white",
      LOW: "bg-green-500 text-white",
    };
    return colors[urgency] ?? "bg-slate-200 text-slate-700";
  };

  const updateVoicemail = api.voicemail.updateVoicemail.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      router.refresh();
    },
  });

  const handleSave = () => {
    updateVoicemail.mutate({
      id: voicemail.id,
      patientName: editForm.patientName || null,
      doctorName: editForm.doctorName || null,
      summary: editForm.summary || null,
      transcript: editForm.transcript || null,
      priority: editForm.priority,
      department: editForm.department,
      medicalTags: editForm.medicalTags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  const markComplete = api.voicemail.markComplete.useMutation({
    onSuccess: () => router.push('/inbox'),
  });

  function formatTimestamp(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <div className="z-20 shrink-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} sidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 overflow-y-auto p-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Inbox
          </button>

          <div className="max-w-3xl mx-auto flex flex-col gap-6">

            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 mr-4">
                  {isEditing ? (
                    <input
                      className="text-2xl font-bold text-slate-900 border border-slate-200 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 mb-1"
                      value={editForm.patientName}
                      onChange={e => setEditForm(f => ({ ...f, patientName: e.target.value }))}
                      placeholder="Patient name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                      {voicemail.patientName ?? "Unknown Patient"}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock size={13} />
                    <span>{formatTimestamp(voicemail.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <select
                      value={editForm.priority}
                      onChange={e => setEditForm(f => ({ ...f, priority: e.target.value as UrgencyLevel }))}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="EMERGENCY">Emergency</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${urgencyColor(voicemail.priority)}`}>
                      {voicemail.priority}
                    </span>
                  )}

                  {/* Edit / Save / Cancel buttons */}
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={updateVoicemail.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Save size={13} /> {updateVoicemail.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                      >
                        <X size={13} /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 border-t border-slate-100 pt-4">
                {isEditing ? (
                  <>
                    <label className="flex flex-col gap-1">
                      <span className="font-medium text-slate-700 text-xs">Doctor</span>
                      <input
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300 w-48"
                        value={editForm.doctorName}
                        onChange={e => setEditForm(f => ({ ...f, doctorName: e.target.value }))}
                        placeholder="Doctor name"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-medium text-slate-700 text-xs">Department</span>
                      <select
                        value={editForm.department}
                        onChange={e => setEditForm(f => ({ ...f, department: e.target.value as Department }))}
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      >
                        {["GENERAL","CARDIOVASCULAR","SKELETAL","MUSCULAR","NERVOUS","RESPIRATORY","DIGESTIVE","URINARY","IMMUNE","ENDOCRINE","INTEGUMENTARY","REPRODUCTIVE"].map(d => (
                          <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                        ))}
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <span><span className="font-medium text-slate-700">Doctor:</span> {voicemail.doctorName ?? "Not specified"}</span>
                    <span><span className="font-medium text-slate-700">Department:</span> {voicemail.department}</span>
                  </>
                )}
                <span><span className="font-medium text-slate-700">Status:</span> {voicemail.status}</span>
                {voicemail.assignedTo && (
                  <span><span className="font-medium text-slate-700">Assigned to:</span> {voicemail.assignedTo}</span>
                )}
              </div>
            </div>

            {/* Audio Recording */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mic size={14} /> Voice Recording
              </h2>
              <a
                href={voicemail.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl text-pink-700 font-medium text-sm transition-colors w-fit"
              >
                <Play size={16} />
                Play Recording
                <ExternalLink size={13} className="ml-1 opacity-60" />
              </a>
            </div>

            {/* Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">AI Summary</h2>
              {isEditing ? (
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[80px] resize-y"
                  value={editForm.summary}
                  onChange={e => setEditForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="Summary..."
                />
              ) : (
                <p className="text-slate-700 leading-relaxed">{voicemail.summary ?? "No summary available."}</p>
              )}
            </div>

            {/* Full Transcript */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Full Transcript</h2>
              {isEditing ? (
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[160px] resize-y"
                  value={editForm.transcript}
                  onChange={e => setEditForm(f => ({ ...f, transcript: e.target.value }))}
                  placeholder="Transcript..."
                />
              ) : (
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {voicemail.transcript ?? "No transcript available."}
                </p>
              )}
            </div>

            {/* Medical Tags */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag size={14} /> Medical Tags
              </h2>
              {isEditing ? (
                <div>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    value={editForm.medicalTags}
                    onChange={e => setEditForm(f => ({ ...f, medicalTags: e.target.value }))}
                    placeholder="Comma separated tags e.g. Cardiology, Refill"
                  />
                  <p className="text-xs text-slate-400 mt-1">Separate tags with commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {voicemail.medicalTags.length > 0 ? voicemail.medicalTags.map((tag, idx) => (
                    <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tagColor(tag)}`}>
                      {tag}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-sm">No tags assigned.</span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Actions</h2>
              <div className="flex flex-col gap-3">

                {/* Mark as Complete */}
                <button
                  onClick={() => markComplete.mutate({ id: voicemail.id })}
                  disabled={markComplete.isPending || voicemail.status === "COMPLETED"}
                  className="flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-green-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                >
                  <CheckCircle size={16} />
                  {markComplete.isPending ? "Marking..." : voicemail.status === "COMPLETED" ? "Already Completed" : "Mark as Complete"}
                </button>
                {/* Assign to Clinician */}
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-700 font-medium text-sm transition-colors w-fit"
                  >
                    <UserPlus size={16} />
                    Assign to Clinician
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}