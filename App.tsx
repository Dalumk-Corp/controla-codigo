import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// 1. COLE SUAS CHAVES DO SUPABASE AQUI
const supabase = createClient('https://ryxsadnykjzbawhzgukk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eHNhZG55a2p6YmF3aHpndWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTQzMDIsImV4cCI6MjA4MzI5MDMwMn0.R1hK6lUSI31Z5bPzl0LJC3JNO5OnpU4ihNlLakdz4PQ')

function App() {
  const [user, setUser] = useState(null)
  const [isSubscriber, setIsSubscriber] = useState(false)

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

  async function login() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  // TELA DE LOGIN
  if (!user) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Bem-vindo ao Meu App de IA</h1>
        <button onClick={login}>Entrar com Google</button>
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
