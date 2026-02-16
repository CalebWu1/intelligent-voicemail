'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', // This creates the "Donut" hole (use '0%' for a Pie chart)
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
      },
    },
  },
};

const chartData = {
  labels: ['Emergency', 'Refills', 'Appointments', 'Billing', 'General'],
  datasets: [
    {
      label: 'Pending Voicemails',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(236, 72, 153, 0.7)', // Pink
        'rgba(147, 51, 234, 0.7)', // Purple
        'rgba(59, 130, 246, 0.7)', // Blue
        'rgba(16, 185, 129, 0.7)', // Green
        'rgba(245, 158, 11, 0.7)', // Amber
      ],
      borderColor: [
        '#ec4899',
        '#9333ea',
        '#3b82f6',
        '#10b981',
        '#f59e0b',
      ],
      borderWidth: 2,
      hoverOffset: 15, // Adds a nice pop-out effect on hover
    },
  ],
};

export function DashboardChart() {
  return(
    <div className="p-8 flex-1">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm" style={{ height: '400px', width: '100%' }}>
        <Doughnut options={chartOptions} data={chartData} />
      </div>
    </div>
  )
}