
import React, { useState, useMemo } from 'react';
import { MetaStep, Currency } from '../../types';
import { CURRENCIES } from '../../constants';

interface MetaStepsTableProps {
  steps: MetaStep[];
  setSteps: React.Dispatch<React.SetStateAction<MetaStep[]>>;
}

const MetaStepsTable: React.FC<MetaStepsTableProps> = ({ steps, setSteps }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<MetaStep | null>(null);

  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => new Date(a.quando).getTime() - new Date(b.quando).getTime());
  }, [steps]);

  const formatCurrencyValue = (value: number, currency: Currency) => {
    const locale = (currency === 'USD' || currency === 'CAD') ? 'en-US' : 'pt-BR';
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
  };

  const handleAddRow = (tipo: 'Aporte' | 'Retirada' = 'Aporte') => {
    const newRow: MetaStep = {
      id: crypto.randomUUID(),
      quanto: 0,
      currency: 'USD',
      quando: new Date().toISOString().split('T')[0],
      como: tipo === 'Retirada' ? 'Retirada de Saldo' : '',
      investimentoMensal: 0,
      observacao: '',
      tipo: tipo
    };
    setSteps([...steps, newRow]);
    handleEdit(newRow);
  };

  const handleDeleteRow = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setSteps(steps.filter(step => step.id !== id));
    }
  };

  const handleEdit = (step: MetaStep) => {
    setEditingId(step.id);
    setCurrentStep({ ...step });
  };

  const handleSave = (id: string) => {
    if (currentStep) {
      setSteps(steps.map(s => (s.id === id ? currentStep : s)));
      setEditingId(null);
      setCurrentStep(null);
    }
  };

  const handleEditChange = (field: keyof MetaStep, value: string | number) => {
    if (currentStep) {
        setCurrentStep({ ...currentStep, [field]: value });
    }
  };

  const renderInputField = (step: MetaStep, field: keyof MetaStep) => {
    const isEditing = editingId === step.id;
    const value = isEditing && currentStep ? currentStep[field] : step[field];
    const isWithdrawal = step.tipo === 'Retirada';

    if (!isEditing) {
      if (field === 'quanto' || field === 'investimentoMensal') {
         if (step[field] > 0) {
            return (
              <span className={isWithdrawal && field === 'quanto' ? 'text-red-400 font-bold' : ''}>
                {isWithdrawal && field === 'quanto' ? '-' : ''}{formatCurrencyValue(step[field] as number, step.currency)}
              </span>
            );
         }
         return 'N/A';
      }
      return <span className={`px-2 py-1 ${isWithdrawal ? 'text-red-400' : ''}`}>{value || 'N/A'}</span>;
    }

    if (currentStep) {
        switch (field) {
            case 'quanto':
            case 'investimentoMensal':
                 return (
                    <div className="flex gap-1">
                        <input type="number" step="0.01" value={currentStep[field] as number || ''} onChange={(e) => handleEditChange(field, parseFloat(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-2/3" />
                        <select value={currentStep.currency} onChange={(e) => handleEditChange('currency', e.target.value)} className="bg-slate-700 p-1 rounded w-1/3 text-xs">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                );
            case 'quando':
                return <input type="date" value={currentStep.quando} onChange={(e) => handleEditChange('quando', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
            case 'como':
                 return <input type="text" value={currentStep.como} onChange={(e) => handleEditChange('como', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
            case 'observacao':
                return <input type="text" value={currentStep.observacao} onChange={(e) => handleEditChange('observacao', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
            default: return null;
        }
    }
    return null;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700">
            <tr>
              <th className="px-4 py-3 min-w-[80px]">Tipo</th>
              <th className="px-4 py-3 min-w-[160px]">Valor</th>
              <th className="px-4 py-3 min-w-[120px]">Quando</th>
              <th className="px-4 py-3 min-w-[180px]">Como / Motivo</th>
              <th className="px-4 py-3 min-w-[150px]">Inv. Mensal</th>
              <th className="px-4 py-3 min-w-[200px]">Observação</th>
              <th className="px-4 py-3 min-w-[140px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedSteps.map(step => (
              <tr key={step.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-2">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${step.tipo === 'Retirada' ? 'bg-red-900/40 text-red-400' : 'bg-blue-900/40 text-blue-400'}`}>
                      {step.tipo || 'Aporte'}
                   </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(step, 'quanto')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(step, 'quando')}</td>
                <td className="px-4 py-2 break-words">{renderInputField(step, 'como')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(step, 'investimentoMensal')}</td>
                <td className="px-4 py-2 break-words">{renderInputField(step, 'observacao')}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                   <div className="flex gap-2">
                     {editingId === step.id ? (
                        <button onClick={() => handleSave(step.id)} className="font-medium text-green-400 hover:underline text-xs">Salvar</button>
                     ) : (
                        <button onClick={() => handleEdit(step)} className="font-medium text-blue-400 hover:underline text-xs">Editar</button>
                     )}
                     <button onClick={() => handleDeleteRow(step.id)} className="font-medium text-red-400 hover:underline text-xs">Excluir</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center gap-4 p-4 border-t border-slate-700">
        <button onClick={() => handleAddRow('Aporte')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Novo Passo / Aporte
        </button>
        <button onClick={() => handleAddRow('Retirada')} className="bg-red-600/80 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          Lançar Saída / Retirada
        </button>
      </div>
    </div>
  );
};

export default MetaStepsTable;
