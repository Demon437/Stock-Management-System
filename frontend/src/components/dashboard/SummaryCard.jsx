import React from 'react'

function SummaryCard({ icon, text, number, color }) {
  return (
    <div className={`flex items-center h-24 rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white ${color || ''}`}>

      <div className="w-20 h-full bg-[#0F172A] text-cyan-400 text-2xl flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="flex-1 h-full px-4 py-3 flex flex-col justify-center">
        <p className="text-sm font-semibold text-slate-500">
          {text}
        </p>

        <p className="text-2xl font-bold mt-1 text-[#0F172A]">
          {number}
        </p>
      </div>

    </div>
  )
}

export default SummaryCard
