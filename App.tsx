import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MessageSquarePlus, Globe } from 'lucide-react'; // Adicionei o ícone Globe
import { createClient } from '@supabase/supabase-js';

// Seus componentes originais
import Layout from './components/Layout';
import Home from './pages/Home';
import MeuDinheiro from './pages/MeuDinheiro';
import BusinessMoney from './pages/BusinessMoney';
import Brasil from './pages/Brasil';
import Chatbot from './components/Chatbot';

const supabase = createClient('https://ryxsadnykjzbawhzgukk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eHNhZG55a2p6YmF3aHpndWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTQzMDIsImV4cCI6MjA4MzI5MDMwMn0.R1hK6lUSI31Z5bPzl0LJC3JNO5OnpU4ihNlLakdz4PQ');

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [idioma, setIdioma] = useState('pt'); // Estado para o idioma (PT/EN)
  const [user, setUser] = useState(null);
  const [assinante, setAssinante] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) verificarAcesso(session.user.id);
      else setLoading(false);
    });
  }, []);

  async function verificarAcesso(userId) {
    const { data } = await supabase
      .from('assinantes')
      .select('subscription_status, trial_ends_at')
      .eq('id', userId)
      .single();

    if (data) {
      const hoje = new Date();
      const fimTrial = new Date(data.trial_ends_at);
      // REGRA: Acesso se estiver no Trial (7 dias) OU assinatura Ativa
      if (data.subscription_status === 'active' || fimTrial > hoje) {
        setAssinante(true);
      }
    }
    setLoading(false);
  }

  if (loading) return <div className="loading">Loading...</div>;

  // 1. SE NÃO LOGOU: Tela de Login
  if (!user) return <TelaLogin idioma={idioma} setIdioma={setIdioma} />;

  // 2. SE LOGOU MAS EXPIROU OS 7 DIAS: Tela do Stripe (em Dólar)
  if (!assinante) return <TelaPagamento idioma={idioma} email={user.email} />;

  // 3. SE ESTÁ TUDO OK: O SEU APP ORIGINAL
  return (
    <HashRouter>
      <div className="relative min-h-screen">
        {/* Seletor de Idioma flutuante no seu App */}
        <button 
          onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')}
          className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-lg flex items-center gap-2 text-sm border border-gray-700"
        >
          <Globe size={16} /> {idioma === 'pt' ? 'EN' : 'PT'}
        </button>

        <Routes>
          <Route path="/" element={<Layout idioma={idioma} />}>
            <Route index element={<Home idioma={idioma} />} />
            <Route path="/meu-dinheiro" element={<MeuDinheiro idioma={idioma} />} />
            <Route path="/business-money" element={<BusinessMoney idioma={idioma} />} />
            <Route path="/brasil" element={<Brasil idioma={idioma} />} />
          </Route>
        </Routes>
        
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-40"
        >
          <MessageSquarePlus size={28} />
        </button>

        {isChatbotOpen && <Chatbot idioma={idioma} onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </HashRouter>
  );
}

// --- Componentes de Apoio Profissionais ---

function TelaLogin({ idioma, setIdioma }) {
  const textos = {
    pt: { h2: 'Entrar no Controla+', p: 'Link mágico para o seu e-mail', btn: 'Enviar Link' },
    en: { h2: 'Login to Controla+', p: 'Magic link to your email', btn: 'Send Link' }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
       <h2 className="text-2xl font-bold">{textos[idioma].h2}</h2>
       <p className="text-gray-400 mb-4">{textos[idioma].p}</p>
       {/* ... input de e-mail e botão do Supabase ... */}
       <button onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')} className="mt-4 text-xs underline">Mudar Idioma / Change Language</button>
    </div>
  );
}

function TelaPagamento({ idioma, email }) {
  const textos = {
    pt: { h2: `Olá, ${email}`, p: 'Seus 7 dias grátis acabaram. Assine para continuar controlando seus dólares.', btn: 'Assinar por $XX/mês' },
    en: { h2: `Hello, ${email}`, p: 'Your 7-day trial has ended. Subscribe to keep tracking your dollars.', btn: 'Subscribe for $XX/month' }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6 text-center">
       <h2 className="text-2xl font-bold mb-2">{textos[idioma].h2}</h2>
       <p className="text-gray-400 mb-6">{textos[idioma].p}</p>
       <a href="https://buy.stripe.com/test_28EfZh4S12NMbpO3IV6Zy00" className="bg-blue-600 p-4 rounded-xl font-bold">{textos[idioma].btn}</a>
    </div>
  );
}

export default App;
      </div>
    </div>
  );
}
