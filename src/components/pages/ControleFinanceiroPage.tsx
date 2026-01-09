
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import { Expense, Income, MonthlyExpense, SavedReport } from '../../types';
import ExpensesTable from '../features/ExpensesTable';
import IncomeTable from '../features/IncomeTable';
import Interactive3DPieChart from '../features/Interactive3DPieChart';
import ClassificationChart from '../features/ClassificationChart';
import { EXPENSE_CATEGORIES, CLASSIFICATIONS } from '../../constants';
import SaveAndShare from '../features/SaveAndShare';
import ReceiptAnalysis from '../features/GeminiAnalysis';
import DashboardBalance from '../features/DashboardBalance';
import HistoryList from '../features/HistoryList';

const ControleFinanceiroPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saidas' | 'entradas' | 'relatorio' | 'analise' | 'historico'>('saidas');

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [incomes, setIncomes] = useState<Income[]>(() => {
    const savedIncomes = localStorage.getItem('incomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [monthlyExpenses] = useState<MonthlyExpense[]>(() => {
    const savedData = localStorage.getItem('monthlyExpenses');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [history] = useState<SavedReport[]>(() => {
    const savedHistory = localStorage.getItem('personal_finance_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  // Data for Bar Chart (Classifications)
  const classificationChartData = useMemo(() => {
    const classTotals: { [key: string]: number } = {};
    CLASSIFICATIONS.forEach(cls => classTotals[cls] = 0);

    expenses.forEach(expense => {
        const cls = expense.classificacao || 'Essencial'; 
        classTotals[cls] = (classTotals[cls] || 0) + expense.valor;
    });

    return CLASSIFICATIONS.map(name => ({
        name,
        value: classTotals[name] || 0
    }));
  }, [expenses]);

  const combinedReportData = useMemo(() => {
      const categoryTotals: { [key: string]: number } = {};
      EXPENSE_CATEGORIES.forEach(cat => categoryTotals[cat] = 0);
      expenses.forEach(e => categoryTotals[e.categoria] = (categoryTotals[e.categoria] || 0) + e.valor);
      
      return {
          "Resumo_Entradas": incomes,
          "Resumo_Saidas": expenses,
          "Planejamento_Mensal": monthlyExpenses,
          "Gastos_Por_Categoria": Object.entries(categoryTotals).map(([name, value]) => ({ name, value })).filter(i => i.value > 0),
          "Perfil_De_Gastos": classificationChartData
      };
  }, [incomes, expenses, monthlyExpenses, classificationChartData]);

  const handleClearData = () => {
    setExpenses([]);
    setIncomes([]);
  };

  const handleSaveExpenseFromAnalysis = (expenseData: any) => {
      setExpenses(prev => [...prev, expenseData]);
      setActiveTab('saidas'); 
  };

  const TabButton: React.FC<{tabId: 'saidas' | 'entradas' | 'relatorio' | 'analise' | 'historico', children: React.ReactNode}> = ({ tabId, children }) => (
     <button
        onClick={() => setActiveTab(tabId)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === tabId
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-700'
        }`}
      >
        {children}
    </button>
  );

  return (
    <Layout
      pageTitle="Controle Financeiro"
      pageDescription="Gerencie suas entradas e saídas e visualize relatórios detalhados."
    >
      <div className="max-w-7xl mx-auto">
        <DashboardBalance 
          incomes={incomes} 
          expenses={expenses} 
          colorAccent="blue" 
          title="Saldo Pessoal"
        />

        <div className="mb-6 p-2 bg-slate-800 border border-slate-700 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
           <div className="flex items-center justify-center space-x-2 flex-wrap">
             <TabButton tabId="saidas">Saídas</TabButton>
             <TabButton tabId="entradas">Entradas</TabButton>
             <TabButton tabId="relatorio">Relatório</TabButton>
             <TabButton tabId="analise">Recibos (IA)</TabButton>
             <TabButton tabId="historico">Histórico</TabButton>
           </div>
           
           <div className="flex items-center gap-3">
               {activeTab !== 'historico' && (
                   <SaveAndShare
                      data={combinedReportData}
                      onClearData={handleClearData}
                      fileNamePrefix="controle-financeiro-pessoal"
                      period="monthly"
                      historyKey="personal_finance_history"
                   />
               )}
           </div>
        </div>

        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 min-h-[500px] shadow-xl">
          {activeTab === 'saidas' && (
             <ExpensesTable expenses={expenses} setExpenses={setExpenses} />
          )}
          {activeTab === 'entradas' && <IncomeTable incomes={incomes} setIncomes={setIncomes} />}
          {activeTab === 'relatorio' && (
            <div className="space-y-12 animate-fade-in">
              <div>
                <h2 className="text-2xl font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2">Diagnóstico de Despesas</h2>
                {expenses.length > 0 ? (
                   <Interactive3DPieChart 
                      expenses={expenses} 
                      monthlyExpenses={monthlyExpenses}
                      history={history}
                   />
                ) : (
                  <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <p className="text-slate-400">Não há dados de despesas para exibir o diagnóstico.</p>
                  </div>
                )}
              </div>

              {expenses.length > 0 && (
                  <div>
                     <h2 className="text-2xl font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2">Perfil de Gastos</h2>
                     <ClassificationChart data={classificationChartData} />
                  </div>
              )}
            </div>
          )}
           {activeTab === 'analise' && (
             <ReceiptAnalysis 
                onSave={handleSaveExpenseFromAnalysis} 
                context="personal"
             />
           )}
           {activeTab === 'historico' && (
               <HistoryList historyKey="personal_finance_history" />
           )}
        </div>

        <div className="mt-12 flex justify-center">
            <Link to="/meu-dinheiro" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar ao Menu
            </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ControleFinanceiroPage;
