
import React, { useState, useEffect } from 'react';
import { SavedReport } from '../../types';
import { generatePDF, jsonToCsv, downloadFile } from '../../utils/exportUtils';
import Card from '../ui/Card';

interface HistoryListProps {
    historyKey: string;
}

const HistoryList: React.FC<HistoryListProps> = ({ historyKey }) => {
    const [history, setHistory] = useState<SavedReport[]>([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem(historyKey);
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, [historyKey]);

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este relatório do histórico?")) {
            const updated = history.filter(h => h.id !== id);
            setHistory(updated);
            localStorage.setItem(historyKey, JSON.stringify(updated));
        }
    };

    const handleDownload = (report: SavedReport, format: 'pdf' | 'csv') => {
        if (format === 'pdf') {
            const title = report.fileName.replace(/-/g, ' ').toUpperCase();
            generatePDF(report.data, `${report.fileName}.pdf`, title);
        } else {
            const csv = jsonToCsv(report.data);
            if (csv) {
                downloadFile(csv, `${report.fileName}.csv`, 'text/csv');
            }
        }
    };

    if (history.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                <div className="text-slate-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-300">Nenhum histórico encontrado</h3>
                <p className="text-slate-500 mt-2">Relatórios arquivados aparecerão aqui após você utilizar o botão "Fechar e Reiniciar Mês".</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((report) => (
                <Card key={report.id} className="p-6 bg-slate-800 border border-slate-700 flex flex-col hover:border-blue-500/40 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{report.monthYear}</span>
                            <h4 className="text-lg font-bold text-slate-100 mt-1">{report.fileName}</h4>
                            <p className="text-[10px] text-slate-500 mt-1">Salvo em: {new Date(report.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                        <button 
                            onClick={() => handleDelete(report.id)}
                            className="p-1.5 bg-slate-700/50 rounded-lg text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            title="Remover do histórico"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>

                    <div className="mt-auto pt-6 flex gap-3 border-t border-slate-700/50">
                        <button 
                            onClick={() => handleDownload(report, 'pdf')}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-700 hover:bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg transition-colors border border-blue-500/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            PDF
                        </button>
                        <button 
                            onClick={() => handleDownload(report, 'csv')}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-700 hover:bg-teal-600/20 text-teal-400 text-xs font-bold rounded-lg transition-colors border border-teal-500/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            PLANILHA
                        </button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default HistoryList;
