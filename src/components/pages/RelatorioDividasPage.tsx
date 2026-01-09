
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import { Debt } from '../../types';
import DividasTable from '../features/DividasTable';
import SaveAndShare from '../features/SaveAndShare';

const RelatorioDividasPage: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>(() => {
    const savedData = localStorage.getItem('debts');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  const handleClearData = () => {
    setDebts([]);
  };

  return (
    <Layout
      pageTitle="Relatório de Dívidas"
      pageDescription="Acompanhe o status e o progresso de suas dívidas."
    >
      <div className="max-w-7xl mx-auto">
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex justify-end mb-4">
            <SaveAndShare
              data={debts}
              onClearData={handleClearData}
              fileNamePrefix="relatorio-dividas"
              period="annually"
            />
          </div>
          <DividasTable
            debts={debts}
            setDebts={setDebts}
          />
        </div>

        <div className="mt-12 flex justify-center">
            <Link to="/meu-dinheiro/relatorio-financeiro" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar ao Menu Relatórios
            </Link>
        </div>
      </div>
    </Layout>
  );
};

export default RelatorioDividasPage;
