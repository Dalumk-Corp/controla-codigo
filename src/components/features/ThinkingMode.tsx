
import { GoogleGenAI } from "@google/genai";
import React, { useState, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ThinkingMode: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Analise meu fluxo de caixa projetado para os próximos 3 trimestres com base nestes números: receita do 1º trimestre $50 mil, custos $30 mil; receita do 2º trimestre $65 mil, custos $35 mil; receita do 3º trimestre $80 mil, custos $40 mil. Quais são os principais riscos e oportunidades considerando o mercado americano atual?');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleQuery = useCallback(async () => {
    if (!prompt) {
      setError('Por favor, insira uma consulta.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      // Fix: Create fresh instance with direct API key access per call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
        },
      });
      setResult(response.text || '');
    } catch (e) {
      setError('Falha ao processar sua consulta. Por favor, tente novamente.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707-.707M6.343 17.657l-.707.707m12.728 0l.707.707M12 21v-1m-4.663-4H16.663" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-100">Análise Avançada de Negócios (Modo Pensamento)</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="complex-prompt" className="block text-sm font-medium text-slate-300 mb-1">Insira sua consulta de negócios complexa</label>
          <textarea
            id="complex-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
            rows={5}
            placeholder="ex: Analise as tendências de mercado para o setor de serviços nos EUA e sugira uma estratégia de crescimento em 3 etapas..."
          />
        </div>

        <button
          onClick={handleQuery}
          disabled={isLoading || !prompt}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-semibold rounded-md transition-colors"
        >
          {isLoading ? 'Pensando...' : 'Executar Análise'}
        </button>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {isLoading && (
            <div className="text-center p-4">
                <LoadingSpinner />
                <p className="text-slate-400 mt-2 text-sm">Realizando análise complexa. Isso pode levar um momento...</p>
            </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-slate-900 rounded-md border border-slate-700">
            <h4 className="font-semibold text-lg mb-2 text-slate-200">Resultado da Análise:</h4>
            <div className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingMode;
