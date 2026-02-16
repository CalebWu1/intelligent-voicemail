import React, { type ReactNode } from 'react';
import { 
  Plus, Edit2, Users, Share2, Code, MoreHorizontal, ChevronDown, 
  Sidebar
} from 'lucide-react';
import { Navbar } from './_components/navbar';
import { DashboardChart } from './_components/dashboardChart';


// --- Types & Interfaces ---



interface FilterBadgeProps {
  label: string;
  value: string;
}
// --- Reusable UI Components ---



const FilterBadge: React.FC<FilterBadgeProps> = ({ label, value }) => (
  <div className="bg-slate-100 px-3 py-1 rounded-sm border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
    <p className="text-[10px] text-slate-500 font-bold uppercase">{label}</p>
    <div className="flex items-center gap-1">
      <span className="text-sm font-semibold text-slate-700">{value}</span>
      <ChevronDown size={14} className="text-slate-400" />
    </div>
  </div>
);



export default async function Home() {
  // Dashboard Page

  return (
    <div className='flex-col flex'>
      <Navbar/>
      <div className="flex min-h-screen bg-white font-sans text-slate-900 overflow-hidden">
        
        {/* Dark Sidebar */}
        <aside className="w-64 bg-[#1A0B3C] flex flex-col shrink-0 shadow-xl">
          <div className="p-4 flex justify-between items-center border-b border-white/10">
            <h1 className="font-bold tracking-tight text-white">DASHBOARDS</h1>
            <button className="bg-pink-500 hover:bg-pink-600 text-white p-1 rounded-full transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <Sidebar/>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Top Header */}
          <header className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
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

          {/* Filter Toolbar */}
          <div className="px-6 py-2.5 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex gap-3">
              <FilterBadge label="Date range" value="This year" />
              <FilterBadge label="Departments" value="All" />
              <FilterBadge label="Specializations" value="All" />
            </div>
            <button className="text-sm text-slate-400 font-semibold hover:text-slate-600 flex items-center gap-1 transition-colors">
              My views <ChevronDown size={14} />
            </button>
          </div>
          {/* Summary Chart of Pending Voicemail */}
          <DashboardChart/>
        </main>
      </div>
    </div>
  );
}
