
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import { Remessa } from '../../types';
import RemessasTable from '../features/RemessasTable';
import DashboardBalance from '../features/DashboardBalance';
import Card from '../ui/Card';

const BrasilPage: React.FC = () => {
  const [remessas, setRemessas] = useState<Remessa[]>(() => {
    const savedData = localStorage.getItem('remessas');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('remessas', JSON.stringify(remessas));
  }, [remessas]);

  const currentYear = new Date().getFullYear();

  const yearData = useMemo(() => {
    const years: { [key: number]: Remessa[] } = {};
    
    remessas.forEach(r => {
      const d = new Date(r.data);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        if (!years[year]) years[year] = [];
        years[year].push(r);
      }
    });

    const currentYearItems = years[currentYear] || [];
    const historicalYears = Object.keys(years)
      .map(Number)
      .filter(y => y < currentYear)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        total: years[year].reduce((acc, r) => acc + r.valor, 0),
        items: years[year]
      }));

    return {
      currentYearItems,
      currentYearTotal: currentYearItems.reduce((acc, r) => acc + r.valor, 0),
      historicalYears
    };
  }, [remessas, currentYear]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
  };

  return (
    <Layout
      pageTitle="Brasil — Relatório de Remessas"
      pageDescription="Acompanhe suas remessas de dinheiro para o Brasil. O saldo é reiniciado anualmente em 31 de dezembro."
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Dashboard - Only Total Sent (Simplified) */}
        <DashboardBalance 
          incomes={[]} 
          expenses={yearData.currentYearItems} 
          colorAccent="blue" 
          title={`Total Enviado em ${currentYear}`}
          hideStats={true}
        />

        {/* Current Year Table */}
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             Movimentações de {currentYear}
          </h3>
          <RemessasTable 
            remessas={remessas.filter(r => new Date(r.data).getFullYear() === currentYear)} 
            setRemessas={(newYearRemessas) => {
              // Functional update to maintain all records while updating current year
              setRemessas(prev => {
                const otherYears = prev.filter(r => new Date(r.data).getFullYear() !== currentYear);
                const updatedRemessas = typeof newYearRemessas === 'function' 
                  ? newYearRemessas(prev.filter(r => new Date(r.data).getFullYear() === currentYear))
                  : newYearRemessas;
                return [...otherYears, ...updatedRemessas];
              });
            }} 
          />
        </div>

        {/* Reference Year Data Section (Historical) */}
        {yearData.historicalYears.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Dados Anos de Referência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yearData.historicalYears.map(history => (
                <Card key={history.year} className="p-6 bg-slate-800/50 border border-slate-700 hover:border-slate-500 transition-all group">
                   <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Ano de Referência</span>
                        <h4 className="text-3xl font-bold text-slate-200">{history.year}</h4>
                      </div>
                      <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                   </div>
                   <div className="mt-6 pt-4 border-t border-slate-700/50">
                      <span className="text-sm text-slate-400">Total Enviado:</span>
                      <p className="text-xl font-bold text-blue-400">{formatCurrency(history.total)}</p>
                      <p className="text-xs text-slate-500 mt-1">{history.items.length} remessas registradas</p>
                   </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
            <Link to="/" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar ao Início
            </Link>
        </div>
      </div>
    </Layout>
  );
};

export default BrasilPage;
