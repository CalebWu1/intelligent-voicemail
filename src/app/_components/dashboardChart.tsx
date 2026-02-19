'use client';

import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Check, X } from 'lucide-react';
import { api } from '~/trpc/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

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

export function DashboardChart() {
  const router = useRouter();
  const countUrgency = api.voicemail.countUrgency.useQuery();
  const numPendingMail= api.voicemail.getNumPending.useQuery();
  const completedTranslations= api.voicemail.getCompletedTranslations.useQuery();
  const failedTranslations= api.voicemail.getFailed.useQuery();
  const priorityLevels = ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'];

  const handlePriorityClick = (priority: string) => {
    router.push(`/inbox?priority=${priority.toLowerCase()}`);
  };

  const handleLegendClick = (index: number) => {
    const priorityLevels = ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'];
    const priority = priorityLevels[index];
    if (priority) {
      handlePriorityClick(priority);
    }
  };

  const chartData = {
    labels: ['Low', 'Medium', 'High', 'Emergency'],
    datasets: [
      {
        label: 'Priority Level',
        data: countUrgency.data ?? [0,0,0,0],
        backgroundColor: [COLORS.low.bg, COLORS.medium.bg, COLORS.high.bg, COLORS.emergency.bg],
        borderColor: [COLORS.low.border, COLORS.medium.border, COLORS.high.border, COLORS.emergency.border],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };
  return (
    <div className="flex flex-col h-screen w-full max-w-[1600px] mx-auto bg-white p-4 md:p-8 gap-6 overflow-hidden">
      
      {/* Main Dashboard Area */}
      <div className="flex-1 min-h-0 max-h-[750px] bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch gap-8 transition-all">
        {/* Left side: The Chart Container */}
        <div className="flex-[2] flex flex-col min-h-0">
          <h2 className="text-slate-800 font-bold text-2xl mb-4 text-center md:text-left shrink-0">
            Voicemails Processed
          </h2>
          <div className="flex-1 relative min-h-0 cursor-pointer">
            <Doughnut
              data={chartData}
              options={{
                ...chartOptions,
                onClick: (event, elements) => {
                  if (elements.length > 0) {
                    const index = elements[0]?.index;
                    if (typeof index === 'number') {
                      const priority = priorityLevels[index];
                      if (priority) router.push(`/inbox?urgency=${priority}`);
                    }
                  }
                },
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins?.legend,
                    onClick: (e, legendItem) => {
                      const index = legendItem.index;
                      if (typeof index === 'number') {
                        const priority = priorityLevels[index];
                        if (priority) router.push(`/inbox?urgency=${priority}`);
                      }
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-center items-center shadow-inner md:max-w-xs text-center">
          <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider shrink-0">Total Received</p>
          <Link
            href={'/inbox'}
            className="text-6xl xl:text-8xl font-black text-slate-900 my-4 tabular-nums drop-shadow-sm"
          >
            {numPendingMail.data ?? 0}
          </Link>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 max-w-full">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex justify-between items-center group transition-all hover:shadow-md hover:bg-emerald-100/50">
          <div>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Completed Translations</p>
            <h3 className="text-4xl font-black text-emerald-900">{completedTranslations.data ?? 0}</h3>
          </div>
          <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
             <Check/>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex justify-between items-center group transition-all hover:shadow-md hover:bg-red-100/50">
          <div>
            <p className="text-red-600 font-bold text-xs uppercase tracking-widest">Failed Translations</p>
            <h3 className="text-4xl font-black text-red-900">{failedTranslations.data ?? 0}</h3>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
             <X/>
          </div>
        </div>
      </div>
    </div>
  );
}