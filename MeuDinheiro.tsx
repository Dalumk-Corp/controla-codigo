
import React, { useState } from 'react';
import { Bot, LineChart, Loader2 } from 'lucide-react';
import Card from '../Card';
import { analyzeFinancialData } from '../services/geminiService';

const mockTransactions = [
  { id: 1, date: '2024-07-15', description: 'Groceries', category: 'Food', amount: -75.50 },
  { id: 2, date: '2024-07-14', description: 'Salary', category: 'Income', amount: 2500.00 },
  { id: 3, date: '2024-07-13', description: 'Gasoline', category: 'Transport', amount: -50.00 },
  { id: 4, date: '2024-07-12', description: 'Restaurant', category: 'Food', amount: -45.20 },
  { id: 5, date: '2024-07-10', description: 'Internet Bill', category: 'Utilities', amount: -60.00 },
  { id: 6, date: '2024-07-09', description: 'Gym Membership', category: 'Health', amount: -40.00 },
];

const MeuDinheiro: React.FC = () => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis('');
    try {
        const dataString = JSON.stringify(mockTransactions, null, 2);
        const result = await analyzeFinancialData(dataString);
        setAnalysis(result);
    } catch (error) {
        console.error("Error analyzing data:", error);
        setAnalysis("Sorry, an error occurred while analyzing the data.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-meu-dinheiro-primary flex items-center gap-3">
        <LineChart size={36} /> Meu Dinheiro
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Date</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Category</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-2 text-sm text-gray-400">{tx.date}</td>
                    <td className="p-2">{tx.description}</td>
                    <td className="p-2 text-gray-300">{tx.category}</td>
                    <td className={`p-2 text-right font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

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
                <p className="text-gray-400">Click the button below to get an AI-powered analysis of your recent transactions.</p>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500"
          >
            {isLoading ? 'Analyzing...' : <><Bot size={20} /> Analyze with Gemini Pro</>}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default MeuDinheiro;
