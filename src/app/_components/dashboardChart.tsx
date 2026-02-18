'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Check, X } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = {
  emergency: { bg: 'rgba(239, 68, 68, 0.8)', border: '#ef4444' },
  high: { bg: 'rgba(249, 115, 22, 0.8)', border: '#f97316' },
  medium: { bg: 'rgba(234, 179, 8, 0.8)', border: '#eab308' },
  low: { bg: 'rgba(34, 197, 94, 0.8)', border: '#22c55e' },
};

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
          weight: 'bold'
        }
      },
    },
    tooltip: {
      enabled: true,
    },
  },
};

// Currently mocking data
const chartData = {
  labels: ['Low', 'Medium', 'High', 'Emergency'],
  datasets: [
    {
      label: 'Priority Level',
      data: [12, 19, 8, 5],
      backgroundColor: [COLORS.low.bg, COLORS.medium.bg, COLORS.high.bg, COLORS.emergency.bg],
      borderColor: [COLORS.low.border, COLORS.medium.border, COLORS.high.border, COLORS.emergency.border],
      borderWidth: 2,
      hoverOffset: 10,
    },
  ],
};

export function DashboardChart() {
  return (
    <div className="flex flex-col h-screen w-full max-w-[1600px] mx-auto bg-white p-4 md:p-8 gap-6 overflow-hidden">
      
      {/* Main Dashboard Area */}
      <div className="flex-1 min-h-0 max-h-[750px] bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch gap-8 transition-all">
        {/* Left side: The Chart Container */}
        <div className="flex-[2] flex flex-col min-h-0">
          <h2 className="text-slate-800 font-bold text-2xl mb-4 text-center md:text-left shrink-0">
            Voicemails Processed
          </h2>
          <div className="flex-1 relative min-h-0">
            <Doughnut options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-center items-center shadow-inner md:max-w-xs text-center">
          <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider shrink-0">Total Received</p>
          <p className="text-6xl xl:text-8xl font-black text-slate-900 my-4 tabular-nums drop-shadow-sm">44</p>
          <div className="w-full max-w-[150px] h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
             <div className="h-full bg-blue-500 w-[85%] rounded-full" />
          </div>
          <p className="text-xs text-slate-400 mt-4 font-medium shrink-0">85% Triage Accuracy</p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 max-w-full">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex justify-between items-center group transition-all hover:shadow-md hover:bg-emerald-100/50">
          <div>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Completed</p>
            <h3 className="text-4xl font-black text-emerald-900">39</h3>
          </div>
          <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
             <Check/>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex justify-between items-center group transition-all hover:shadow-md hover:bg-red-100/50">
          <div>
            <p className="text-red-600 font-bold text-xs uppercase tracking-widest">Failed Translations</p>
            <h3 className="text-4xl font-black text-red-900">5</h3>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
             <X/>
          </div>
        </div>
      </div>
    </div>
  );
}