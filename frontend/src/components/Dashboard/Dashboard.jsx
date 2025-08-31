import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getIncomes } from '../../actions/income';
import { getExpenses } from '../../actions/expense';
import './Dashboard.css';
import ThemeToggleButton from '../Layout/ThemeToggleButton';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function to filter transactions by date range
const filterByDateRange = (transactions, days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });
};

const createPieChartData = (transactions, type) => {
    const dataMap = new Map();

    // Aggregate amounts for the same label (e.g., multiple "Groceries" expenses)
    transactions.forEach(t => {
        const label = type === 'income' ? t.source : t.name;
        const currentAmount = dataMap.get(label) || 0;
        dataMap.set(label, currentAmount + t.amount);
    });

    const labels = Array.from(dataMap.keys());
    const data = Array.from(dataMap.values());
    
    return {
        labels,
        datasets: [{
            data,
            backgroundColor: [
                '#7F56D9', '#12B76A', '#F04438', '#FDB022',
                '#00B8D9', '#FF4D4F', '#40A9FF', '#FAAD14',
                '#52C41A', '#F759AB'
            ],
            borderColor: '#FFFFFF',
            borderWidth: 2,
        }]
    };
};

const pieChartOptions = {
    plugins: {
        legend: { position: 'bottom' }
    },
    responsive: true,
    maintainAspectRatio: false
};

const Dashboard = ({ getIncomes, getExpenses, income, expense, toggleSidebar }) => {
    useEffect(() => {
        getIncomes();
        getExpenses();
    }, [getIncomes, getExpenses]);

    const totalIncome = income.incomes.reduce((acc, item) => (acc += item.amount), 0);
    const totalExpenses = expense.expenses.reduce((acc, item) => (acc += item.amount), 0);
    const totalBalance = totalIncome - totalExpenses;

    const recentTransactions = [...income.incomes, ...expense.expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    // Data for the main doughnut chart
    const doughnutChartData = {
        labels: ['Total Income', 'Total Expenses'],
        datasets: [{
            data: [totalIncome > 0 ? totalIncome : 1, totalExpenses > 0 ? totalExpenses : 1],
            backgroundColor: ['#12B76A', '#F04438'],
            borderColor: ['#FFFFFF'],
            borderWidth: 4,
            cutout: '80%',
        }],
    };
    const doughnutChartOptions = {
        plugins: { legend: { display: false } },
        maintainAspectRatio: false,
    };

    // Data for the analysis pie charts
    const weeklyIncomeData = createPieChartData(filterByDateRange(income.incomes, 7), 'income');
    const weeklyExpenseData = createPieChartData(filterByDateRange(expense.expenses, 7), 'expense');
    const monthlyIncomeData = createPieChartData(filterByDateRange(income.incomes, 30), 'income');
    const monthlyExpenseData = createPieChartData(filterByDateRange(expense.expenses, 30), 'expense');
    const sixtyDayIncomeData = createPieChartData(filterByDateRange(income.incomes, 60), 'income');
    const sixtyDayExpenseData = createPieChartData(filterByDateRange(expense.expenses, 60), 'expense');

    return (
        <main className="dashboard-main">
            <div className="dashboard-content-wrapper">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <ThemeToggleButton />
                <button className="menu-btn" onClick={toggleSidebar}>☰</button>
            </div>
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="summary-card-icon balance">💰</div>
                    <div className="summary-card-info">
                        <h2>Total Balance</h2>
                        <p>${totalBalance.toFixed(2)}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-icon income">📈</div>
                    <div className="summary-card-info">
                        <h2>Total Income</h2>
                        <p>${totalIncome.toFixed(2)}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-icon expense">📉</div>
                    <div className="summary-card-info">
                        <h2>Total Expenses</h2>
                        <p>${totalExpenses.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="content-card recent-transactions-card">
                    <div className="card-header">
                        <h2>Recent Transactions</h2>
                        <Link to="#">See All</Link>
                    </div>
                    <ul className="transaction-list">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map(t => (
                                <li key={t._id} className="transaction-item">
                                    <div className={`transaction-icon ${t.source ? 'income' : 'expense'}`}>{t.source ? '📥' : '📤'}</div>
                                    <div className="transaction-details">
                                        <h4>{t.source || t.name}</h4>
                                        <p>{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`transaction-amount ${t.source ? 'income' : 'expense'}`}>
                                        {t.source ? '+' : '-'}${t.amount.toFixed(2)}
                                    </p>
                                </li>
                            ))
                        ) : (<p>No recent transactions.</p>)}
                    </ul>
                </div>
                
                <div className="content-card financial-overview-card">
                    <div className="card-header">
                        <h2>Financial Overview</h2>
                    </div>
                    <div className="chart-wrapper">
                        <div className="chart-center-text">
                            <h3>Total Balance</h3>
                            <p>${totalBalance.toFixed(2)}</p>
                        </div>
                        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                    </div>
                </div>
            </div>

            <div className="analysis-section">
                <div className="content-card">
                    <div className="card-header"><h2>Weekly Income</h2></div>
                    <div className="chart-wrapper">
                        {weeklyIncomeData.datasets[0].data.length > 0 ? (
                            <Pie data={weeklyIncomeData} options={pieChartOptions} />
                        ) : (
                            <p className="no-data-message">No income data for this week.</p>
                        )}
                    </div>
                </div>
                <div className="content-card">
                    <div className="card-header"><h2>Weekly Expenses</h2></div>
                    <div className="chart-wrapper">
                         {weeklyExpenseData.datasets[0].data.length > 0 ? (
                            <Pie data={weeklyExpenseData} options={pieChartOptions} />
                        ) : (
                            <p className="no-data-message">No expense data for this week.</p>
                        )}
                    </div>
                </div>
                 <div className="content-card">
                    <div className="card-header"><h2>Monthly Income</h2></div>
                    <div className="chart-wrapper">
                        {monthlyIncomeData.datasets[0].data.length > 0 ? (
                            <Pie data={monthlyIncomeData} options={pieChartOptions} />
                        ) : (
                            <p className="no-data-message">No income data for this month.</p>
                        )}
                    </div>
                </div>
                <div className="content-card">
                    <div className="card-header"><h2>Monthly Expenses</h2></div>
                    <div className="chart-wrapper">
                        {monthlyExpenseData.datasets[0].data.length > 0 ? (
                            <Pie data={monthlyExpenseData} options={pieChartOptions} />
                        ) : (
                            <p className="no-data-message">No expense data for this month.</p>
                        )}
                    </div>
                </div>
                 <div className="content-card">
                    <div className="card-header"><h2>60-Day Income</h2></div>
                    <div className="chart-wrapper">
                        {sixtyDayIncomeData.datasets[0].data.length > 0 ? (
                            <Pie data={sixtyDayIncomeData} options={pieChartOptions} />
                        ) : (
                            <p className="no-data-message">No income data for the last 60 days.</p>
                        )}
                    </div>
                </div>
                <div className="content-card">
                    <div className="card-header"><h2>60-Day Expenses</h2></div>
                    <div className="chart-wrapper">
                        {sixtyDayExpenseData.datasets[0].data.length > 0 ? (
                            <Pie data={sixtyDayExpenseData} options={pieChartOptions} />
                        ) : (
                            <p className="no-data-message">No expense data for the last 60 days.</p>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </main>
    );
};

const mapStateToProps = state => ({
    income: state.income,
    expense: state.expense,
});

export default connect(mapStateToProps, { getIncomes, getExpenses })(Dashboard);