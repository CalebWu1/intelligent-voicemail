'use client';

import { useState } from "react";
import { Edit2, Users, Code, MoreHorizontal } from 'lucide-react';
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { DashboardChart } from "./dashboardChart";

export function DashboardWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          
        </main>
      </div>
    </div>
  );
}