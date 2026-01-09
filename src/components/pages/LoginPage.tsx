import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedBackground from '../ui/AnimatedBackground';
import Card from '../ui/Card';

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = isLoginMode 
      ? await auth.login(email, password)
      : await auth.signup(email, password);
      
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <AnimatedBackground>
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-sm p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              {isLoginMode ? 'Bem-vindo de volta!' : 'Crie sua Conta'}
            </h1>
            <p className="text-slate-400 mt-2">
                {isLoginMode ? 'Acesse sua conta para continuar' : 'Preencha os dados para se registrar'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
              >
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (isLoginMode ? 'Entrar' : 'Criar Conta')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={toggleMode} className="text-sm text-blue-400 hover:text-blue-300">
              {isLoginMode ? 'Não tem uma conta? Crie uma agora' : 'Já tem uma conta? Faça o login'}
            </button>
          </div>
        </Card>
      </div>
    </AnimatedBackground>
  );
};

export default LoginPage;