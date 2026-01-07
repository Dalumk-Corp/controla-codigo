
import React, { useState } from 'react';
import { Search, Loader2, Link as LinkIcon, Globe } from 'lucide-react';
import Card from '../components/ui/Card';
import { getGroundedData } from '../services/geminiService';
import { GroundingSource } from '../types';

const Brasil: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const prompt = "What is the current exchange rate between Brazilian Real (BRL) and US Dollar (USD)? Also include the rate for Euro (EUR).";
      const response = await getGroundedData(prompt);
      
      setResult(response.text);
      
      const extractedSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Source'
      })).filter(s => s.uri);
      
      if (extractedSources) {
          setSources(extractedSources);
      }

    } catch (err) {
      console.error("Failed to fetch exchange rate:", err);
      setError("An error occurred while fetching the latest data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-brasil-primary flex items-center gap-3">
        <Globe size={36} /> Conexão Brasil
      </h1>
      <Card className="p-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-white">Live Exchange Rates</h2>
          <p className="text-gray-400 mt-2 mb-6 max-w-md">
            Get up-to-date currency exchange rates powered by Gemini with Google Search grounding for accuracy.
          </p>
          <button
            onClick={handleFetchRate}
            disabled={isLoading}
            className="bg-brasil-primary/80 hover:bg-brasil-primary text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-500"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            {isLoading ? 'Fetching Data...' : 'Get Latest Rates'}
          </button>

          {error && <p className="text-red-400 mt-4">{error}</p>}
          
          {(result || isLoading) && (
            <div className="mt-8 w-full max-w-2xl text-left bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="animate-spin text-brasil-primary" size={32} />
                    </div>
                ) : (
                    <>
                    <div className="prose prose-invert text-gray-300 whitespace-pre-wrap">{result}</div>
                    {sources.length > 0 && (
                        <div className="mt-4 border-t border-gray-600 pt-3">
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Sources:</h4>
                        <div className="flex flex-col gap-2">
                            {sources.map((source, i) => (
                            <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-2 truncate">
                                <LinkIcon size={14} /> {source.title}
                            </a>
                            ))}
                        </div>
                        </div>
                    )}
                    </>
                )}
            </div>
          )}

        </div>
      </Card>
    </div>
  );
};

export default Brasil;
