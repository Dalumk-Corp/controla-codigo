
import React, { useState, useMemo } from 'react';
import { Income, Currency } from '../../types';
import { INCOME_TYPES, CURRENCIES } from '../../constants';

interface IncomeTableProps {
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
}

type SortField = 'data' | 'descricao' | 'tipo';
type SortOrder = 'asc' | 'desc';

const IncomeTable: React.FC<IncomeTableProps> = ({ incomes, setIncomes }) => {
  const [newIncome, setNewIncome] = useState<Omit<Income, 'id'>>({
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    tipo: INCOME_TYPES[0],
    valor: "" as any,
    currency: 'USD',
    observacao: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);

  const [sortField, setSortField] = useState<SortField>('data');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedIncomes = useMemo(() => {
    return [...incomes].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'data') {
        valA = new Date(a.data).getTime();
        valB = new Date(b.data).getTime();
      } else {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [incomes, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatCurrencyValue = (value: number, currency: Currency) => {
    if (currency === 'USD' || currency === 'CAD') {
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
    }
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
  };

  const handleAddIncome = () => {
    const numericValue = parseFloat(newIncome.valor as any);
    if (!newIncome.descricao || isNaN(numericValue) || numericValue <= 0) {
      alert('Preencha a descrição e um valor maior que zero.');
      return;
    }
    setIncomes([...incomes, { ...newIncome, valor: numericValue, id: crypto.randomUUID() } as Income]);
    setNewIncome({
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      tipo: INCOME_TYPES[0],
      valor: "" as any,
      currency: 'USD',
      observacao: '',
    });
  };

  const handleDeleteIncome = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrada?')) {
        setIncomes(incomes.filter(income => income.id !== id));
    }
  };

  const handleEdit = (income: Income) => {
    setEditingId(income.id);
    setCurrentIncome({ ...income });
  };
    
  const handleSave = (id: string) => {
    if (currentIncome) {
      setIncomes(incomes.map(inc => (inc.id === id ? currentIncome : inc)));
      setEditingId(null);
      setCurrentIncome(null);
    }
  };

  const handleEditChange = (field: keyof Income, value: string | number) => {
    if (currentIncome) {
      setCurrentIncome({ ...currentIncome, [field]: value });
    }
  };

  const renderInputField = (income: Income, field: keyof Income) => {
    const isEditing = editingId === income.id;
    const value = isEditing && currentIncome ? currentIncome[field] : income[field];

    if (!isEditing) {
        if (field === 'valor') {
            return formatCurrencyValue(income.valor, income.currency);
        }
      return <span className="px-2 py-1">{value}</span>;
    }

    if (currentIncome) {
      switch (field) {
        case 'data':
          return <input type="date" value={currentIncome.data} onChange={(e) => handleEditChange('data', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        case 'descricao':
          return <input type="text" value={currentIncome.descricao} onChange={(e) => handleEditChange('descricao', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        case 'tipo':
          return <select value={currentIncome.tipo} onChange={(e) => handleEditChange('tipo', e.target.value)} className="bg-slate-700 p-1 rounded w-full">{INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>;
        case 'valor':
            return (
                <div className="flex gap-1">
                    <input type="number" step="0.01" value={currentIncome.valor} onChange={(e) => handleEditChange('valor', parseFloat(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-2/3" />
                    <select value={currentIncome.currency} onChange={(e) => handleEditChange('currency', e.target.value)} className="bg-slate-700 p-1 rounded w-1/3">
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            );
        case 'observacao':
          return <input type="text" value={currentIncome.observacao} onChange={(e) => handleEditChange('observacao', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        default: return null;
      }
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <svg className="w-3 h-3 ml-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    return sortOrder === 'asc' 
      ? <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Adicionar Nova Entrada</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6 p-4 border border-slate-700 rounded-lg">
        <input type="date" value={newIncome.data} onChange={e => setNewIncome({ ...newIncome, data: e.target.value })} className="bg-slate-700 p-2 rounded" />
        <input type="text" placeholder="Descrição" value={newIncome.descricao} onChange={e => setNewIncome({ ...newIncome, descricao: e.target.value })} className="bg-slate-700 p-2 rounded" />
        <select value={newIncome.tipo} onChange={e => setNewIncome({ ...newIncome, tipo: e.target.value as any })} className="bg-slate-700 p-2 rounded">{INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
        <div className="flex gap-2">
            <input type="number" step="0.01" placeholder="Valor" value={newIncome.valor} onChange={e => setNewIncome({ ...newIncome, valor: e.target.value as any })} className="bg-slate-700 p-2 rounded w-2/3" />
            <select value={newIncome.currency} onChange={e => setNewIncome({ ...newIncome, currency: e.target.value as Currency })} className="bg-slate-700 p-2 rounded w-1/3">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
        <input type="text" placeholder="Observação (Opcional)" value={newIncome.observacao} onChange={e => setNewIncome({ ...newIncome, observacao: e.target.value })} className="bg-slate-700 p-2 rounded" />
        <button onClick={handleAddIncome} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Adicionar Entrada</button>
      </div>

       <h2 className="text-2xl font-semibold text-slate-100 mb-4">Entradas Registradas</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700">
            <tr>
              <th className="px-4 py-3 min-w-[120px] cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => toggleSort('data')}>
                <div className="flex items-center">Data <SortIcon field="data" /></div>
              </th>
              <th className="px-4 py-3 min-w-[200px] cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => toggleSort('descricao')}>
                <div className="flex items-center">Descrição <SortIcon field="descricao" /></div>
              </th>
              <th className="px-4 py-3 min-w-[140px] cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => toggleSort('tipo')}>
                <div className="flex items-center">Tipo <SortIcon field="tipo" /></div>
              </th>
              <th className="px-4 py-3 min-w-[160px]">Valor</th>
              <th className="px-4 py-3 min-w-[200px]">Observação</th>
              <th className="px-4 py-3 min-w-[140px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedIncomes.map(income => (
              <tr key={income.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(income, 'data')}</td>
                <td className="px-4 py-2 break-words">{renderInputField(income, 'descricao')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(income, 'tipo')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(income, 'valor')}</td>
                <td className="px-4 py-2 break-words">{renderInputField(income, 'observacao')}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                   <div className="flex gap-2">
                     {editingId === income.id ? (
                        <button onClick={() => handleSave(income.id)} className="font-medium text-green-400 hover:underline text-xs">Salvar</button>
                     ) : (
                        <button onClick={() => handleEdit(income)} className="font-medium text-blue-400 hover:underline text-xs">Editar</button>
                     )}
                     <button onClick={() => handleDeleteIncome(income.id)} className="font-medium text-red-400 hover:underline text-xs">Excluir</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeTable;
