
import React, { useState, useMemo } from 'react';
import { Expense, MonthlyExpense, SavedReport } from '../../types';

interface Interactive3DPieChartProps {
  expenses: Expense[];
  monthlyExpenses: MonthlyExpense[];
  history: SavedReport[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f97316', '#ec4899', '#8b5cf6', '#f59e0b',
  '#ef4444', '#14b8a6', '#6366f1', '#d946ef', '#0ea5e9', '#84cc16'
];

const DEFAULT_IDEALS: Record<string, number> = {
  'habitação': 30,
  'alimentação': 20,
  'utilities': 10,
  'transporte': 15,
  'reserva': 10,
  'investimento': 5,
  'dívida': 15,
  'lazer': 10
};

const Interactive3DPieChart: React.FC<Interactive3DPieChartProps> = ({ expenses, monthlyExpenses, history }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const totals: { [key: string]: { value: number, count: number } } = {};
    expenses.forEach(e => {
      if (!totals[e.categoria]) totals[e.categoria] = { value: 0, count: 0 };
      totals[e.categoria].value += e.valor;
      totals[e.categoria].count += 1;
    });

    const totalBudget = Object.values(totals).reduce((acc, curr) => acc + curr.value, 0);

    return Object.entries(totals).map(([name, data], index) => {
      const linkedMonthly = monthlyExpenses.find(me => 
        me.descricao.toLowerCase() === name.toLowerCase() || 
        me.tipo.toLowerCase() === name.toLowerCase()
      );

      const userDefinedIdealPercent = linkedMonthly?.percentualIdeal;
      const normalizedName = name.toLowerCase();
      const fallbackIdeal = DEFAULT_IDEALS[normalizedName] || 10; 
      
      const percentOfBudget = (data.value / totalBudget) * 100;
      const idealPercent = (userDefinedIdealPercent && userDefinedIdealPercent > 0) 
        ? userDefinedIdealPercent 
        : fallbackIdeal;

      let trend = 0;
      if (history.length > 0) {
        const lastReport = history[0];
        if (lastReport && lastReport.data && lastReport.data.Resumo_Saidas) {
          const lastMonthData = lastReport.data.Resumo_Saidas || [];
          const lastMonthCatTotal = (lastMonthData as any[]).reduce((acc, curr) => 
            curr.categoria === name ? acc + curr.valor : acc, 0);
          if (lastMonthCatTotal > 0) {
            trend = ((data.value - lastMonthCatTotal) / lastMonthCatTotal) * 100;
          }
        }
      }

      const idealValueForStatus = (totalBudget * (idealPercent / 100));
      const ratio = data.value / (idealValueForStatus || 1);
      
      let status: 'green' | 'yellow' | 'red' = 'green';
      let statusText = 'Sob Controle';
      if (ratio > 1.2) {
        status = 'red';
        statusText = 'Zona de Risco';
      } else if (ratio > 0.9) {
        status = 'yellow';
        statusText = 'Atenção';
      }

      const color = COLORS[index % COLORS.length];

      return {
        name,
        value: data.value,
        count: data.count,
        percent: percentOfBudget,
        idealPercent,
        trend,
        status,
        statusText,
        color: color,
        savingInsight: data.value * 0.1
      };
    }).sort((a, b) => b.value - a.value);
  }, [expenses, monthlyExpenses, history]);

  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const getCoordinatesForPercent = (percent: number, radius: number = 1) => {
    const angle = (percent - 0.25) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return [x, y];
  };

  const renderSlicesAndLabels = () => {
    let cumulativePercent = 0;
    return chartData.map((item, index) => {
      const percent = item.value / totalValue;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      const endPercent = cumulativePercent;
      const midPercent = startPercent + (percent / 2);

      const [startX, startY] = getCoordinatesForPercent(startPercent);
      const [endX, endY] = getCoordinatesForPercent(endPercent);
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const isSelected = selectedIndex === index;

      const lineStartRadius = 0.95;
      const lineBendRadius = 1.25;
      
      const [p1x, p1y] = getCoordinatesForPercent(midPercent, lineStartRadius);
      const [p2x, p2y] = getCoordinatesForPercent(midPercent, lineBendRadius);
      
      const isRightSide = p2x >= 0;
      const p3x = isRightSide ? p2x + 0.35 : p2x - 0.35;
      const p3y = p2y;

      const textAnchor = isRightSide ? "start" : "end";

      const [midX, midY] = getCoordinatesForPercent(midPercent, 0.65);

      return (
        <g key={index} className="transition-all duration-500 cursor-pointer">
          <path
            d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`}
            fill={item.color}
            style={{
              transform: isSelected ? 'scale(1.08)' : 'scale(1)',
              filter: isSelected ? `drop-shadow(0 0 18px ${item.color}bb)` : 'none',
              stroke: '#1e293b',
              strokeWidth: '0.005'
            }}
          />

          {percent > 0.05 && (
             <text
                x={midX}
                y={midY}
                fill="white"
                fontSize="0.08"
                fontWeight="900"
                textAnchor="middle"
                alignmentBaseline="middle"
                className="pointer-events-none select-none opacity-80"
                style={{ transform: isSelected ? 'scale(1.1)' : 'scale(1)' }}
             >
                {item.percent.toFixed(0)}%
             </text>
          )}
          
          <polyline
            points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
            fill="none"
            stroke={item.color}
            strokeWidth="0.02"
            strokeOpacity={isSelected ? 1 : 0.7}
            className="pointer-events-none transition-opacity"
          />

          <text
            x={p3x + (isRightSide ? 0.08 : -0.08)}
            y={p3y}
            fill="white"
            fontSize="0.13" 
            fontWeight="900"
            textAnchor={textAnchor}
            alignmentBaseline="middle"
            className="pointer-events-none select-none"
            style={{ 
              filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.9))',
              opacity: isSelected ? 1 : 0.9 
            }}
          >
            {item.name.substring(0, 12)}
          </text>
          
          <text
            x={p3x + (isRightSide ? 0.08 : -0.08)}
            y={p3y + 0.15}
            fill={item.color}
            fontSize="0.09"
            fontWeight="900"
            textAnchor={textAnchor}
            alignmentBaseline="middle"
            className="pointer-events-none select-none"
            style={{ opacity: isSelected ? 1 : 0.8 }}
          >
            {item.percent.toFixed(1)}%
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative w-full py-10" onClick={() => setSelectedIndex(null)}>
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-8 w-full max-w-[1440px] mx-auto px-4">
        
        {/* Gráfico 3D (Ajustado para 60%) */}
        <div className="lg:flex-[0.6] w-full flex flex-col items-center justify-center">
            <div className="relative group perspective-[1500px] z-10 w-full max-w-xl lg:max-w-full">
                <div 
                    className="relative transition-transform duration-700 ease-out"
                    style={{ transform: 'rotateX(38deg)' }}
                >
                    <div className="absolute inset-0 bg-black/40 blur-[100px] rounded-full scale-90 translate-y-16 -z-10"></div>
                    <svg viewBox="-2.4 -2 4.8 4" className="w-full h-auto max-h-[600px] overflow-visible">
                        {renderSlicesAndLabels()}
                        <circle cx="0" cy="0" r="0.32" fill="#0f172a" stroke="#1e293b" strokeWidth="0.02" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Legenda Lateral (Ajustado para 40% com fonte reduzida) */}
        <div className="lg:flex-[0.4] flex flex-col gap-2.5 w-full lg:max-w-md animate-fade-in relative">
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 border-b border-slate-700/50 pb-3">
              Diagnóstico de Despesas — Seletor de Categoria
            </h3>
            
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-3 custom-scrollbar">
                {chartData.map((item, idx) => (
                    <div key={idx} className="relative">
                        <div 
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onMouseLeave={() => setSelectedIndex(null)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex === idx ? null : idx);
                            }}
                            className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                                selectedIndex === idx 
                                ? 'bg-slate-700/90 border-slate-500 scale-[1.01] shadow-2xl translate-x-1.5' 
                                : 'bg-slate-800/30 border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600'
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}99` }}></div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-black uppercase tracking-wider transition-colors truncate" style={{ color: selectedIndex === idx ? 'white' : `${item.color}dd` }}>
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                                <div className="flex items-center justify-end gap-2.5">
                                    <span className="text-sm font-black transition-all" style={{ color: item.color, filter: 'brightness(1.1)' }}>
                                      {item.percent.toFixed(1)}%
                                    </span>
                                    <div className={`w-2.5 h-2.5 rounded-full shadow-inner ${
                                    item.status === 'green' ? 'bg-green-500' : item.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                </div>
                                <p className="text-[10px] font-black opacity-80" style={{ color: item.color }}>
                                    {item.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </p>
                            </div>
                        </div>

                        {selectedIndex === idx && (
                            <div 
                                className="mt-2.5 bg-slate-900 border border-slate-500 rounded-[1.5rem] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-slide-up z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">Painel de Análise</span>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        item.status === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        item.status === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                        {item.statusText}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/50">
                                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-2">Total de Gastos</p>
                                        <p className="text-lg font-black text-white">
                                            {item.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {item.count} lançamentos
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/50">
                                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-2">Tendência</p>
                                        <p className={`text-lg font-black flex items-center gap-1 ${item.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {Math.abs(item.trend).toFixed(1)}%
                                            {item.trend > 0 ? ' ↑' : ' ↓'}
                                        </p>
                                        <p className="text-[8px] font-black text-slate-500 mt-2 uppercase tracking-widest">comparado ao histórico</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                                        <div className="flex justify-between text-[9px] font-black text-slate-400 mb-2.5 uppercase tracking-widest">
                                            <span>Real: {item.percent.toFixed(1)}%</span>
                                            <span className="text-blue-400">Objetivo: {item.idealPercent.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800/50">
                                            <div 
                                                className={`h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r ${
                                                    item.status === 'green' ? 'from-green-600 to-green-400' : 
                                                    item.status === 'yellow' ? 'from-yellow-600 to-yellow-400' : 
                                                    'from-red-600 to-red-400'
                                                }`} 
                                                style={{ width: `${Math.min((item.percent / item.idealPercent) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-xl">
                                        <p className="text-[8px] text-blue-400 font-black mb-1 uppercase tracking-widest">Insights Controla+</p>
                                        <p className="text-[11px] text-slate-300 leading-relaxed font-bold">
                                            “Se reduzir 10%, você redireciona <span className="text-blue-400">{item.savingInsight.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> para o que importa.”
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-700/50 flex flex-col items-end">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.4em] mb-1">Custo Operacional Total</span>
                <p className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                  {totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Interactive3DPieChart;
