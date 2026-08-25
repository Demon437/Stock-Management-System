import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartColors = {
  cyan: 'rgba(34, 211, 238, 0.85)',
  blue: 'rgba(59, 130, 246, 0.85)',
  purple: 'rgba(168, 85, 247, 0.85)',
  green: 'rgba(34, 197, 94, 0.85)',
  yellow: 'rgba(234, 179, 8, 0.85)',
  red: 'rgba(239, 68, 68, 0.85)',
  indigo: 'rgba(99, 102, 241, 0.85)',
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#334155',
        font: { size: 12, weight: '500' },
        padding: 16,
      },
    },
  },
};

function DashboardCharts({ summary }) {
  const overviewBarData = {
    labels: ['Products', 'Categories', 'Users'],
    datasets: [
      {
        label: 'Count',
        data: [
          summary.totalProducts,
          summary.totalCategories,
          summary.totalUsers,
        ],
        backgroundColor: [chartColors.blue, chartColors.purple, chartColors.cyan],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const overviewBarOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b', stepSize: 1 },
      },
    },
  };

  const requestPieData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          summary.approvedRequests,
          summary.pendingRequests,
          summary.rejectedRequests,
        ],
        backgroundColor: [chartColors.green, chartColors.yellow, chartColors.red],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const requestBarData = {
    labels: ['Total', 'Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Requests',
        data: [
          summary.totalRequests,
          summary.approvedRequests,
          summary.pendingRequests,
          summary.rejectedRequests,
        ],
        backgroundColor: [
          chartColors.indigo,
          chartColors.green,
          chartColors.yellow,
          chartColors.red,
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const requestBarOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b', stepSize: 1 },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <div className="card-padded">
        <h3 className="section-heading mb-4">System Overview</h3>
        <div className="h-64">
          <Bar data={overviewBarData} options={overviewBarOptions} />
        </div>
      </div>

      <div className="card-padded">
        <h3 className="section-heading mb-4">Request Status Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <Pie data={requestPieData} options={chartOptions} />
        </div>
      </div>

      <div className="card-padded lg:col-span-2">
        <h3 className="section-heading mb-4">Request Breakdown</h3>
        <div className="h-64">
          <Bar data={requestBarData} options={requestBarOptions} />
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
