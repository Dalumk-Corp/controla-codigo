
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import Card from '../ui/Card';
import DashboardBalance from '../features/DashboardBalance';
import { Income, Expense } from '../../types';

const MeuDinheiroPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    const savedIncomes = localStorage.getItem('incomes');
    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
  }, []);

  return (
    <Layout
      pageTitle="Meu Dinheiro"
      pageDescription="Selecione uma área para gerenciar suas finanças pessoais."
    >
      <div className="max-w-6xl mx-auto">
        <DashboardBalance 
          incomes={incomes} 
          expenses={expenses} 
          colorAccent="blue" 
          title="Saldo Pessoal"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/meu-dinheiro/controle-financeiro" className="group">
            <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 0v6m0-6l-6 6m6-6l-6-6" /></svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">Controle Financeiro</h2>
                <p className="text-slate-400 leading-relaxed">Acompanhe despesas e receitas do dia a dia.</p>
              </div>
            </Card>
          </Link>

          <Link to="/meu-dinheiro/relatorio-financeiro" className="group">
            <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">Relatório Financeiro</h2>
                <p className="text-slate-400 leading-relaxed">Visualize relatórios e o fluxo de caixa.</p>
              </div>
            </Card>
          </Link>

          <Link to="/meu-dinheiro/metas" className="group">
            <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">Metas</h2>
                <p className="text-slate-400 leading-relaxed">Defina e acompanhe suas metas financeiras.</p>
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

export default MeuDinheiroPage;
