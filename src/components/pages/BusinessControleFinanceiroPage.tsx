
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../ui/Layout';
import { BusinessExpense, BusinessIncome, BusinessMonthlyExpense } from '../../types';
import BusinessExpensesTable from '../features/BusinessExpensesTable';
import BusinessIncomeTable from '../features/BusinessIncomeTable';
import FinancialBalance from '../features/FinancialBalance';
import SaveAndShare from '../features/SaveAndShare';
import ReceiptAnalysis from '../features/GeminiAnalysis';
import DashboardBalance from '../features/DashboardBalance';
import HistoryList from '../features/HistoryList';

const BusinessControleFinanceiroPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'entradas' | 'saidas' | 'relatorio' | 'analise' | 'historico'>('entradas');

  const [expenses, setExpenses] = useState<BusinessExpense[]>(() => {
    const savedExpenses = localStorage.getItem('businessExpenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [incomes, setIncomes] = useState<BusinessIncome[]>(() => {
    const savedIncomes = localStorage.getItem('businessIncomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [businessMonthlyExpenses] = useState<BusinessMonthlyExpense[]>(() => {
    const savedData = localStorage.getItem('businessMonthlyExpenses');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('businessExpenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('businessIncomes', JSON.stringify(incomes));
  }, [incomes]);

  // Logic for report summary data (duplicated from FinancialBalance for export purposes)
  const serviceReportData = useMemo(() => {
    const totalFixedExpenses = expenses
      .filter(e => e.tipoDeGasto === 'Fixo')
      .reduce((acc, curr) => acc + curr.valor, 0);

    const uniqueServices = Array.from(new Set(incomes.map(i => i.descricao.trim()))).filter(Boolean);
    const numberOfServices = uniqueServices.length;
    const fixedCostSharePerService = numberOfServices > 0 ? totalFixedExpenses / numberOfServices : 0;

    return uniqueServices.map(serviceName => {
      const serviceRevenue = incomes.filter(i => i.descricao.trim() === serviceName).reduce((acc, curr) => acc + curr.valor, 0);
      const directVariableCost = expenses.filter(e => e.tipoDeGasto === 'Variável' && e.descricao.trim() === serviceName).reduce((acc, curr) => acc + curr.valor, 0);
      const totalServiceCost = directVariableCost + fixedCostSharePerService;
      const profit = serviceRevenue - totalServiceCost;
      const margin = serviceRevenue > 0 ? (profit / serviceRevenue) * 100 : 0;

      return {
        Servico: serviceName,
        Faturamento: serviceRevenue,
        Custo_Variavel: directVariableCost,
        Rateio_Fixo: fixedCostSharePerService,
        Custo_Total: totalServiceCost,
        Lucro: profit,
        Margem_Percent: margin.toFixed(2) + '%'
      };
    });
  }, [incomes, expenses]);

  const combinedReportData = useMemo(() => {
      return {
          "Resumo_Entradas": incomes,
          "Resumo_Saidas": expenses,
          "Planejamento_Empresarial": businessMonthlyExpenses,
          "Analise_Por_Servico_Produto": serviceReportData
      };
  }, [incomes, expenses, businessMonthlyExpenses, serviceReportData]);

  const handleClearData = () => {
    // Ao arquivar zerar dados apenas do controle financeiro
    setIncomes([]);
    setExpenses([]);
  };

  const handleSaveExpenseFromAnalysis = (expenseData: any) => {
    setExpenses(prev => [...prev, expenseData]);
    setActiveTab('saidas'); 
  };

  const TabButton: React.FC<{tabId: 'entradas' | 'saidas' | 'relatorio' | 'analise' | 'historico', children: React.ReactNode}> = ({ tabId, children }) => (
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
      pageTitle="Controle Financeiro Empresarial"
      pageDescription="Gerencie as finanças do seu negócio e acompanhe o balanço financeiro."
    >
      <div className="max-w-7xl mx-auto">
        <DashboardBalance 
          incomes={incomes} 
          expenses={expenses} 
          colorAccent="green" 
          title="Saldo Empresarial"
        />

        <div className="mb-6 p-2 bg-slate-800 border border-slate-700 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
           <div className="flex items-center justify-center space-x-2 flex-wrap">
             <TabButton tabId="entradas">Entradas</TabButton>
             <TabButton tabId="saidas">Saídas</TabButton>
             <TabButton tabId="relatorio">Relatório</TabButton>
             <TabButton tabId="analise">Recibos (IA)</TabButton>
             <TabButton tabId="historico">Histórico</TabButton>
           </div>
           
           <div className="flex items-center gap-3">
               {activeTab !== 'historico' && (
                    <SaveAndShare
                        data={combinedReportData}
                        onClearData={handleClearData}
                        fileNamePrefix="business-financeiro"
                        period="monthly"
                        historyKey="business_finance_history"
                    />
               )}
           </div>
        </div>

        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 min-h-[500px] shadow-xl">
          {activeTab === 'entradas' && (
            <BusinessIncomeTable incomes={incomes} setIncomes={setIncomes} />
          )}
          {activeTab === 'saidas' && (
            <BusinessExpensesTable expenses={expenses} setExpenses={setExpenses} />
          )}
          {activeTab === 'relatorio' && (
            <FinancialBalance incomes={incomes} expenses={expenses} />
          )}
          {activeTab === 'analise' && (
             <ReceiptAnalysis 
                onSave={handleSaveExpenseFromAnalysis}
                context="business"
             />
          )}
          {activeTab === 'historico' && (
              <HistoryList historyKey="business_finance_history" />
          )}
        </div>

        <div className="mt-12 flex justify-center">
            <Link to="/business-money" className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-full transition-all shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar ao Menu
            </Link>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessControleFinanceiroPage;
