
import React, { useState } from 'react';
import { jsonToCsv, downloadFile, generatePDF } from '../../utils/exportUtils';
import { SavedReport } from '../../types';

interface SaveAndShareProps {
  data: any;
  onClearData: () => void;
  fileNamePrefix: string;
  period: 'monthly' | 'annually';
  historyKey: string;
  noClear?: boolean;
}

const SaveAndShare: React.FC<SaveAndShareProps> = ({ data, onClearData, fileNamePrefix, period, historyKey, noClear = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getFileName = (extension: 'pdf' | 'csv' | '') => {
    const date = new Date();
    const year = date.getFullYear();
    if (period === 'monthly') {
      const month = date.toLocaleString('pt-BR', { month: 'long' });
      return `${fileNamePrefix}-${month}-${year}${extension ? '.' + extension : ''}`;
    }
    return `${fileNamePrefix}-${year}${extension ? '.' + extension : ''}`;
  };

  const saveToHistory = () => {
    const date = new Date();
    // Formato Mês/Ano (ex: Dezembro/2023)
    const month = date.toLocaleString('pt-BR', { month: 'long' });
    const year = date.getFullYear();
    const monthYearFormatted = `${month.charAt(0).toUpperCase() + month.slice(1)}/${year}`;
    
    const newReport: SavedReport = {
        id: crypto.randomUUID(),
        timestamp: date.toISOString(),
        monthYear: monthYearFormatted,
        fileName: getFileName(''),
        data: data
    };

    const savedHistory = localStorage.getItem(historyKey);
    const history: SavedReport[] = savedHistory ? JSON.parse(savedHistory) : [];
    
    localStorage.setItem(historyKey, JSON.stringify([newReport, ...history]));
  };

  const confirmAndClear = () => {
    if (noClear) return;
    const periodText = period === 'monthly' ? 'mês' : 'ano';
    if (window.confirm(`Relatório salvo no histórico! Você tem certeza que deseja limpar os dados atuais para iniciar um novo ${periodText}? Esta ação não pode ser desfeita.`)) {
      onClearData();
    }
  };

  const handleExport = (format: 'pdf' | 'csv' | 'history') => {
    setIsOpen(false);
    
    if (format === 'history') {
        saveToHistory();
        if (noClear) {
            alert("Relatório arquivado com sucesso no histórico!");
        } else {
            confirmAndClear();
        }
        return;
    }

    if (format === 'pdf') {
       const fileName = getFileName('pdf');
       const title = fileNamePrefix.replace(/-/g, ' ').toUpperCase();
       generatePDF(data, fileName, title);
    } else {
       let content = jsonToCsv(data);
       if (content) {
         downloadFile(content, getFileName('csv'), 'text/csv');
       } else {
         alert("Não há dados suficientes para gerar a planilha.");
         return; 
       }
    }
    
    if (!noClear && window.confirm("Deseja também arquivar no histórico e reiniciar o período agora?")) {
        saveToHistory();
        onClearData();
    } else if (noClear) {
        saveToHistory();
    }
  };
  
  const periodText = period === 'monthly' ? 'Mês' : 'Ano';
  const dataIsArray = Array.isArray(data);
  const dataIsPresent = dataIsArray ? data.length > 0 : data && (Object.values(data).some((arr: any) => Array.isArray(arr) && arr.length > 0));

  if (!dataIsPresent) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${noClear ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm shadow-lg`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {noClear ? `Arquivar e Exportar ${periodText}` : `Arquivar e Exportar ${periodText}`}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-slate-800 border border-slate-700 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
            <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-700 mb-1">Ações</div>
              
              <button
                onClick={() => handleExport('history')}
                className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-blue-400 hover:bg-slate-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                {noClear ? 'Salvar no Histórico' : 'Arquivar e Reiniciar Mês'}
              </button>

              <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-700 my-1">Exportar Agora</div>

              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Salvar PDF
              </button>
               <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Salvar Planilha
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SaveAndShare;
