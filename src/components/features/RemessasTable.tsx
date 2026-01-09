
import React, { useState, useMemo } from 'react';
import { Remessa, Currency } from '../../types';
import { CURRENCIES } from '../../constants';

interface RemessasTableProps {
  remessas: Remessa[];
  setRemessas: React.Dispatch<React.SetStateAction<Remessa[]>>;
}

const RemessasTable: React.FC<RemessasTableProps> = ({ remessas, setRemessas }) => {
  const [newRemessa, setNewRemessa] = useState<Omit<Remessa, 'id'>>({
    data: new Date().toISOString().split('T')[0],
    valor: "" as any,
    currency: 'USD',
    destino: '',
    observacoes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentRemessa, setCurrentRemessa] = useState<Remessa | null>(null);

  const sortedRemessas = useMemo(() => {
    return [...remessas].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [remessas]);

  const formatCurrencyValue = (value: number, currency: Currency) => {
    if (currency === 'USD' || currency === 'CAD') {
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
    }
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
  };

  const handleAddRemessa = () => {
    const numericValue = parseFloat(newRemessa.valor as any);
    if (isNaN(numericValue) || numericValue <= 0 || !newRemessa.destino) {
      alert('Preencha o destino e um valor maior que zero.');
      return;
    }
    setRemessas([...remessas, { ...newRemessa, valor: numericValue, id: crypto.randomUUID() } as Remessa]);
    setNewRemessa({
      data: new Date().toISOString().split('T')[0],
      valor: "" as any,
      currency: 'USD',
      destino: '',
      observacoes: '',
    });
  };

  const handleDeleteRemessa = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta remessa?')) {
      setRemessas(remessas.filter(r => r.id !== id));
    }
  };
    
  const handleEdit = (remessa: Remessa) => {
    setEditingId(remessa.id);
    setCurrentRemessa({ ...remessa });
  };
    
  const handleSave = (id: string) => {
    if (currentRemessa) {
      setRemessas(remessas.map(r => (r.id === id ? currentRemessa : r)));
      setEditingId(null);
      setCurrentRemessa(null);
    }
  };

  const handleEditChange = (field: keyof Remessa, value: string | number) => {
    if (currentRemessa) {
      setCurrentRemessa({ ...currentRemessa, [field]: value });
    }
  };

  const groupedRemessas = useMemo(() => {
    const groups: { [key: string]: Remessa[] } = {};
    const sorted = [...sortedRemessas].reverse(); // Most recent first for grouping view
    
    sorted.forEach(remessa => {
      const date = new Date(remessa.data);
      if (isNaN(date.getTime())) return;
      
      const monthYear = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

      if (!groups[capitalizedMonthYear]) {
        groups[capitalizedMonthYear] = [];
      }
      groups[capitalizedMonthYear].push(remessa);
    });
    return groups;
  }, [sortedRemessas]);


  const renderInputField = (remessa: Remessa, field: keyof Remessa) => {
    const isEditing = editingId === remessa.id;
    const value = isEditing && currentRemessa ? currentRemessa[field] : remessa[field];

    if (!isEditing) {
      if (field === 'valor') {
        return formatCurrencyValue(remessa.valor, remessa.currency);
      }
      if (field === 'data') {
        return new Date(remessa.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      }
      return <span className="px-2 py-1">{value || '-'}</span>;
    }

    if (currentRemessa) {
      switch (field) {
        case 'data':
          return <input type="date" value={currentRemessa.data} onChange={(e) => handleEditChange('data', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        case 'valor':
          return (
             <div className="flex gap-1">
                <input type="number" step="0.01" value={currentRemessa.valor} onChange={(e) => handleEditChange('valor', parseFloat(e.target.value) || 0)} className="bg-slate-700 p-1 rounded w-2/3" />
                <select value={currentRemessa.currency} onChange={(e) => handleEditChange('currency', e.target.value)} className="bg-slate-700 p-1 rounded w-1/3">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          );
        case 'destino':
          return <input type="text" value={currentRemessa.destino} onChange={(e) => handleEditChange('destino', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        case 'observacoes':
          return <input type="text" value={currentRemessa.observacoes} onChange={(e) => handleEditChange('observacoes', e.target.value)} className="bg-slate-700 p-1 rounded w-full" />;
        default: return null;
      }
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Adicionar Nova Remessa</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 border border-slate-700 rounded-lg">
        <input type="date" value={newRemessa.data} onChange={e => setNewRemessa({ ...newRemessa, data: e.target.value })} className="bg-slate-700 p-2 rounded" />
        <div className="flex gap-2">
            <input type="number" step="0.01" placeholder="Valor" value={newRemessa.valor} onChange={e => setNewRemessa({ ...newRemessa, valor: e.target.value as any })} className="bg-slate-700 p-2 rounded w-2/3" />
            <select value={newRemessa.currency} onChange={e => setNewRemessa({ ...newRemessa, currency: e.target.value as Currency })} className="bg-slate-700 p-2 rounded w-1/3">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
        <input type="text" placeholder="Destino" value={newRemessa.destino} onChange={e => setNewRemessa({ ...newRemessa, destino: e.target.value })} className="bg-slate-700 p-2 rounded" />
        <input type="text" placeholder="Observações (Opcional)" value={newRemessa.observacoes} onChange={e => setNewRemessa({ ...newRemessa, observacoes: e.target.value })} className="bg-slate-700 p-2 rounded md:col-span-2 lg:col-span-1" />
        <button onClick={handleAddRemessa} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors col-span-full lg:col-span-1">Adicionar Remessa</button>
      </div>

      {Object.keys(groupedRemessas).length > 0 ? (
        Object.entries(groupedRemessas).map(([monthYear, remessasInMonth]: [string, Remessa[]]) => (
          <div key={monthYear} className="mb-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-3 px-2 py-1 bg-slate-700/50 rounded-md inline-block">{monthYear}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 min-w-[120px]">Data</th>
                    <th className="px-4 py-3 min-w-[160px]">Valor</th>
                    <th className="px-4 py-3 min-w-[200px]">Destino</th>
                    <th className="px-4 py-3 min-w-[200px]">Observações</th>
                    <th className="px-4 py-3 min-w-[140px]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {remessasInMonth.map(remessa => (
                    <tr key={remessa.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-2 whitespace-nowrap">{renderInputField(remessa, 'data')}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{renderInputField(remessa, 'valor')}</td>
                      <td className="px-4 py-2 break-words">{renderInputField(remessa, 'destino')}</td>
                      <td className="px-4 py-2 break-words">{renderInputField(remessa, 'observacoes')}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-2">
                          {editingId === remessa.id ? (
                              <button onClick={() => handleSave(remessa.id)} className="font-medium text-green-400 hover:underline text-xs">Salvar</button>
                          ) : (
                              <button onClick={() => handleEdit(remessa)} className="font-medium text-blue-400 hover:underline text-xs">Editar</button>
                          )}
                          <button onClick={() => handleDeleteRemessa(remessa.id)} className="font-medium text-red-400 hover:underline text-xs">Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
            <p className="text-slate-400">Nenhuma remessa registrada ainda.</p>
            <p className="text-slate-500 text-sm mt-2">Use o formulário acima para começar a adicionar suas remessas.</p>
        </div>
      )}
    </div>
  );
};

export default RemessasTable;
