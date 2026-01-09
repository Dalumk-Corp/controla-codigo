
import React, { useMemo, useState } from 'react';
import Card from '../ui/Card';

interface BaseTransaction {
  valor: number;
}

interface DashboardBalanceProps {
  incomes: BaseTransaction[];
  expenses: BaseTransaction[];
  colorAccent: 'blue' | 'green';
  title?: string;
  hideStats?: boolean;
}

const DashboardBalance: React.FC<DashboardBalanceProps> = ({ incomes, expenses, colorAccent, title = "Saldo Atual", hideStats = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const inc = incomes.reduce((acc, item) => acc + item.valor, 0);
    const exp = expenses.reduce((acc, item) => acc + item.valor, 0);
    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: inc - exp
    };
  }, [incomes, expenses]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
  };

  const gradientClass = colorAccent === 'blue' 
    ? 'from-blue-600/20 to-teal-600/20 border-blue-500/30' 
    : 'from-green-600/20 to-emerald-600/20 border-green-500/30';

  return (
    <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${gradientClass} border backdrop-blur-md shadow-xl animate-fade-in`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Main Balance */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <h2 className="text-slate-300 font-medium text-sm uppercase tracking-wider">{title}</h2>
            <button 
              onClick={() => setIsVisible(!isVisible)} 
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              {isVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              )}
            </button>
          </div>
          <div className={`text-4xl md:text-5xl font-bold ${isVisible ? 'text-white' : 'text-slate-500 blur-sm select-none'}`}>
             {isVisible ? formatCurrency(Math.abs(balance)) : '••••••••'}
          </div>
        </div>

        {/* Mini Stats (Hidden if hideStats is true) */}
        {!hideStats && (
          <div className="flex gap-4 md:gap-8">
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-green-500/20 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </div>
                <span className="text-xs text-slate-400 font-medium">Entradas</span>
              </div>
              <span className={`text-lg font-semibold ${isVisible ? 'text-green-400' : 'text-slate-600 blur-sm'}`}>
                 {isVisible ? formatCurrency(totalIncome) : '••••••'}
              </span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 min-w-[140px]">
               <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-red-500/20 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
                <span className="text-xs text-slate-400 font-medium">Saídas</span>
              </div>
              <span className={`text-lg font-semibold ${isVisible ? 'text-red-400' : 'text-slate-600 blur-sm'}`}>
                 {isVisible ? formatCurrency(totalExpense) : '••••••'}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardBalance;
