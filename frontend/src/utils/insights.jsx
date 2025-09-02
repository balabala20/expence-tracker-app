const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getEndOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const calculateTotal = (transactions) => {
  if (!transactions || transactions.length === 0) return 0;
  return transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
};

const filterByDateRange = (transactions, startDate, endDate) => {
  if (!transactions) return [];
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

const getTopExpenseCategory = (expenses) => {
  if (!expenses || expenses.length === 0) return null;
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (category) {
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(amount);
    }
    return acc;
  }, {});

  if (Object.keys(categoryTotals).length === 0) return null;

  return Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
};

export const generateInsights = (expenses, incomes, goals) => {
  const insights = [];
  const now = new Date();

  // Insight 1: Monthly spending comparison
  const startOfThisMonth = getStartOfMonth(now);
  const endOfThisMonth = getEndOfMonth(now);
  const startOfLastMonth = getStartOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const endOfLastMonth = getEndOfMonth(startOfLastMonth);

  const thisMonthExpenses = filterByDateRange(expenses, startOfThisMonth, endOfThisMonth);
  const lastMonthExpenses = filterByDateRange(expenses, startOfLastMonth, endOfLastMonth);

  const thisMonthTotal = calculateTotal(thisMonthExpenses);
  const lastMonthTotal = calculateTotal(lastMonthExpenses);

  if (lastMonthTotal > 0 && thisMonthTotal > 0) {
    const difference = thisMonthTotal - lastMonthTotal;
    if (difference > 1) { // Min difference to be notable
      insights.push(`You've spent ₹${difference.toFixed(2)} more this month compared to last month.`);
    } else if (difference < -1) {
      insights.push(`Great job! You've spent ₹${Math.abs(difference).toFixed(2)} less this month compared to last month.`);
    }
  }

  // Insight 2: Top spending category this week
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const thisWeekExpenses = filterByDateRange(expenses, startOfWeek, now);
  const topCategory = getTopExpenseCategory(thisWeekExpenses);

  if (topCategory) {
    insights.push(`Your biggest expense category this week was "${topCategory}".`);
  }
  
  // Insight 3: Goal progress
  if (goals && goals.length > 0) {
      goals.forEach(goal => {
          if (goal.targetAmount > 0 && goal.currentAmount < goal.targetAmount) {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              insights.push(`You're ${progress.toFixed(0)}% of the way to your "${goal.name}" goal!`);
          }
      });
  }

  // Insight 4: Income vs Expense
  const thisMonthIncome = calculateTotal(filterByDateRange(incomes, startOfThisMonth, endOfThisMonth));
  if (thisMonthTotal > thisMonthIncome && thisMonthIncome > 0) {
      insights.push(`Watch out! Your spending (₹${thisMonthTotal.toFixed(2)}) is higher than your income (₹${thisMonthIncome.toFixed(2)}) this month.`);
  }

  if (insights.length === 0) {
    return ["Add more transactions to see your smart spending insights!"];
  }

  return insights;
};