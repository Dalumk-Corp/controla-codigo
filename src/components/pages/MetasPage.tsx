
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import Card from '../ui/Card';
import { Meta, MetaStep } from '../../types';
import SaveAndShare from '../features/SaveAndShare';

const defaultMetas: Meta[] = [
    { id: 'reserva-emergencia', name: 'Reserva de Emergência', icon: 'shield', saldo: 0 },
    { id: crypto.randomUUID(), name: 'Meta', icon: 'target', saldo: 0 },
    { id: crypto.randomUUID(), name: 'Meta', icon: 'target', saldo: 0 },
    { id: crypto.randomUUID(), name: 'Meta', icon: 'target', saldo: 0 },
];

const MetaIcon: React.FC<{ icon: Meta['icon'], className?: string }> = ({ icon, className = "h-12 w-12" }) => {
    const icons: Record<Meta['icon'], React.ReactElement> = {
        shield: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606z" /></svg>,
        target: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
        star: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
        rocket: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        home: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        car: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" /></svg>,
    };
    return icons[icon] || icons.target;
};

const MetasPage: React.FC = () => {
  const [metas, setMetas] = useState<Meta[]>(() => {
    const savedMetas = localStorage.getItem('metas');
    return savedMetas ? JSON.parse(savedMetas) : defaultMetas;
  });
  const [editingMeta, setEditingMeta] = useState<{ id: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('metas', JSON.stringify(metas));
  }, [metas]);

  useEffect(() => {
    if (editingMeta && inputRef.current) {
        inputRef.current.focus();
    }
  }, [editingMeta]);

  const dataForExport = useMemo(() => {
    const allSteps: { [key: string]: MetaStep[] } = {};
    metas.forEach(meta => {
      const stepsData = localStorage.getItem(`meta-steps-${meta.id}`);
      if (stepsData) {
        try {
            allSteps[meta.id] = JSON.parse(stepsData);
        } catch(e) {
            console.error(`Error parsing steps for meta ${meta.id}`, e);
        }
      }
    });
    return { metas, allSteps };
  }, [metas]);

  const handleClearMetasData = () => {
      metas.forEach(meta => {
          localStorage.removeItem(`meta-steps-${meta.id}`);
      });
      setMetas(defaultMetas); // Reset to default
  };

  const handleStartEditing = (meta: Meta) => {
    setEditingMeta({ id: meta.id, name: meta.name });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingMeta) {
        setEditingMeta({ ...editingMeta, name: e.target.value });
    }
  };

  const handleSaveName = () => {
    if (editingMeta) {
        setMetas(metas.map(m => m.id === editingMeta.id ? { ...m, name: editingMeta.name } : m));
        setEditingMeta(null);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') setEditingMeta(null);
  }

  const handleAddMeta = () => {
    const newMeta: Meta = {
        id: crypto.randomUUID(),
        name: 'Nova Meta',
        icon: 'star',
        saldo: 0
    };
    setMetas([...metas, newMeta]);
  };
  
  const handleDeleteMeta = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta? Todas as informações dela serão perdidas.')) {
        setMetas(metas.filter(m => m.id !== id));
        localStorage.removeItem(`meta-steps-${id}`);
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <Layout
      pageTitle="Metas Financeiras"
      pageDescription="Defina seus objetivos e acompanhe seu progresso para alcançá-los."
    >
      <div className="flex justify-end mb-6">
        <SaveAndShare
          data={dataForExport}
          onClearData={handleClearMetasData}
          fileNamePrefix="metas-financeiras"
          period="annually"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metas.map(meta => (
            <div key={meta.id} className="relative group">
                <Link to={`/meu-dinheiro/metas/${meta.id}`}>
                    <Card className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/100 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="text-blue-400">
                            <MetaIcon icon={meta.icon} />
                        </div>
                        {editingMeta?.id === meta.id ? (
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={editingMeta.name}
                                onChange={handleNameChange}
                                onBlur={handleSaveName}
                                onKeyDown={handleKeyDown}
                                className="bg-slate-700 text-xl font-semibold text-center text-slate-100 rounded-md p-1 w-full"
                                onClick={(e) => e.preventDefault()}
                            />
                        ) : (
                            <div className="space-y-1">
                                <h2 
                                    className="text-xl font-semibold text-slate-100 min-h-[40px] flex items-center justify-center"
                                    onClick={(e) => { e.preventDefault(); handleStartEditing(meta); }}
                                >
                                    {meta.name}
                                </h2>
                                <p className="text-green-400 font-bold text-sm">
                                    {formatCurrency(meta.saldo || 0)}
                                </p>
                            </div>
                        )}
                    </Card>
                </Link>
                <button 
                    onClick={() => handleDeleteMeta(meta.id)}
                    className="absolute top-2 right-2 p-1 bg-slate-700/50 rounded-full text-slate-400 hover:bg-red-500/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Excluir meta"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        ))}
        <Card 
            onClick={handleAddMeta}
            className="p-8 h-full cursor-pointer bg-slate-800/80 backdrop-blur-sm border border-dashed border-slate-600 hover:border-green-500/60 hover:bg-slate-800/100 flex flex-col items-center justify-center text-center space-y-4 text-slate-400 hover:text-green-400 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 className="text-xl font-semibold">Adicionar Nova Meta</h2>
        </Card>
      </div>

      <div className="mt-12 flex justify-center">
        <Link to="/meu-dinheiro" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Voltar ao Menu
        </Link>
      </div>
    </Layout>
  );
};

export default MetasPage;
