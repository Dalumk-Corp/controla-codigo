
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import ThinkingMode from '../features/ThinkingMode';

const BusinessAnalysisPage: React.FC = () => {
  return (
    <Layout
      pageTitle="Análise Avançada de Negócios"
      pageDescription="Obtenha insights avançados para tomar decisões estratégicas com o poder da IA."
    >
      <div className="max-w-7xl mx-auto">
        <ThinkingMode />

        <div className="mt-12 flex justify-center">
            <Link to="/business-money" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar ao Menu
            </Link>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessAnalysisPage;
