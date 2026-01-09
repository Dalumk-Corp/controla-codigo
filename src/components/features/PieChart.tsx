
import React from 'react';

interface PieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f97316', '#ec4899', '#8b5cf6', '#f59e0b',
  '#ef4444', '#14b8a6', '#6366f1', '#d946ef', '#0ea5e9', '#84cc16'
];

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = data.map((item, index) => {
    const percent = item.value / total;
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      'L 0 0',
    ].join(' ');

    return <path key={index} d={pathData} fill={COLORS[index % COLORS.length]} />;
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 p-6 bg-slate-800/20 rounded-2xl border border-slate-700/30 shadow-xl">
      <div className="relative group">
        <svg viewBox="-1 -1 2 2" className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90 transition-transform duration-500 group-hover:scale-105">
          {slices}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex flex-col items-center justify-center border-4 border-slate-800 shadow-lg">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total</span>
                <span className="text-xs font-bold text-white">100%</span>
            </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-3">
        <h3 className="font-semibold text-lg text-slate-100 mb-4 pb-2 border-b border-slate-700/50 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Legenda de Gastos
        </h3>
        {data.map((item, index) => {
          const color = COLORS[index % COLORS.length];
          const percentage = ((item.value / total) * 100).toFixed(1);
          
          return (
            <div key={index} className="flex items-center justify-between group py-1 border-b border-transparent hover:border-slate-700/30 transition-all">
                <div className="flex items-center gap-3">
                    <div
                        className="w-4 h-4 rounded-full shadow-sm shadow-black/50"
                        style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-semibold transition-colors group-hover:text-white" style={{ color: `${color}cc` }}>
                        {item.name}
                    </span>
                </div>
                <div className="text-right flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: color }}>
                        {percentage}%
                    </span>
                    <span className="text-[11px] font-medium opacity-80" style={{ color: color }}>
                        {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}
                    </span>
                </div>
            </div>
          );
        })}
         <div className="pt-4 mt-2 border-t border-slate-700 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase">Total Geral</span>
            <span className="text-xl font-extrabold text-slate-100">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}
            </span>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
