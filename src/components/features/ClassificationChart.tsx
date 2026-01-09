
import React from 'react';

interface ClassificationChartProps {
  data: { name: string; value: number }[];
}

const ClassificationChart: React.FC<ClassificationChartProps> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const maxVal = Math.max(...data.map(d => d.value), 1);

  if (total === 0) return null;

  return (
    <div className="w-full p-8 mt-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
      
      <h3 className="font-black text-[10px] text-slate-500 mb-12 text-center uppercase tracking-[0.3em] opacity-80">
        Perfil de Gastos — Distribuição Estratégica
      </h3>
      
      <div className="flex items-end justify-around h-80 px-4 mb-8">
        {data.map((item) => {
          const percentage = (item.value / total) * 100;
          const heightPercent = (item.value / maxVal) * 100;
          // Proportional width: thicker bars for higher percentages
          const barWidth = 40 + (percentage * 1.5); 
          
          return (
            <div key={item.name} className="flex flex-col items-center h-full justify-end group">
              {/* Labels at the top of each bar */}
              <div className="mb-4 text-center animate-fade-in">
                <p className="text-lg font-black text-blue-400 tracking-tighter leading-none">
                  {percentage.toFixed(1)}%
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                  {item.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                </p>
              </div>

              {/* Vertical Column with Glossy Blue Gradient and Proportional Thickness */}
              <div className="relative w-full flex justify-center h-full items-end">
                <div 
                  className="relative rounded-t-2xl bg-gradient-to-t from-blue-700 via-blue-500 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_25px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] group-hover:-translate-y-1"
                  style={{ 
                    height: `${Math.max(heightPercent, 5)}%`,
                    width: `${barWidth}px`
                  }}
                >
                  {/* Glossy overlay effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-40 rounded-t-2xl"></div>
                  
                  {/* Inner highlight line */}
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10 -translate-x-1/2"></div>
                  
                  {/* Bottom cap */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-900/50"></div>
                </div>
              </div>

              {/* Category Name at the Bottom */}
              <div className="mt-4 text-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Classificação
                </span>
                <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                  {item.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Consolidated Summary */}
      <div className="mt-12 pt-8 border-t border-slate-700/50 flex justify-center items-center gap-12">
          <div className="text-center">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Faturamento Total</span>
              <p className="text-3xl font-black text-white tracking-tighter">
                {total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
          </div>
          <div className="w-[1px] h-12 bg-slate-700/50"></div>
          <div className="text-center">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Base de Cálculo</span>
              <p className="text-3xl font-black text-blue-400 tracking-tighter">100%</p>
          </div>
      </div>
    </div>
  );
};

export default ClassificationChart;
