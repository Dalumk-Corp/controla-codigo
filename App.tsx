import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// 1. COLE SUAS CHAVES DO SUPABASE AQUI
const supabase = createClient('https://ryxsadnykjzbawhzgukk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eHNhZG55a2p6YmF3aHpndWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTQzMDIsImV4cCI6MjA4MzI5MDMwMn0.R1hK6lUSI31Z5bPzl0LJC3JNO5OnpU4ihNlLakdz4PQ')

function App() {
  const [user, setUser] = useState(null)
  const [isSubscriber, setIsSubscriber] = useState(false)
  const [email, setEmail] = useState('')
  
  useEffect(() => {
    // Verifica se o usuário está logado
    const session = supabase.auth.getSession()
    setUser(session?.user ?? null)

    if (session?.user) {
      checkSubscription(session.user.id)
    }
  }, [])

  async function checkSubscription(userId) {
    // 2. BUSCA NO BANCO SE ELE PAGOU
    const { data } = await supabase
      .from('assinantes')
      .select('plano_ativo')
      .eq('id', userId)
      .single()
    
    if (data?.plano_ativo) setIsSubscriber(true)
  }

  async function loginComEmail() {
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: window.location.origin, // Manda o usuário de volta para o seu site
    }
  })
  if (error) alert("Erro ao enviar e-mail: " + error.message)
  else alert("Verifique sua caixa de entrada! Enviamos um link de acesso.")
}

// TELA DE LOGIN (Substitua aquela azul por esta)
if (!user) {
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1>Acesse o Sistema</h1>
      <input 
        type="email" 
        placeholder="Seu e-mail melhor" 
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px' }}
      />
      <button onClick={loginComEmail} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Receber Link de Acesso
      </button>
    </div>
  )
}
  // TELA DE PAGAMENTO (Se logado mas não pagou)
  if (!isSubscriber) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Olá, {user.email}!</h1>
        <p>Você precisa de uma assinatura ativa para usar a IA.</p>
        <a href="https://buy.stripe.com/test_28EfZh4S12NMbpO3IV6Zy00" style={{
          padding: '10px 20px', 
          background: '#6772e5', 
          color: '#fff', 
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Assinar Plano Premium (Teste)
        </a>
      </div>
    )
  }

  // TELA DO APP (Onde o seu código original do Gemini vai entrar)
  return (
    <div style={{ padding: '20px' }}>
      <h1>Seu App de IA está Liberado!</h1>
      {/* Aqui colaremos a lógica de chat que o Gemini criou */}
    </div>
  )
}

export default App
