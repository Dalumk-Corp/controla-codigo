
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import { Meta, MetaStep, Expense } from '../../types';
import MetaStepsTable from '../features/MetaStepsTable';
import DashboardBalance from '../features/DashboardBalance';

const MetaDetalhePage: React.FC = () => {
  const { metaId } = useParams<{ metaId: string }>();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [steps, setSteps] = useState<MetaStep[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (metaId) {
      // Load meta info
      const savedMetas = localStorage.getItem('metas');
      if (savedMetas) {
        const allMetas: Meta[] = JSON.parse(savedMetas);
        const currentMeta = allMetas.find(m => m.id === metaId);
        setMeta(currentMeta || null);
      }

      // Load steps for this specific meta
      const savedSteps = localStorage.getItem(`meta-steps-${metaId}`);
      if (savedSteps) {
        setSteps(JSON.parse(savedSteps));
      }

      // Load all expenses to calculate history/balance if needed
      const savedExpenses = localStorage.getItem('expenses');
      if (savedExpenses) {
        setAllExpenses(JSON.parse(savedExpenses));
      }
    }
  }, [metaId]);

  useEffect(() => {
    if (metaId) {
      localStorage.setItem(`meta-steps-${metaId}`, JSON.stringify(steps));
      
      // Update global meta balance as well
      const savedMetas = localStorage.getItem('metas');
      if (savedMetas && meta) {
          const allMetas: Meta[] = JSON.parse(savedMetas);
          const { balance } = metaTransactions;
          const updatedMetas = allMetas.map(m => m.id === metaId ? { ...m, saldo: balance } : m);
          localStorage.setItem('metas', JSON.stringify(updatedMetas));
      }
    }
  }, [steps, metaId, allExpenses]);

  // Filter expenses related to this meta to show in the DashboardBalance
  const metaTransactions = useMemo(() => {
    if (!meta) return { contributions: [], withdrawals: [], balance: 0 };
    
    // 1. Contributions from Main Finance tracker
    const extContributions = allExpenses.filter(e => 
      (e.categoria === 'Meta' || e.categoria === 'Reserva' || e.categoria === 'Investimento') && 
      e.descricao.trim().toLowerCase() === meta.name.trim().toLowerCase()
    );

    // 2. Contributions manually added in steps
    const stepContributions = steps
      .filter(s => s.tipo !== 'Retirada' && s.quanto > 0)
      .map(s => ({ valor: s.quanto }));

    const totalContributions = [...extContributions, ...stepContributions];

    // 3. Withdrawals manually added in steps
    const withdrawals = steps
      .filter(s => s.tipo === 'Retirada' && s.quanto > 0)
      .map(s => ({ valor: s.quanto }));

    const sumInc = totalContributions.reduce((acc, c) => acc + c.valor, 0);
    const sumExp = withdrawals.reduce((acc, w) => acc + w.valor, 0);

    return {
      contributions: totalContributions,
      withdrawals: withdrawals,
      balance: sumInc - sumExp
    };
  }, [allExpenses, meta, steps]);

  if (!meta) {
    return (
      <Layout pageTitle="Meta não encontrada" pageDescription="A meta que você está procurando não foi encontrada.">
        <div className="text-center">
            <p className="text-slate-400">Verifique o endereço ou volte para a página de metas.</p>
            <Link to="/meu-dinheiro/metas" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                Voltar para Metas
            </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle={meta.name}
      pageDescription="Detalhe os passos para alcançar seu objetivo e acompanhe o saldo acumulado."
    >
      <div className="max-w-7xl mx-auto">
        {/* Goal Balance Dashboard */}
        <DashboardBalance 
          incomes={metaTransactions.contributions} 
          expenses={metaTransactions.withdrawals} 
          colorAccent="blue" 
          title={`Saldo da Meta: ${meta.name}`}
        />

        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
          <MetaStepsTable
            steps={steps}
            setSteps={setSteps}
          />
        </div>

        <div className="mt-12 flex justify-center">
            <Link to="/meu-dinheiro/metas" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar às Metas
            </Link>
        </div>
      </div>
    </Layout>
  );
};

export default MetaDetalhePage;
