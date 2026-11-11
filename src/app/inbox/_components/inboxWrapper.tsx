'use client';

import { useState } from "react";
import { Play, Clock, MoreVertical, CalendarArrowDown, CalendarArrowUp, ClockArrowDown, ClockArrowUp, Dot } from 'lucide-react';
import { Navbar } from "~/app/_components/navbar";
import { Sidebar } from "~/app/_components/sidebar";
import type { UrgencyLevel } from "generated/prisma";
import { api } from "~/trpc/react";
import Link from "next/link";
import { FormControl, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

interface InboxWrapperProps {
  priorityFilter: string,
}
export function InboxWrapper({priorityFilter}: InboxWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const tabs = ["Home", "Inbox"];
  const [activeTab, setActiveTab] = useState<string>('Inbox')
  type SortOption = 'newest' | 'oldest' | 'urgency_asc' | 'urgency_desc';
  const [sortBy, setSortBy] = useState<SortOption>('urgency_desc');
  type UrgencyFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  const [filterUrgency, setFilterUrgency] = useState<UrgencyFilter>(priorityFilter as UrgencyFilter);
  const { data: voicemails = [], isLoading } = api.voicemail.getInbox.useQuery({ sortBy, urgency: filterUrgency });

  // Helper function for time display
  function formatTimestamp(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    // For older dates, return formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

const tagColor = (tag: string) => {
  const normalizedTag = tag.toUpperCase();

  if (normalizedTag.includes("CARDI") || normalizedTag.includes("CHEST") || normalizedTag.includes("BLOOD")) {
    return "bg-rose-100 text-rose-700";
  }

  if (normalizedTag.includes("BREATH") || normalizedTag.includes("LUNG") || normalizedTag.includes("RESPIRATORY")) {
    return "bg-sky-100 text-sky-700";
  }

  if (normalizedTag.includes("SCHEDUL") || normalizedTag.includes("APPOINTMENT") || normalizedTag.includes("HOUR")) {
    return "bg-slate-100 text-slate-700";
  }

  if (normalizedTag.includes("FEVER") || normalizedTag.includes("PEDIATRIC") || normalizedTag.includes("RASH")) {
    return "bg-yellow-100 text-yellow-700";
  }

  if (normalizedTag.includes("URGENT") || normalizedTag.includes("EMERGENCY")) {
    return "bg-red-100 text-red-700";
  }

  if (normalizedTag.includes("REFILL")) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
};

  const urgencyColor = (urgency: UrgencyLevel) => {
    const colors: Record<string, string>= {
      EMERGENCY: "bg-[#ef4444cc]",
      HIGH: "bg-[#f97316cc]",
      MEDIUM: "bg-[#eab308cc]",
      LOW: "bg-[#22c55ecc]",
    };
    return colors[urgency] ?? "bg-slate-100 text-slate-700";
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

        {/* Main Content */}
        <div className="flex flex-col h-full">
          {/* 2. Filter & Sort Bar */}
          <div className="px-8 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/30 gap-4">
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <FormControl size="small">
                  <Select
                    value={filterUrgency}
                    onChange={(e: SelectChangeEvent<UrgencyFilter>) => setFilterUrgency(e.target.value as UrgencyFilter)}
                    renderValue={(value) => {
                      const labels: Record<string, string> = {
                        ALL: 'Filter',
                        LOW: 'Low',
                        MEDIUM: 'Medium',
                        HIGH: 'High',
                        EMERGENCY: 'Emergency',
                      };
                      return <span className="text-sm font-medium">{labels[value]}</span>;
                    }}
                    MenuProps={{
                      disablePortal: true,
                      PaperProps: {
                        sx: { borderRadius: '0.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', mt: 0.5 }
                      }
                    }}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      width: 'auto',
                      minWidth: 0,
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                    }}
                  >
                    <MenuItem value="ALL" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>All Urgencies</MenuItem>
                    <MenuItem value="LOW" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Dot className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Low
                    </MenuItem>
                    <MenuItem value="MEDIUM" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Dot className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Medium
                    </MenuItem>
                    <MenuItem value="HIGH" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Dot className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> High
                    </MenuItem>
                    <MenuItem value="EMERGENCY" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Dot className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Emergency
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex width-auto items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <FormControl size="small">
                  <Select
                    value={sortBy}
                    onChange={(e: SelectChangeEvent) => setSortBy(e.target.value as SortOption)}
                    renderValue={(value) => {
                      const labels: Record<string, string> = {
                        newest: 'Newest First',
                        oldest: 'Oldest First',
                        urgency_desc: 'Urgency: High → Low',
                        urgency_asc: 'Urgency: Low → High',
                      };
                      return <span className="text-sm font-medium">{labels[value]}</span>;
                    }}
                    MenuProps={{
                      disablePortal: true,
                      PaperProps: {
                        sx: {
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          border: '1px solid #e2e8f0',
                          mt: 0.5,
                        }
                      }
                    }}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 300,
                      width: 'auto',
                      minWidth: 0,
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                    }}
                  >
                    <MenuItem value="newest"><CalendarArrowDown className="w-5 h-5 mr-2"/>Newest First</MenuItem>
                    <MenuItem value="oldest"><CalendarArrowUp className="w-5 h-5 mr-2"/>Oldest First</MenuItem>
                    <MenuItem value="urgency_desc"><ClockArrowDown className="w-5 h-5 mr-2"/>Urgency: High → Low</MenuItem>
                    <MenuItem value="urgency_asc"><ClockArrowUp className="w-5 h-5 mr-2"/>Urgency: Low → High</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <span className="text-sm text-slate-500 font-medium">Showing {voicemails.length} voicemails</span>
          </div>

          {/* 3. The Responsive Grid */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {isLoading ? (
                <p className="text-slate-400">Loading voicemails...</p>
              ) : (
                voicemails.map((vm) => (
                  <Link
                    href={`/inbox/${vm.id}`}
                    key={vm.id}
                  >
                    <div className={`group border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between bg-white`}>
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-pink-50 transition-colors">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(vm.audioUrl, '_blank', 'noopener,noreferrer');
                              }}
                              className="flex items-center justify-center focus:outline-none cursor-pointer"
                              aria-label="Play recording"
                            >
                              <Play size={20} className="text-slate-600 group-hover:text-pink-500" />
                            </span>
                          </div>

                          {/* Top right: urgency badge*/}
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-black ${urgencyColor(vm.priority)}`}>
                              {vm.priority}
                            </span>
                            <span className="text-slate-400 hover:text-slate-600">
                              <MoreVertical size={18} />
                            </span>
                          </div>
                        </div>

                        <h3 className="font-bold text-slate-900 truncate mb-1">{vm.patientName}</h3>
                        <div className="flex items-center gap-3 text-slate-400 text-xs mb-4">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {formatTimestamp(vm.updatedAt)}
                          </span>
                          <span>•</span>
                          <span>{vm.status}</span>
                        </div>
                      </div>

                      {/* Associated Tags Section */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                        {((vm.medicalTags as string[] | undefined) ?? []).map((tag: string, idx: number) => (
                          <span key={idx} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagColor(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}