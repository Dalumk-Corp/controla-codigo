import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MessageSquarePlus, Globe, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Seus componentes originais
import Layout from './components/Layout';
import Home from './pages/Home';
import MeuDinheiro from './pages/MeuDinheiro';
import BusinessMoney from './pages/BusinessMoney';
import Brasil from './pages/Brasil';
import Chatbot from './components/Chatbot';

// 1. CONFIGURAÇÃO (Troque pelos seus dados do Supabase)
const supabase = createClient('https://ryxsadnykjzbawhzgukk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eHNhZG55a2p6YmF3aHpndWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTQzMDIsImV4cCI6MjA4MzI5MDMwMn0.R1hK6lUSI31Z5bPzl0LJC3JNO5OnpU4ihNlLakdz4PQ');

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [idioma, setIdioma] = useState('pt');
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
    try {
      const { data } = await supabase
        .from('assinantes')
        .select('subscription_status, trial_ends_at')
        .eq('id', userId)
        .single();

      if (data) {
        const hoje = new Date();
        const fimTrial = new Date(data.trial_ends_at);
        // Regra: Acesso se estiver no Trial OU assinatura Ativa
        if (data.subscription_status === 'active' || fimTrial > hoje) {
          setAssinante(true);
        }
      }
    } catch (err) {
      console.error("Erro ao verificar acesso", err);
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <p className="animate-pulse">Loading Controla+...</p>
    </div>
  );

  // TELA DE LOGIN
  if (!user) {
    return <TelaLogin idioma={idioma} setIdioma={setIdioma} />;
  }

  // TELA DE PAGAMENTO (Se expirou trial)
  if (!assinante) {
    return <TelaPagamento idioma={idioma} email={user.email} setIdioma={setIdioma} />;
  }

  // O SEU APP ORIGINAL (PROTEGIDO)
  return (
    <HashRouter>
      <div className="relative min-h-screen bg-gray-900">
        {/* Seletor de Idioma flutuante */}
        <button 
          onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')}
          className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-3 py-1 rounded-full flex items-center gap-2 text-xs border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          <Globe size={14} /> {idioma === 'pt' ? 'Português (USD)' : 'English (USD)'}
        </button>

        <Routes>
          <Route path="/" element={<Layout idioma={idioma} />}>
            <Route index element={<Home idioma={idioma} />} />
            <Route path="/meu-dinheiro" element={<MeuDinheiro idioma={idioma} />} />
            <Route path="/business-money" element={<BusinessMoney idioma={idioma} />} />
            <Route path="/brasil" element={<Brasil idioma={idioma} />} />
          </Route>
        </Routes>
        
        {/* Botão Sair */}
        <button onClick={() => supabase.auth.signOut()} className="fixed bottom-6 left-6 text-gray-500 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>

        {/* Chatbot Gemini */}
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-40 transition-transform hover:scale-110"
        >
          <MessageSquarePlus size={28} />
        </button>

        {isChatbotOpen && <Chatbot idioma={idioma} onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </HashRouter>
  );
}

// COMPONENTES AUXILIARES (Para não bugar o build)

function TelaLogin({ idioma, setIdioma }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-center">Controla+</h2>
        <p className="text-gray-400 text-center mb-8">{idioma === 'pt' ? 'Acesso Inteligente em Dólar' : 'Smart Dollar Tracking'}</p>
        
        {enviado ? (
          <div className="text-center bg-blue-900/30 p-4 rounded-lg text-blue-300">
            {idioma === 'pt' ? 'Verifique seu e-mail!' : 'Check your email!'}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" placeholder="E-mail" required
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 transition-colors">
              {idioma === 'pt' ? 'Entrar' : 'Login'}
            </button>
          </form>
        )}
        <button onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')} className="w-full mt-6 text-xs text-gray-500 underline">
          Change to English
        </button>
      </div>
    </div>
  );
}

function TelaPagamento({ idioma, email, setIdioma }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white text-center">
      <h2 className="text-2xl font-bold mb-4">{idioma === 'pt' ? 'Seu período de teste acabou' : 'Your trial has ended'}</h2>
      <p className="text-gray-400 mb-8 max-w-sm">
        {idioma === 'pt' 
          ? `Olá ${email}, continue controlando suas finanças na América do Norte.` 
          : `Hello ${email}, keep tracking your North American finances.`}
      </p>
      <a href="https://buy.stripe.com/test_28EfZh4S12NMbpO3IV6Zy00" className="bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg">
        {idioma === 'pt' ? 'Ativar Assinatura Mensal' : 'Activate Monthly Subscription'}
      </a>
      <button onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')} className="mt-8 text-xs text-gray-500 underline">Switch Language</button>
      <button onClick={() => supabase.auth.signOut()} className="mt-4 text-xs text-gray-600 underline text-red-500">Sign Out</button>
    </div>
  );
}

export default App;
