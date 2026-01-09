import React, { useState } from 'react';
import { Debt, Currency } from '../../types';
import { CURRENCIES, DEBT_STATUSES, DEBT_REASONS } from '../../constants';

interface DividasTableProps {
  debts: Debt[];
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>;
}

const DividasTable: React.FC<DividasTableProps> = ({ debts, setDebts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentDebt, setCurrentDebt] = useState<Debt | null>(null);
  const [newCredor, setNewCredor] = useState('');

  const handleAddRow = () => {
    if (!newCredor.trim()) {
      alert('O nome do credor não pode estar vazio.');
      return;
    }
    const newRow: Debt = {
      id: crypto.randomUUID(),
      credor: newCredor.trim(),
      valorTotal: 0,
      valorParcela: 0,
      currency: 'USD',
      inicio: new Date().toISOString().split('T')[0],
      status: 'Regular',
      motivo: 'Financiamento',
      parcelasTotais: 1,
      parcelasPagas: 0,
    };
    setDebts([...debts, newRow]);
    setNewCredor('');
  };

  const handleDeleteRow = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta dívida?')) {
      setDebts(debts.filter(debt => debt.id !== id));
    }
  };

  const handleEdit = (debt: Debt) => {
    setEditingId(debt.id);
    setCurrentDebt({ ...debt });
  };

  const handleSave = (id: string) => {
    if (currentDebt) {
      setDebts(debts.map(debt => (debt.id === id ? currentDebt : debt)));
      setEditingId(null);
      setCurrentDebt(null);
    }
  };

  const handleEditChange = (field: keyof Debt, value: string | number) => {
    if (currentDebt) {
      setCurrentDebt({ ...currentDebt, [field]: value });
    }
  };

  const renderInputField = (debt: Debt, field: keyof Debt) => {
    const isEditing = editingId === debt.id;
    const value = isEditing && currentDebt ? currentDebt[field] : debt[field];

    if (!isEditing) {
      if (field === 'valorTotal' || field === 'valorParcela') {
         if (debt[field] > 0) {
            return `${(debt[field] as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${debt.currency}`;
         }
         return '0.00 ' + debt.currency;
      }
      if (field === 'parcelasTotais') {
          return `${debt.parcelasPagas || 0} / ${debt.parcelasTotais || 0}`;
      }
      return <span className="px-2 py-1">{value || 'N/A'}</span>;
    }

    if (currentDebt) {
        switch (field) {
            case 'credor':
                return <input type="text" value={currentDebt.credor} onChange={(e) => handleEditChange('credor', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
            case 'valorTotal':
            case 'valorParcela':
                 return (
                    <div className="flex gap-1">
                        <input type="number" step="0.01" value={currentDebt[field] as number} onChange={(e) => handleEditChange(field, parseFloat(e.target.value))} className="bg-slate-700 p-1 rounded w-2/3" />
                        <select value={currentDebt.currency} onChange={(e) => handleEditChange('currency', e.target.value)} className="bg-slate-700 p-1 rounded w-1/3">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                );
            case 'parcelasTotais':
                return (
                    <div className="flex gap-1">
                        <input type="number" placeholder="Pagas" value={currentDebt.parcelasPagas || 0} onChange={(e) => handleEditChange('parcelasPagas', parseInt(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-1/2 text-xs" />
                        <span className="text-slate-500 self-center">/</span>
                        <input type="number" placeholder="Total" value={currentDebt.parcelasTotais || 0} onChange={(e) => handleEditChange('parcelasTotais', parseInt(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-1/2 text-xs" />
                    </div>
                );
            case 'inicio':
                return <input type="date" value={currentDebt.inicio} onChange={(e) => handleEditChange('inicio', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
            case 'status':
                return <select value={currentDebt.status} onChange={(e) => handleEditChange('status', e.target.value as any)} className="bg-slate-700 p-1 rounded w-full">{DEBT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>;
            case 'motivo':
                 return <select value={currentDebt.motivo} onChange={(e) => handleEditChange('motivo', e.target.value as any)} className="bg-slate-700 p-1 rounded w-full">{DEBT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}</select>;
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
              <th className="px-4 py-3 min-w-[200px]">Credor</th>
              <th className="px-4 py-3 min-w-[160px]">Valor Total</th>
              <th className="px-4 py-3 min-w-[160px]">Valor Parcela</th>
              <th className="px-4 py-3 min-w-[120px]">Parcelas (Pagas/Totais)</th>
              <th className="px-4 py-3 min-w-[120px]">Início</th>
              <th className="px-4 py-3 min-w-[120px]">Status</th>
              <th className="px-4 py-3 min-w-[140px]">Motivo</th>
              <th className="px-4 py-3 min-w-[140px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {debts.map(debt => (
              <tr key={debt.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-2 font-medium break-words">{renderInputField(debt, 'credor')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(debt, 'valorTotal')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(debt, 'valorParcela')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(debt, 'parcelasTotais')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(debt, 'inicio')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(debt, 'status')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(debt, 'motivo')}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                   <div className="flex gap-2">
                     {editingId === debt.id ? (
                        <button onClick={() => handleSave(debt.id)} className="font-medium text-green-400 hover:underline text-xs">Salvar</button>
                     ) : (
                        <button onClick={() => handleEdit(debt)} className="font-medium text-blue-400 hover:underline text-xs">Editar</button>
                     )}
                     <button onClick={() => handleDeleteRow(debt.id)} className="font-medium text-red-400 hover:underline text-xs">Excluir</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center gap-2 p-4 border-t border-slate-700">
        <input 
          type="text" 
          value={newCredor}
          onChange={(e) => setNewCredor(e.target.value)}
          placeholder="Nome do credor" 
          className="flex-grow bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button onClick={handleAddRow} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          Adicionar Dívida
        </button>
      </div>
    </div>
  );
};

export default DividasTable;