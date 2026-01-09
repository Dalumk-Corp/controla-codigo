
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import Card from '../ui/Card';
import DashboardBalance from '../features/DashboardBalance';
import { BusinessIncome, BusinessExpense } from '../../types';

const BusinessMoneyPage: React.FC = () => {
  const [expenses, setExpenses] = useState<BusinessExpense[]>([]);
  const [incomes, setIncomes] = useState<BusinessIncome[]>([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('businessExpenses');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    const savedIncomes = localStorage.getItem('businessIncomes');
    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
  }, []);

  return (
    <Layout
      pageTitle="Business Money"
      pageDescription="Selecione uma área para gerenciar as finanças do seu negócio."
    >
      <div className="max-w-6xl mx-auto">
        <DashboardBalance 
          incomes={incomes} 
          expenses={expenses} 
          colorAccent="green" 
          title="Saldo Empresarial"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/business-money/controle-financeiro" className="group">
            <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-green-500/60 hover:bg-slate-800/100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">Controle Financeiro</h2>
                <p className="text-slate-400 leading-relaxed">Gerencie as entradas e saídas do seu negócio.</p>
              </div>
            </Card>
          </Link>

          <Link to="/business-money/despesas-mensais" className="group">
            <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-green-500/60 hover:bg-slate-800/100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V12a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">Despesas Mensais</h2>
                <p className="text-slate-400 leading-relaxed">Planeje os custos recorrentes da sua empresa.</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/business-money/analise" className="group">
            <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-green-500/60 hover:bg-slate-800/100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707-.707M6.343 17.657l-.707.707m12.728 0l.707.707M12 21v-1m-4.663-4H16.663" /></svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">Análise Avançada</h2>
                <p className="text-slate-400 leading-relaxed">Use IA para obter insights e projeções de negócios.</p>
              </div>
            </Card>
          </Link>
        </div>

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

export default BusinessMoneyPage;
