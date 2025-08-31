import { Preferences } from '@capacitor/preferences';
import { v4 as uuidv4 } from 'uuid';

// Goals Functions
export const getGoals = async () => {
  const { value } = await Preferences.get({ key: 'goals' });
  return value ? JSON.parse(value) : [];
};

export const addGoal = async (goal) => {
  const goals = await getGoals();
  const newGoal = { ...goal, _id: uuidv4(), currentAmount: 0 };
  await Preferences.set({ key: 'goals', value: JSON.stringify([...goals, newGoal]) });
  return newGoal;
};

export const deleteGoal = async (id) => {
  let goals = await getGoals();
  goals = goals.filter((goal) => goal._id !== id);
  await Preferences.set({ key: 'goals', value: JSON.stringify(goals) });
  return id;
};

export const updateGoalDetails = async (id, formData) => {
  let goals = await getGoals();
  goals = goals.map((goal) => (goal._id === id ? { ...goal, ...formData } : goal));
  await Preferences.set({ key: 'goals', value: JSON.stringify(goals) });
  return goals.find(goal => goal._id === id);
};

export const updateGoalProgress = async (id, currentAmount) => {
  let goals = await getGoals();
  goals = goals.map((goal) => (goal._id === id ? { ...goal, currentAmount } : goal));
  await Preferences.set({ key: 'goals', value: JSON.stringify(goals) });
  return goals.find(goal => goal._id === id);
};

// Income Functions
export const getIncomes = async () => {
    const { value } = await Preferences.get({ key: 'incomes' });
    return value ? JSON.parse(value) : [];
};

export const addIncome = async (income) => {
    const incomes = await getIncomes();
    const newIncome = { ...income, _id: uuidv4() };
    await Preferences.set({ key: 'incomes', value: JSON.stringify([...incomes, newIncome]) });
    return newIncome;
};

export const deleteIncome = async (id) => {
    let incomes = await getIncomes();
    incomes = incomes.filter((income) => income._id !== id);
    await Preferences.set({ key: 'incomes', value: JSON.stringify(incomes) });
    return id;
};

export const updateIncome = async (id, formData) => {
    let incomes = await getIncomes();
    incomes = incomes.map((income) => (income._id === id ? { ...income, ...formData } : income));
    await Preferences.set({ key: 'incomes', value: JSON.stringify(incomes) });
    return incomes.find(income => income._id === id);
};

// Expense Functions
export const getExpenses = async () => {
    const { value } = await Preferences.get({ key: 'expenses' });
    return value ? JSON.parse(value) : [];
};

export const addExpense = async (expense) => {
    const expenses = await getExpenses();
    const newExpense = { ...expense, _id: uuidv4() };
    await Preferences.set({ key: 'expenses', value: JSON.stringify([...expenses, newExpense]) });
    return newExpense;
};

export const deleteExpense = async (id) => {
    let expenses = await getExpenses();
    expenses = expenses.filter((expense) => expense._id !== id);
    await Preferences.set({ key: 'expenses', value: JSON.stringify(expenses) });
    return id;
};

export const updateExpense = async (id, formData) => {
    let expenses = await getExpenses();
    expenses = expenses.map((expense) => (expense._id === id ? { ...expense, ...formData } : expense));
    await Preferences.set({ key: 'expenses', value: JSON.stringify(expenses) });
    return expenses.find(expense => expense._id === id);
};