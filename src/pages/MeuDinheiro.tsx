
import React, { useState, useEffect } from 'react';
import { Bot, LineChart, Loader2, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import { analyzeFinancialData } from '../services/geminiService';

// CORREÇÃO AQUI: 
// 1. Mudamos de { createClient } para { supabase }
// 2. Mudamos o caminho para '../' (sobe da pasta pages para a src)
import { supabase } from '../supabaseClient';


const MeuDinheiro: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // 1. CARREGAR DADOS DO BANCO (Busca apenas os dados do usuário logado)
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error) setTransactions(data || []);
    setIsFetching(false);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis('');
    try {
        // Agora ele analisa os dados REAIS do usuário
        const dataString = JSON.stringify(transactions, null, 2);
        const result = await analyzeFinancialData(dataString);
        setAnalysis(result);
    } catch (error) {
        setAnalysis("Sorry, an error occurred while analyzing the data.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-meu-dinheiro-primary flex items-center gap-3 text-white">
        <LineChart size={36} /> Meu Dinheiro
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Recent Transactions</h2>
            {/* Aqui você pode adicionar um botão para abrir um formulário de novo gasto futuramente */}
          </div>

          <div className="overflow-x-auto">
            {isFetching ? <Loader2 className="animate-spin mx-auto text-blue-400" /> : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-2 text-gray-400 font-medium">Date</th>
                    <th className="p-2 text-gray-400 font-medium">Description</th>
                    <th className="p-2 text-gray-400 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colSpan={3} className="p-4 text-center text-gray-500">No transactions found.</td></tr>
                  ) : (
                    transactions.map(tx => (
                      <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-2 text-sm text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="p-2 text-white">{tx.description}</td>
                        <td className={`p-2 text-right font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${Number(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Card da IA Gemini (Continua igual, mas agora lê os dados reais) */}
        <Card className="p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-white">AI Financial Advisor</h2>
          <div className="flex-grow bg-gray-900/50 rounded-lg p-4 border border-gray-700 min-h-[200px]">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-blue-400" size={40} />
                </div>
            ) : analysis ? (
                <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-wrap">{analysis}</div>
            ) : (
                <p className="text-gray-400">Click to analyze your **actual** data with Gemini Pro.</p>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || transactions.length === 0}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500"
          >
            {isLoading ? 'Analyzing...' : <><Bot size={20} /> Analyze Expenses</>}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default MeuDinheiro;
