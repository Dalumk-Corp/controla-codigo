
import React, { useMemo } from 'react';
import { BusinessIncome, BusinessExpense } from '../../types';
import Card from '../ui/Card';

interface FinancialBalanceProps {
  incomes: BusinessIncome[];
  expenses: BusinessExpense[];
}

const FinancialBalance: React.FC<FinancialBalanceProps> = ({ incomes, expenses }) => {
  // 1. Global Totals
  const totalIncomes = incomes.reduce((acc, income) => acc + income.valor, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.valor, 0);
  const balance = totalIncomes - totalExpenses;
  
  // Margem de lucro: faturamento menos gastos dividido pelo faturamento * 100 (para ser %)
  const globalMargin = totalIncomes > 0 ? (balance / totalIncomes) * 100 : 0;

  // 2. Service Analysis Logic
  const serviceReport = useMemo(() => {
    // A. Identify Fixed Costs
    const totalFixedExpenses = expenses
      .filter(e => e.tipoDeGasto === 'Fixo')
      .reduce((acc, curr) => acc + curr.valor, 0);

    // B. Identify Unique Services (based on Income descriptions)
    const uniqueServices = Array.from(new Set(incomes.map(i => i.descricao.trim()))).filter(Boolean);
    const numberOfServices = uniqueServices.length;

    // C. Calculate Share of Fixed Cost per Service
    const fixedCostSharePerService = numberOfServices > 0 ? totalFixedExpenses / numberOfServices : 0;

    // D. Build Report Rows
    return uniqueServices.map(serviceName => {
      // Revenue for this service
      const serviceRevenue = incomes
        .filter(i => i.descricao.trim() === serviceName)
        .reduce((acc, curr) => acc + curr.valor, 0);

      // Variable Cost specific to this service (matching description)
      const directVariableCost = expenses
        .filter(e => e.tipoDeGasto === 'Variável' && e.descricao.trim() === serviceName)
        .reduce((acc, curr) => acc + curr.valor, 0);

      // Total Cost = Direct Variable + Distributed Fixed
      const totalServiceCost = directVariableCost + fixedCostSharePerService;

      // Profit
      const profit = serviceRevenue - totalServiceCost;

      // Margin Calculation
      const margin = serviceRevenue > 0 ? (profit / serviceRevenue) * 100 : 0;

      return {
        name: serviceName,
        revenue: serviceRevenue,
        directCost: directVariableCost,
        fixedCostShare: fixedCostSharePerService,
        totalCost: totalServiceCost,
        profit: profit,
        margin: margin
      };
    });
  }, [incomes, expenses]);

  const getMarginRecommendation = (margin: number) => {
    if (margin < 30) {
      return {
        status: 'Alerta',
        color: 'text-red-400',
        borderColor: 'border-red-500/30',
        bgColor: 'bg-red-500/10',
        message: 'Sua margem de lucro está abaixo do ideal para negócios. Isso indica que você está gerando receita, mas está retendo pouco lucro.',
        detail: 'Sinal de alerta: seus custos podem estar altos demais ou seus preços abaixo do necessário.',
        recommendation: 'Recomendação: revise precificação, custos variáveis e tempo investido por serviço.'
      };
    } else if (margin >= 30 && margin <= 50) {
      return {
        status: 'Saudável',
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        bgColor: 'bg-yellow-500/10',
        message: 'Seu negócio está operando com uma margem saudável, mas ainda com espaço para evolução.',
        detail: 'Essa faixa mostra que o modelo funciona, porém ajustes estratégicos podem aumentar sua segurança financeira.',
        recommendation: 'Recomendação: otimizar processos, reduzir custos e revisar o posicionamento do preço pode elevar sua margem para um nível mais confortável.'
      };
    } else {
      return {
        status: 'Excelente',
        color: 'text-green-400',
        borderColor: 'border-green-500/30',
        bgColor: 'bg-green-500/10',
        message: 'Excelente! Sua margem de lucro está alta e indica que o negócio está eficiente e bem estruturado.',
        detail: 'Esse tipo de margem oferece estabilidade, espaço para reinvestimento e crescimento.',
        recommendation: 'Recomendação: continue monitorando custos e explore estratégias de expansão ou padronização para crescer mantendo a saúde financeira.'
      };
    }
  };

  const globalRecommendation = getMarginRecommendation(globalMargin);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (incomes.length === 0 && expenses.length === 0) {
    return (
        <div className="text-center py-10">
            <p className="text-slate-400">Não há dados de entradas ou saídas para exibir o balanço.</p>
            <p className="text-slate-500 text-sm mt-2">Adicione registros nas abas 'Entradas' e 'Saídas' para começar.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Global Overview Cards */}
        <div>
            <h2 className="text-2xl font-semibold text-slate-100 mb-6 text-center">Balanço Global</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="p-6 bg-slate-900/50 border border-slate-700 text-center shadow-lg">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Faturamento Total</h3>
                    <p className="text-3xl font-bold text-green-400 mt-2">{formatCurrency(totalIncomes)}</p>
                </Card>
                <Card className="p-6 bg-slate-900/50 border border-slate-700 text-center shadow-lg">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Gastos Totais</h3>
                    <p className="text-3xl font-bold text-red-400 mt-2">{formatCurrency(totalExpenses)}</p>
                </Card>
                <Card className={`p-6 bg-slate-900/50 border ${balance >= 0 ? 'border-green-500/50' : 'border-red-500/50'} text-center shadow-lg`}>
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{balance >= 0 ? 'Lucro Global' : 'Prejuízo Global'}</h3>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'} mt-2`}>{formatCurrency(balance)}</p>
                    <div className="mt-2 text-sm flex items-center justify-center gap-1">
                        <span className="text-slate-400">Margem: </span>
                        <span className={`font-bold ${globalMargin >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                             {formatPercentage(globalMargin)}
                        </span>
                    </div>
                </Card>
            </div>
        </div>

        {/* Global Recommendation Message */}
        {totalIncomes > 0 && (
          <div className={`max-w-5xl mx-auto p-6 rounded-xl border ${globalRecommendation.borderColor} ${globalRecommendation.bgColor} shadow-inner animate-slide-up`}>
             <div className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-full ${globalRecommendation.color} bg-white/5`}>
                   {globalMargin < 30 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   ) : globalMargin <= 50 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   )}
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${globalRecommendation.color} mb-1`}>{globalRecommendation.status}</h4>
                  <p className="text-slate-100 font-medium leading-relaxed">{globalRecommendation.message}</p>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed italic">{globalRecommendation.detail}</p>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-blue-300 font-semibold text-sm">{globalRecommendation.recommendation}</p>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Detailed Service Report */}
        {serviceReport.length > 0 && (
            <div className="pt-6 border-t border-slate-700/50">
                <h2 className="text-2xl font-semibold text-slate-100 mb-6 text-center">Análise por Serviço/Produto</h2>
                <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700 shadow-xl">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700">
                            <tr>
                                <th className="px-6 py-4">Serviço/Produto</th>
                                <th className="px-6 py-4 text-right">Faturamento</th>
                                <th className="px-6 py-4 text-right">Custo Variável</th>
                                <th className="px-6 py-4 text-right">Rateio Fixo</th>
                                <th className="px-6 py-4 text-right">Lucro Líquido</th>
                                <th className="px-6 py-4 text-right">Margem %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceReport.map((item, index) => {
                                const recommendation = getMarginRecommendation(item.margin);
                                return (
                                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50 group transition-colors">
                                      <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                      <td className="px-6 py-4 text-right text-green-400 font-medium">{formatCurrency(item.revenue)}</td>
                                      <td className="px-6 py-4 text-right text-red-300/80">- {formatCurrency(item.directCost)}</td>
                                      <td className="px-6 py-4 text-right text-orange-300/80">- {formatCurrency(item.fixedCostShare)}</td>
                                      <td className={`px-6 py-4 text-right font-bold ${item.profit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                                          {formatCurrency(item.profit)}
                                      </td>
                                      <td className={`px-6 py-4 text-right font-bold ${recommendation.color}`}>
                                          {formatPercentage(item.margin)}
                                      </td>
                                  </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 p-4 bg-slate-900/40 rounded-lg border border-slate-700/30 text-xs text-slate-500 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Rateio: Os Custos Fixos Totais ({formatCurrency(expenses.filter(e => e.tipoDeGasto === 'Fixo').reduce((a, b) => a + b.valor, 0))}) foram distribuídos igualmente entre os {serviceReport.length} serviços/produtos ativos.</span>
                </div>
            </div>
        )}
    </div>
  );
};

export default FinancialBalance;
