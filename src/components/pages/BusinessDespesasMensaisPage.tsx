
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import BusinessDespesasMensaisTable from '../features/BusinessDespesasMensaisTable';
import { BusinessMonthlyExpense } from '../../types';
import { BUSINESS_PREPOPULATED_DESPESAS } from '../../constants';

const BusinessDespesasMensaisPage: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<BusinessMonthlyExpense[]>(() => {
    const savedData = localStorage.getItem('businessMonthlyExpenses');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Pre-populate if no data is saved
    return BUSINESS_PREPOPULATED_DESPESAS.map(desc => ({
      id: crypto.randomUUID(),
      descricao: desc,
      valorMedio: 0,
      currency: 'USD',
      tipo: 'Variável',
      limitePretendido: 0,
      vencimento: '',
      recorrencia: 'Mensal',
    }));
  });

  useEffect(() => {
    localStorage.setItem('businessMonthlyExpenses', JSON.stringify(monthlyExpenses));
  }, [monthlyExpenses]);

  return (
    <Layout
      pageTitle="Despesas Mensais do Negócio"
      pageDescription="Planeje suas despesas fixas e variáveis para ter uma visão clara do orçamento da sua empresa."
    >
      <div className="max-w-7xl mx-auto">
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-xl">
          <BusinessDespesasMensaisTable
            expenses={monthlyExpenses}
            setExpenses={setMonthlyExpenses}
          />
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
            <Link to="/business-money" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar ao Menu Principal
            </Link>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDespesasMensaisPage;
