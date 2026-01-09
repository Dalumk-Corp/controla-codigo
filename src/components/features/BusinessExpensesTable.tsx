
import React, { useState, useEffect, useMemo } from 'react';
import { BusinessExpense, Currency, BusinessMonthlyExpense } from '../../types';
import { BUSINESS_EXPENSE_CATEGORIES, PAYMENT_METHODS, BUSINESS_EXPENSE_TYPES, CURRENCIES } from '../../constants';

interface BusinessExpensesTableProps {
  expenses: BusinessExpense[];
  setExpenses: React.Dispatch<React.SetStateAction<BusinessExpense[]>>;
}

type SortField = 'data' | 'descricao' | 'categoria';
type SortOrder = 'asc' | 'desc';

const BusinessExpensesTable: React.FC<BusinessExpensesTableProps> = ({ expenses, setExpenses }) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>(() => {
    const savedCustom = localStorage.getItem('custom_business_categories');
    const custom = savedCustom ? JSON.parse(savedCustom) : [];
    return Array.from(new Set([...BUSINESS_EXPENSE_CATEGORIES, ...custom]));
  });

  const [sortField, setSortField] = useState<SortField>('data');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [newExpense, setNewExpense] = useState<Omit<BusinessExpense, 'id'>>({
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    valor: "" as any,
    currency: 'USD',
    categoria: availableCategories[0],
    formaDePagamento: PAYMENT_METHODS[0],
    tipoDeGasto: 'Fixo',
    observacao: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentExpense, setCurrentExpense] = useState<BusinessExpense | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const customOnly = availableCategories.filter(c => !BUSINESS_EXPENSE_CATEGORIES.includes(c));
    localStorage.setItem('custom_business_categories', JSON.stringify(customOnly));
  }, [availableCategories]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
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
  }, [expenses, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const openCategoryModal = () => {
    setNewCategoryName('');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (newCategoryName && newCategoryName.trim() !== "") {
      const formatted = newCategoryName.trim();
      const exists = availableCategories.some(c => c.toLowerCase() === formatted.toLowerCase());

      if (!exists) {
        setAvailableCategories(prev => [...prev, formatted]);
        setNewExpense(prev => ({ ...prev, categoria: formatted }));
        setIsCategoryModalOpen(false);
      } else {
        alert("Esta categoria já existe.");
        const existing = availableCategories.find(c => c.toLowerCase() === formatted.toLowerCase());
        if (existing) {
             setNewExpense(prev => ({ ...prev, categoria: existing }));
             setIsCategoryModalOpen(false);
        }
      }
    }
  };

  const formatCurrencyValue = (value: number, currency: Currency) => {
    const locale = (currency === 'USD' || currency === 'CAD') ? 'en-US' : 'pt-BR';
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
  };

  const syncWithMonthlyExpenses = (expense: BusinessExpense) => {
    if (expense.tipoDeGasto === 'Fixo') {
      const savedMonthly = localStorage.getItem('businessMonthlyExpenses');
      const monthlyList: BusinessMonthlyExpense[] = savedMonthly ? JSON.parse(savedMonthly) : [];
      const exists = monthlyList.some(m => m.descricao.trim().toLowerCase() === expense.descricao.trim().toLowerCase());
      if (!exists) {
        const dayOfDate = expense.data.split('-')[2];
        const newMonthlyEntry: BusinessMonthlyExpense = {
          id: crypto.randomUUID(),
          descricao: expense.descricao,
          valorMedio: expense.valor,
          currency: expense.currency,
          tipo: 'Fixa',
          limitePretendido: expense.valor,
          vencimento: dayOfDate,
          recorrencia: 'Mensal'
        };
        localStorage.setItem('businessMonthlyExpenses', JSON.stringify([...monthlyList, newMonthlyEntry]));
      }
    }
  };

  const handleAddExpense = () => {
    const numericValue = parseFloat(newExpense.valor as any);
    if (!newExpense.descricao || isNaN(numericValue) || numericValue <= 0) {
      alert('Preencha o serviço/produto e um valor maior que zero.');
      return;
    }

    const expenseToAdd = { ...newExpense, valor: numericValue, id: crypto.randomUUID() };
    setExpenses([...expenses, expenseToAdd as BusinessExpense]);

    // Auto-save to Monthly Business Expenses if Fixed
    syncWithMonthlyExpenses(expenseToAdd as BusinessExpense);

    setNewExpense({
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      valor: "" as any,
      currency: 'USD',
      categoria: availableCategories[0],
      formaDePagamento: PAYMENT_METHODS[0],
      tipoDeGasto: 'Fixo',
      observacao: '',
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };
    
  const handleEdit = (expense: BusinessExpense) => {
    setEditingId(expense.id);
    setCurrentExpense({ ...expense });
  };
    
  const handleSave = (id: string) => {
    if (currentExpense) {
      // Sync with monthly expenses if it changed to Fixed or values changed
      syncWithMonthlyExpenses(currentExpense);
      setExpenses(expenses.map(exp => (exp.id === id ? currentExpense : exp)));
      setEditingId(null);
      setCurrentExpense(null);
    }
  };

  const handleEditChange = (field: keyof BusinessExpense, value: string | number) => {
    if (currentExpense) {
      setCurrentExpense({ ...currentExpense, [field]: value });
    }
  };

  const renderInputField = (expense: BusinessExpense, field: keyof BusinessExpense) => {
    const isEditing = editingId === expense.id;
    const value = isEditing && currentExpense ? currentExpense[field] : expense[field];

    if (!isEditing) {
      if (field === 'valor') {
        return formatCurrencyValue(expense.valor, expense.currency);
      }
      return <span className="px-2 py-1">{value || '-'}</span>;
    }

    if (currentExpense) {
      switch (field) {
        case 'data':
          return <input type="date" value={currentExpense.data} onChange={(e) => handleEditChange('data', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        case 'descricao':
          return <input type="text" value={currentExpense.descricao} onChange={(e) => handleEditChange('descricao', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        case 'valor':
          return (
             <div className="flex gap-1">
                <input type="number" step="0.01" value={currentExpense.valor || ""} onChange={(e) => handleEditChange('valor', parseFloat(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-2/3" />
                <select value={currentExpense.currency} onChange={(e) => handleEditChange('currency', e.target.value)} className="bg-slate-700 p-1 rounded w-1/3">
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          );
        case 'categoria':
          return (
             <select value={currentExpense.categoria} onChange={(e) => handleEditChange('categoria', e.target.value)} className="bg-slate-700 p-1 rounded w-full">
                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          );
        case 'formaDePagamento':
          return <select value={currentExpense.formaDePagamento} onChange={(e) => handleEditChange('formaDePagamento', e.target.value)} className="bg-slate-700 p-1 rounded w-full">{PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}</select>;
        case 'tipoDeGasto':
          return <select value={currentExpense.tipoDeGasto} onChange={(e) => handleEditChange('tipoDeGasto', e.target.value as any)} className="bg-slate-700 p-1 rounded w-full">{BUSINESS_EXPENSE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}</select>;
        case 'observacao':
          return <input type="text" value={currentExpense.observacao || ''} onChange={(e) => handleEditChange('observacao', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
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
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Adicionar Nova Saída</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 p-4 border border-slate-700 rounded-lg">
        <input type="date" value={newExpense.data} onChange={e => setNewExpense({ ...newExpense, data: e.target.value })} className="bg-slate-700 p-2 rounded" />
        <input type="text" placeholder="Serviço/Produto" value={newExpense.descricao} onChange={e => setNewExpense({ ...newExpense, descricao: e.target.value })} className="bg-slate-700 p-2 rounded" />
        <div className="flex gap-2">
            <input type="number" step="0.01" placeholder="Valor" value={newExpense.valor} onChange={e => setNewExpense({ ...newExpense, valor: e.target.value as any })} className="bg-slate-700 p-2 rounded w-2/3" />
            <select value={newExpense.currency} onChange={e => setNewExpense({ ...newExpense, currency: e.target.value as Currency })} className="bg-slate-700 p-2 rounded w-1/3">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
        <div className="flex gap-2">
            <select value={newExpense.categoria} onChange={e => setNewExpense({ ...newExpense, categoria: e.target.value })} className="bg-slate-700 p-2 rounded w-full">
                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="button" onClick={openCategoryModal} title="Adicionar nova categoria" className="bg-slate-600 hover:bg-slate-500 text-white px-3 rounded font-bold">+</button>
        </div>
        <select value={newExpense.formaDePagamento} onChange={e => setNewExpense({ ...newExpense, formaDePagamento: e.target.value })} className="bg-slate-700 p-2 rounded">{PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}</select>
        <select value={newExpense.tipoDeGasto} onChange={e => setNewExpense({ ...newExpense, tipoDeGasto: e.target.value as any })} className="bg-slate-700 p-2 rounded">{BUSINESS_EXPENSE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}</select>
        <input type="text" placeholder="Observação (Opcional)" value={newExpense.observacao} onChange={e => setNewExpense({ ...newExpense, observacao: e.target.value })} className="bg-slate-700 p-2 rounded lg:col-span-2" />
        <button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors col-span-full">Adicionar Saída</button>
      </div>

      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Saídas Registradas</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700">
            <tr>
              <th className="px-4 py-3 min-w-[120px] cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => toggleSort('data')}>
                <div className="flex items-center">Data <SortIcon field="data" /></div>
              </th>
              <th className="px-4 py-3 min-w-[200px] cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => toggleSort('descricao')}>
                <div className="flex items-center">Serviço/Produto <SortIcon field="descricao" /></div>
              </th>
              <th className="px-4 py-3 min-w-[160px]">Valor</th>
              <th className="px-4 py-3 min-w-[160px] cursor-pointer hover:bg-slate-600 transition-colors" onClick={() => toggleSort('categoria')}>
                <div className="flex items-center">Categoria <SortIcon field="categoria" /></div>
              </th>
              <th className="px-4 py-3 min-w-[140px]">Pagamento</th>
              <th className="px-4 py-3 min-w-[140px]">Tipo de Gasto</th>
              <th className="px-4 py-3 min-w-[200px]">Observação</th>
              <th className="px-4 py-3 min-w-[140px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map(expense => (
              <tr key={expense.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'data')}</td>
                <td className="px-4 py-2 break-words">{renderInputField(expense, 'descricao')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'valor')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'categoria')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'formaDePagamento')}</td>
                <td className="px-4 py-2 whitespace-nowrap">{renderInputField(expense, 'tipoDeGasto')}</td>
                <td className="px-4 py-2 break-words">{renderInputField(expense, 'observacao')}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                   <div className="flex gap-2">
                     {editingId === expense.id ? (
                        <button onClick={() => handleSave(expense.id)} className="font-medium text-green-400 hover:underline text-xs">Salvar</button>
                     ) : (
                        <button onClick={() => handleEdit(expense)} className="font-medium text-blue-400 hover:underline text-xs">Editar</button>
                     )}
                     <button onClick={() => handleDeleteExpense(expense.id)} className="font-medium text-red-400 hover:underline text-xs">Excluir</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl w-full max-w-md animate-slide-up">
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Nova Categoria</h3>
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da categoria" className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 mb-6 focus:ring-2 focus:ring-blue-500 focus:outline-none" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') handleSaveCategory(); }} />
                <div className="flex justify-end gap-3">
                    <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">Cancelar</button>
                    <button onClick={handleSaveCategory} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">Adicionar</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BusinessExpensesTable;
