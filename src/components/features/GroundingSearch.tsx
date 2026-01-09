import React, { useState, useCallback } from 'react';
import { performGroundedSearch } from '../../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { GroundingSource } from '../../types';


const GroundingSearch: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('What are the latest currency exchange regulations for sending money to Brazil from Europe?');
  const [result, setResult] = useState<string>('');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a search query.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    setSources([]);
    try {
      const { text, sources: searchSources } = await performGroundedSearch(prompt);
      setResult(text);
      setSources(searchSources);
    } catch (e) {
      setError('Failed to perform search. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h3 className="text-xl font-semibold mb-4 text-slate-100">Live Information Search</h3>
       <div className="space-y-4">
        <div>
          <label htmlFor="search-prompt" className="block text-sm font-medium text-slate-300 mb-1">Ask a question for up-to-date information</label>
          <div className="flex gap-2">
            <input
              id="search-prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              placeholder="e.g., Current USD to BRL exchange rate..."
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !prompt}
              className="py-2 px-4 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 text-white font-semibold rounded-md transition-colors"
            >
              {isLoading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {isLoading && <LoadingSpinner className="my-4" />}

        {result && (
          <div className="mt-4 p-4 bg-slate-900 rounded-md border border-slate-700">
            <h4 className="font-semibold text-lg mb-2 text-slate-200">Search Result:</h4>
            <pre className="whitespace-pre-wrap text-slate-300 font-sans">{result}</pre>
            {sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <h5 className="font-semibold text-md mb-2 text-slate-300">Sources:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                        {source.title || source.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundingSearch;
