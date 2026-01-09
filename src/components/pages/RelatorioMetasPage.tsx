
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import Card from '../ui/Card';

const RelatorioMetasPage: React.FC = () => {
  return (
    <Layout
      pageTitle="Relatório de Metas"
      pageDescription="Acompanhe o progresso de suas metas financeiras."
    >
      <div className="max-w-7xl mx-auto text-center">
        <Card className="max-w-2xl mx-auto p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700">
           <div className="text-blue-400 mx-auto w-fit mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100">Em Breve</h2>
          <p className="text-slate-400 mt-2">
            A funcionalidade de relatórios de metas estará disponível aqui em breve, oferecendo uma visão clara do seu progresso.
          </p>
        </Card>

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

export default RelatorioMetasPage;
