'use client';

import { useState } from "react";
import { Play, Clock, Tag, Filter, ArrowUpDown, MoreVertical } from 'lucide-react';
import { Navbar } from "~/app/_components/navbar";
import { Sidebar } from "~/app/_components/sidebar";

interface Voicemail {
  id: string;
  patient: string;
  duration: string;
  timestamp: string;
  tags: { label: string; color: string }[];
  status: 'New' | 'Processed' | 'Flagged';
}

export function InboxWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [sortBy, setSortBy] = useState('newest');

  const voicemails: Voicemail[] = [
    {
      id: '1',
      patient: 'Unknown Caller (Emergency)',
      duration: '0:45',
      timestamp: '2 mins ago',
      tags: [
        { label: 'Emergency', color: 'bg-red-100 text-red-700' },
        { label: 'Cardiology', color: 'bg-blue-100 text-blue-700' }
      ],
      status: 'New'
    },
    {
      id: '2',
      patient: 'James Wilson',
      duration: '1:12',
      timestamp: '1 hour ago',
      tags: [
        { label: 'Refill Request', color: 'bg-purple-100 text-purple-700' },
        { label: 'Pharmacy', color: 'bg-slate-100 text-slate-700' }
      ],
      status: 'Processed'
    },
  ];

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
        <div className="flex flex-col h-full">
          {/* 2. Filter & Sort Bar */}
          <div className="px-8 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/30 gap-4">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <Filter size={14} /> Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <ArrowUpDown size={14} /> Sort: {sortBy}
              </button>
            </div>
            <span className="text-sm text-slate-500 font-medium">Showing {voicemails.length} voicemails</span>
          </div>

          {/* 3. The Responsive Grid */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {voicemails.map((vm) => (
                <div key={vm.id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-pink-50 transition-colors">
                        <Play size={20} className="text-slate-600 group-hover:text-pink-500" />
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 truncate mb-1">{vm.patient}</h3>
                    <div className="flex items-center gap-3 text-slate-400 text-xs mb-4">
                      <span className="flex items-center gap-1"><Clock size={12} /> {vm.duration}</span>
                      <span>•</span>
                      <span>{vm.timestamp}</span>
                    </div>
                  </div>

                  {/* Associated Tags Section */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                    {vm.tags.map((tag, idx) => (
                      <span key={idx} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tag.color}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}