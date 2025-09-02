import { Preferences } from '@capacitor/preferences';
import { v4 as uuidv4 } from 'uuid';

// Goals Functions
export const getGoals = async () => {
  const { value } = await Preferences.get({ key: 'goals' });
  return value ? JSON.parse(value) : [];
};

export const addGoal = async (goal) => {
  const goals = await getGoals();
  const newGoal = { ...goal, _id: uuidv4(), currentAmount: 0, targetAmount: parseFloat(goal.targetAmount) };
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
  goals = goals.map((goal) => (goal._id === id ? { ...goal, ...formData, targetAmount: parseFloat(formData.targetAmount) } : goal));
  await Preferences.set({ key: 'goals', value: JSON.stringify(goals) });
  return goals.find(goal => goal._id === id);
};

export const updateGoalProgress = async (id, currentAmount) => {
  let goals = await getGoals();
  goals = goals.map((goal) => (goal._id === id ? { ...goal, currentAmount: parseFloat(currentAmount) } : goal));
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
    const newIncome = { ...income, _id: uuidv4(), amount: parseFloat(income.amount) };
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
    incomes = incomes.map((income) => (income._id === id ? { ...income, ...formData, amount: parseFloat(formData.amount) } : income));
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
    const newExpense = { ...expense, _id: uuidv4(), amount: parseFloat(expense.amount) };
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
    expenses = expenses.map((expense) => (expense._id === id ? { ...expense, ...formData, amount: parseFloat(formData.amount) } : expense));
    await Preferences.set({ key: 'expenses', value: JSON.stringify(expenses) });
    return expenses.find(expense => expense._id === id);
};

// Auth Functions
export const register = async (userData) => {
  const { email } = userData;
  const { value } = await Preferences.get({ key: 'users' });
  const users = value ? JSON.parse(value) : [];

  if (users.find(user => user.email === email)) {
    throw new Error('User already exists');
  }

  const newUser = { ...userData, _id: uuidv4() };
  users.push(newUser);
  await Preferences.set({ key: 'users', value: JSON.stringify(users) });
  
  const token = uuidv4();
  await Preferences.set({ key: 'token', value: token });
  await Preferences.set({ key: 'user', value: JSON.stringify(newUser) });

  return { token };
};

export const login = async (email, password) => {
  const { value } = await Preferences.get({ key: 'users' });
  const users = value ? JSON.parse(value) : [];
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const token = uuidv4();
  await Preferences.set({ key: 'token', value: token });
  await Preferences.set({ key: 'user', value: JSON.stringify(user) });
  
  return { token };
};

export const loadUser = async () => {
  const { value: token } = await Preferences.get({ key: 'token' });
  if (!token) throw new Error('No token');

  const { value: user } = await Preferences.get({ key: 'user' });
  if (!user) throw new Error('No user data');
  
  return JSON.parse(user);
};

export const logout = async () => {
  await Preferences.remove({ key: 'token' });
  await Preferences.remove({ key: 'user' });
};