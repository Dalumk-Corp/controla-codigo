
import React, { useState, useMemo } from 'react';
import { MonthlyExpense, Currency } from '../../types';
import { CURRENCIES, TIPO_DESPESA_MENSAL, RECORRENCIA_OPTIONS } from '../../constants';

interface DespesasMensaisTableProps {
  expenses: MonthlyExpense[];
  setExpenses: React.Dispatch<React.SetStateAction<MonthlyExpense[]>>;
}

const DespesasMensaisTable: React.FC<DespesasMensaisTableProps> = ({ expenses, setExpenses }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentExpense, setCurrentExpense] = useState<MonthlyExpense | null>(null);
  const [newDescricao, setNewDescricao] = useState('');

  const totals = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      acc.valorMedio += exp.valorMedio || 0;
      acc.limitePretendido += exp.limitePretendido || 0;
      return acc;
    }, { valorMedio: 0, limitePretendido: 0 });
  }, [expenses]);

  const handleAddRow = () => {
    if (!newDescricao.trim()) {
      alert('A descrição não pode estar vazia.');
      return;
    }
    const newRow: MonthlyExpense = {
      id: crypto.randomUUID(),
      descricao: newDescricao.trim(),
      valorMedio: 0,
      currency: 'USD',
      tipo: 'Variável',
      limitePretendido: 0,
      percentualIdeal: 0,
      vencimento: '',
      recorrencia: 'Mensal',
    };
    setExpenses([...expenses, newRow]);
    setNewDescricao('');
  };

  const handleDeleteRow = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta linha?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const handleEdit = (expense: MonthlyExpense) => {
    setEditingId(expense.id);
    setCurrentExpense({ ...expense });
  };

  const handleSave = (id: string) => {
    if (currentExpense) {
      setExpenses(expenses.map(exp => (exp.id === id ? currentExpense : exp)));
      setEditingId(null);
      setCurrentExpense(null);
    }
  };

  const handleEditChange = (field: keyof MonthlyExpense, value: string | number) => {
    if (currentExpense) {
      setCurrentExpense({ ...currentExpense, [field]: value });
    }
  };

  const formatCurrency = (value: number, currency: Currency) => {
    const locale = (currency === 'USD' || currency === 'CAD') ? 'en-US' : 'pt-BR';
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
  };

  const renderInputField = (expense: MonthlyExpense, field: keyof MonthlyExpense) => {
    const isEditing = editingId === expense.id;
    const value = isEditing && currentExpense ? currentExpense[field] : expense[field];

    if (!isEditing) {
      if (field === 'valorMedio' || field === 'limitePretendido') {
         if (expense[field] > 0) {
            return formatCurrency(expense[field] as number, expense.currency);
         }
         return '-';
      }
      if (field === 'percentualIdeal') {
          return value ? `${value}%` : '-';
      }
      return <span className="px-2 py-1">{value || '-'}</span>;
    }

    if (currentExpense) {
        switch (field) {
            case 'descricao':
                return <input type="text" value={currentExpense.descricao} onChange={(e) => handleEditChange('descricao', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
            case 'valorMedio':
            case 'limitePretendido':
                 return (
                    <div className="flex gap-1">
                        <input type="number" step="0.01" value={currentExpense[field] as number || ''} onChange={(e) => handleEditChange(field, parseFloat(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-2/3" />
                        <select value={currentExpense.currency} onChange={(e) => handleEditChange('currency', e.target.value)} className="bg-slate-700 p-1 rounded w-1/3 text-xs">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                );
            case 'percentualIdeal':
                return <input type="number" step="1" min="0" max="100" value={currentExpense.percentualIdeal || ''} onChange={(e) => handleEditChange('percentualIdeal', parseInt(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-full" />;
            case 'tipo':
                return <select value={currentExpense.tipo} onChange={(e) => handleEditChange('tipo', e.target.value)} className="bg-slate-700 p-1 rounded w-full">{TIPO_DESPESA_MENSAL.map(t => <option key={t} value={t}>{t}</option>)}</select>;
            case 'vencimento':
                return <input type="text" placeholder="DD ou DD/MM" value={currentExpense.vencimento} onChange={(e) => handleEditChange('vencimento', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
            case 'recorrencia':
                 return <select value={currentExpense.recorrencia} onChange={(e) => handleEditChange('recorrencia', e.target.value)} className="bg-slate-700 p-1 rounded w-full">{RECORRENCIA_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}</select>;
            default: return null;
        }
    }
    return null;
  };

  return (
    <div>
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700">
            <tr>
              <th className="px-4 py-3 min-w-[180px]">Descrição</th>
              <th className="px-4 py-3 min-w-[150px]">Valor Médio</th>
              <th className="px-4 py-3 min-w-[100px]">Tipo</th>
              <th className="px-4 py-3 min-w-[150px]">Limite Pretendido</th>
              <th className="px-4 py-3 min-w-[100px]">Ideal (%)</th>
              <th className="px-4 py-3 min-w-[100px]">Vencimento</th>
              <th className="px-4 py-3 min-w-[120px]">Recorrência</th>
              <th className="px-4 py-3 min-w-[120px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-2 font-medium break-words">{renderInputField(expense, 'descricao')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'valorMedio')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'tipo')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'limitePretendido')}</td>
                <td className="px-4 py-2 whitespace-nowrap text-blue-400 font-bold">{renderInputField(expense, 'percentualIdeal')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'vencimento')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'recorrencia')}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                   <div className="flex gap-2">
                     {editingId === expense.id ? (
                        <button onClick={() => handleSave(expense.id)} className="font-bold text-green-400 hover:text-green-300">Salvar</button>
                     ) : (
                        <button onClick={() => handleEdit(expense)} className="font-bold text-blue-400 hover:text-blue-300">Editar</button>
                     )}
                     <button onClick={() => handleDeleteRow(expense.id)} className="font-bold text-red-400 hover:text-red-300">Excluir</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
          {expenses.length > 0 && (
            <tfoot className="bg-slate-900/50 font-bold border-t-2 border-slate-600">
                <tr>
                    <td className="px-4 py-3 text-white uppercase text-xs">Totais</td>
                    <td className="px-4 py-3 text-green-400 whitespace-nowrap">
                        {formatCurrency(totals.valorMedio, 'USD')}
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-blue-400 whitespace-nowrap">
                        {formatCurrency(totals.limitePretendido, 'USD')}
                    </td>
                    <td colSpan={4}></td>
                </tr>
            </tfoot>
          )}
        </table>
      </div>
      <div className="mt-6 flex items-center gap-2 p-4 border-t border-slate-700">
        <input 
          type="text" 
          value={newDescricao}
          onChange={(e) => setNewDescricao(e.target.value)}
          placeholder="Descrição da nova despesa" 
          className="flex-grow bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button onClick={handleAddRow} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          Adicionar Linha
        </button>
      </div>
    </div>
  );
};

export default DespesasMensaisTable;