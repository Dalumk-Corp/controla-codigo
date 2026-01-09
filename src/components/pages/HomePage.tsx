import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import AnimatedBackground from '../ui/AnimatedBackground';
import { AppHeader } from '../ui/AppHeader';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const linkTarget = (path: string) => (currentUser ? path : '/login');

  return (
    <>
      <AppHeader />
      <AnimatedBackground>
        <div className="container mx-auto px-4 pt-32 pb-12">
          <div className="text-center mb-12 space-y-3 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-3">
              Controla+
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-slate-100 max-w-3xl mx-auto leading-relaxed">
              Clareza para o seu dinheiro, poder para o seu recomeço
            </p>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Sua ferramenta completa para gerenciar finanças pessoais e empresariais
          </p>
        </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link to={linkTarget("/meu-dinheiro")} className="group animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 hover:bg-slate-800/100">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01V5M12 20v-1m0 1v.01M12 18v-1m0-1v-1m-4-5H7m14 0h-1M7 12H3m4 0h.01M21 12h-1m0 0h-.01M12 12h.01M12 12H8m4 0h.01M12 12H3m9 0h9" /></svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-100">
                    Meu Dinheiro
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Equilíbrio e estabilidade financeira pessoal
                  </p>
                </div>
              </Card>
            </Link>

            <Link to={linkTarget("/business-money")} className="group animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-green-500/20 hover:border-green-500/40 hover:bg-slate-800/100">
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                   </div>
                  <h2 className="text-2xl font-semibold text-slate-100">
                    Business Money
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Profissionalismo e controle do seu negócio
                  </p>
                </div>
              </Card>
            </Link>

            <Link to={linkTarget("/brasil")} className="group animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-yellow-500/20 hover:border-yellow-500/40 hover:bg-slate-800/100">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.737 16.525l1.514-2.271A1 1 0 0110.437 14h3.126a1 1 0 01.886.254l1.514 2.271A1 1 0 0115.263 18H8.737a1 1 0 01-.886-1.475z" /></svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-100">
                    Brasil
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Conexão com casa — acompanhe suas remessas
                  </p>
                </div>
              </Card>
            </Link>
          </div>

          <footer className="mt-20 text-center text-sm text-slate-500 space-y-2 animate-fade-in">
            <p className="font-medium">Controla+ — Construindo estabilidade, passo a passo</p>
            <p>Versão 1.0</p>
          </footer>
        </div>
      </AnimatedBackground>
    </>
  );
};

export default HomePage;