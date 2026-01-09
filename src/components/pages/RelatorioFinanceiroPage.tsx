
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import Card from '../ui/Card';

const RelatorioFinanceiroPage: React.FC = () => {
  return (
    <Layout
      pageTitle="Relatório Financeiro"
      pageDescription="Selecione o tipo de relatório que deseja visualizar."
    >
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Link to="/meu-dinheiro/relatorio-financeiro/despesas-mensais" className="group">
          <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-100">Despesas Mensais</h2>
              <p className="text-slate-400 leading-relaxed">Planeje e controle suas despesas recorrentes.</p>
            </div>
          </Card>
        </Link>

        <Link to="/meu-dinheiro/relatorio-financeiro/dividas" className="group">
          <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-100">Relatório de Dívidas</h2>
              <p className="text-slate-400 leading-relaxed">Acompanhe o status de suas dívidas.</p>
            </div>
          </Card>
        </Link>

        <Link to="/meu-dinheiro/relatorio-financeiro/metas" className="group">
          <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/100">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-100">Metas</h2>
              <p className="text-slate-400 leading-relaxed">Visualize o progresso de suas metas financeiras.</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-12 flex justify-center">
        <Link to="/meu-dinheiro" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Voltar ao Menu
        </Link>
      </div>
    </Layout>
  );
};

export default RelatorioFinanceiroPage;
