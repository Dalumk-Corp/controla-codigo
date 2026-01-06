import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. COLE SUAS CHAVES DO SUPABASE AQUI
const supabaseUrl ='https://ryxsadnykjzbawhzgukk.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eHNhZG55a2p6YmF3aHpndWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTQzMDIsImV4cCI6MjA4MzI5MDMwMn0.R1hK6lUSI31Z5bPzl0LJC3JNO5OnpU4ihNlLakdz4PQ'
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) alert('Erro: ' + error.message);
    else alert('Link enviado! Verifique seu e-mail.');
    setLoading(false);
  };

  // ESTILO VISUAL "CONTROLA MAIS"
  const containerStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, sans-serif'
  };

  const cardStyle = {
    padding: '40px', background: '#1e293b', borderRadius: '16px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center'
  };

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px',
    border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
    transition: 'background 0.2s'
  };

  // 1. TELA DE LOGIN ESTILIZADA
  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Controla Mais</h1>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Entre para acessar sua IA</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Digite seu e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Processando...' : 'Acessar agora'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. TELA PÓS-LOGIN (ÁREA DO ASSINANTE)
  return (
    <div style={{ ...containerStyle, justifyContent: 'flex-start', paddingTop: '60px' }}>
      <div style={{ ...cardStyle, maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '16px' }}>Olá, assinante!</h2>
        <p style={{ color: '#94a3b8' }}>E-mail: {user.email}</p>
        
        <div style={{ marginTop: '30px', padding: '24px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px dashed #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '12px' }}>Acesso Restrito</h3>
          <p style={{ marginBottom: '20px' }}>Para liberar as ferramentas do Controla Mais, confirme sua assinatura.</p>
          <a href="SEU_LINK_DO_STRIPE" style={{ ...buttonStyle, textDecoration: 'none', display: 'block' }}>
            Ativar Plano Premium
          </a>
        </div>

        <button onClick={() => supabase.auth.signOut()} style={{ marginTop: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
