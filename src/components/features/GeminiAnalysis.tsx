
import React, { useState, useRef, useCallback } from 'react';
import { analyzeImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import LoadingSpinner from './LoadingSpinner';
import { EXPENSE_CATEGORIES, BUSINESS_EXPENSE_CATEGORIES, PAYMENT_METHODS, BUSINESS_EXPENSE_TYPES, CLASSIFICATIONS } from '../../constants';
import { Currency } from '../../types';

interface ReceiptAnalysisProps {
  onSave?: (expenseData: any) => void;
  context?: 'personal' | 'business';
}

const ReceiptAnalysis: React.FC<ReceiptAnalysisProps> = ({ onSave, context = 'personal' }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const categories = context === 'business' ? BUSINESS_EXPENSE_CATEGORIES : EXPENSE_CATEGORIES;
  
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    valor: "" as any,
    currency: 'USD' as Currency,
    categoria: categories[0],
    formaDePagamento: PAYMENT_METHODS[0],
    tipo: 'Variável',
    tipoDeGasto: 'Variável',
    classificacao: 'Essencial',
    observacao: ''
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setResult('');
      setParsedData(null);
      setIsCameraOpen(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Erro ao acessar a câmera. Verifique as permissões.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "receipt_capture.jpg", { type: "image/jpeg" });
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            stopCamera();
            setResult('');
            setParsedData(null);
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleAnalysis = useCallback(async () => {
    if (!imageFile) {
      setError('Por favor, anexe uma imagem do recibo ou tire uma foto.');
      return;
    }
    
    const prompt = `Analise a imagem deste recibo. Extraia as seguintes informações e retorne APENAS um objeto JSON (sem marcação markdown):
    {
      "descricao": "Nome do estabelecimento ou resumo dos itens",
      "valor": 0.00 (número, use ponto para decimais),
      "data": "YYYY-MM-DD" (formato ISO),
      "categoria_sugerida": "Uma categoria baseada em: ${categories.join(', ')}"
    }
    Se algum dado não estiver claro, estime ou deixe em branco.`;

    setIsLoading(true);
    setError('');
    setResult('');
    setParsedData(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const analysisResult = await analyzeImage(prompt, base64Image, imageFile.type);
      
      try {
        let jsonStr = analysisResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);
        
        setParsedData(data);
        
        setFormData(prev => ({
          ...prev,
          descricao: data.descricao || '',
          valor: typeof data.valor === 'number' ? data.valor : parseFloat(data.valor) || "",
          data: data.data || new Date().toISOString().split('T')[0],
          categoria: categories.includes(data.categoria_sugerida) ? data.categoria_sugerida : categories[0],
          observacao: 'Extraído automaticamente via IA'
        }));

      } catch (jsonError) {
        console.warn("Could not parse JSON, showing raw text", jsonError);
        setResult(analysisResult);
      }

    } catch (e) {
      setError('Falha ao analisar a imagem. Por favor, tente novamente.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, categories]);

  const handleSaveExpense = () => {
    const numericValue = parseFloat(formData.valor as any);
    if (onSave && !isNaN(numericValue)) {
        const expenseToSave = {
            ...formData,
            valor: numericValue,
            id: crypto.randomUUID()
        };
        onSave(expenseToSave);
        setImageFile(null);
        setPreviewUrl(null);
        setParsedData(null);
        setResult('');
        alert('Despesa lançada com sucesso!');
    } else {
      alert('Por favor, insira um valor válido.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Análise de Recibos com IA</h2>
      <p className="text-slate-400 mb-6">Tire uma foto ou anexe um recibo. A IA extrairá os dados para lançamento automático.</p>
      
      <div className="space-y-4 bg-slate-900/50 p-6 rounded-lg border border-slate-700">
        
        <div className="flex gap-4 flex-wrap">
             <button
                onClick={isCameraOpen ? takePhoto : startCamera}
                className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 {isCameraOpen ? 'Tirar Foto' : 'Usar Câmera'}
             </button>
             
             {isCameraOpen && (
                 <button onClick={stopCamera} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md">
                     Cancelar
                 </button>
             )}

            <div className="flex-1">
                <label htmlFor="image-upload" className="w-full h-full flex items-center justify-center py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-md transition-colors cursor-pointer text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Carregar Arquivo
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>

        {isCameraOpen && (
             <div className="relative bg-black rounded-lg overflow-hidden max-h-96 flex justify-center">
                 <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-full object-cover" />
                 <canvas ref={canvasRef} className="hidden" />
             </div>
        )}

        {previewUrl && !isCameraOpen && (
          <div className="mt-4 border border-slate-700 rounded-lg p-2 bg-slate-900">
            <img src={previewUrl} alt="Pré-visualização do recibo" className="max-h-80 rounded-lg mx-auto" />
          </div>
        )}

        {!isCameraOpen && previewUrl && (
            <button
            onClick={handleAnalysis}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg shadow-lg"
            >
            {isLoading ? 'Analisando Recibo...' : 'Analisar e Extrair Dados'}
            </button>
        )}

        {error && <p className="text-red-400 text-center bg-red-900/20 p-2 rounded">{error}</p>}
        {isLoading && <LoadingSpinner />}

        {parsedData && (
            <div className="mt-6 p-6 bg-slate-800 rounded-lg border border-teal-500/50 shadow-lg animate-fade-in">
                <h3 className="text-xl font-bold text-teal-400 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Dados Extraídos - Confirmar Lançamento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Data</label>
                        <input type="date" value={formData.data} onChange={(e) => setFormData({...formData, data: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Descrição</label>
                        <input type="text" value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Valor</label>
                        <div className="flex gap-2">
                             <input type="number" step="0.01" value={formData.valor} onChange={(e) => setFormData({...formData, valor: e.target.value})} className="w-2/3 bg-slate-700 text-white p-2 rounded border border-slate-600" />
                             <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value as Currency})} className="w-1/3 bg-slate-700 text-white p-2 rounded border border-slate-600">
                                 <option value="USD">USD</option>
                                 <option value="BRL">BRL</option>
                                 <option value="EUR">EUR</option>
                                 <option value="CAD">CAD</option>
                             </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Categoria</label>
                        <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Pagamento</label>
                        <select value={formData.formaDePagamento} onChange={(e) => setFormData({...formData, formaDePagamento: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600">
                            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    {context === 'personal' && (
                         <div>
                            <label className="block text-sm text-slate-400 mb-1">Classificação</label>
                            <select value={formData.classificacao} onChange={(e) => setFormData({...formData, classificacao: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600">
                                {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    )}
                     <div>
                        <label className="block text-sm text-slate-400 mb-1">Tipo</label>
                        {context === 'personal' ? (
                             <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600">
                                <option value="Variável">Variável</option>
                                <option value="Fixo">Fixo</option>
                            </select>
                        ) : (
                             <select value={formData.tipoDeGasto} onChange={(e) => setFormData({...formData, tipoDeGasto: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600">
                                {BUSINESS_EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        )}
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm text-slate-400 mb-1">Observação</label>
                        <input type="text" value={formData.observacao} onChange={(e) => setFormData({...formData, observacao: e.target.value})} className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={handleSaveExpense}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105"
                    >
                        Confirmar e Lançar na Planilha
                    </button>
                </div>
            </div>
        )}

        {!parsedData && result && (
          <div className="mt-4 p-4 bg-slate-900 rounded-md border border-slate-700">
            <h4 className="font-semibold text-lg mb-2 text-slate-200">Resultado da Análise (Texto Bruto):</h4>
            <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm">{result}</pre>
            <p className="mt-2 text-yellow-500 text-sm">A IA não retornou os dados estruturados corretamente para preenchimento automático. Tente novamente ou verifique a imagem.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptAnalysis;
