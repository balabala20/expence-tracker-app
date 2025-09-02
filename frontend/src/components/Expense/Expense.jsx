import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addExpense, getExpenses, updateExpense, deleteExpense } from '../../actions/expense';
import '../Transactions/Transactions.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CATEGORIES = ['Groceries', 'Utilities', 'Transport', 'Entertainment', 'Health', 'Dining Out', 'Shopping', 'Other'];

const Expense = ({ getExpenses, addExpense, updateExpense, deleteExpense, expense: { expenses, loading }, toggleSidebar }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', amount: '', date: '', category: 'Other' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        getExpenses();
    }, [getExpenses]);

    const { name, amount, date, category } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddClick = () => {
        setEditingId(null);
        setFormData({ name: '', amount: '', date: '', category: 'Other' });
        setShowModal(true);
    };

    const handleEditClick = (expense) => {
        setEditingId(expense._id);
        setFormData({
            name: expense.name,
            amount: expense.amount,
            date: new Date(expense.date).toISOString().split('T')[0],
            category: expense.category || 'Other'
        });
        setShowModal(true);
    };

    const onSubmit = e => {
        e.preventDefault();
        if (editingId) {
            updateExpense(editingId, formData);
        } else {
            addExpense(formData);
        }
        setShowModal(false);
    };
    
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const chartData = {
        labels: sortedExpenses.map(exp => new Date(exp.date).toLocaleDateString()),
        datasets: [{
            label: 'Expense',
            data: sortedExpenses.map(exp => exp.amount),
            borderColor: 'rgb(240, 68, 56)',
            backgroundColor: 'rgba(240, 68, 56, 0.5)',
            tension: 0.4
        }]
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    };

    return (
        <main className="transaction-main">
            <div className="transaction-header">
                <h1>Expenses</h1>
                <div>
                    <button onClick={handleAddClick} className="add-transaction-btn">
                        <span className="btn-text">+ Add Expense</span>
                        <span className="plus-icon">+</span>
                    </button>
                    <button className="menu-btn" onClick={toggleSidebar}>☰</button>
                </div>
            </div>

            <div className="content-card">
                <div className="chart-container">
                    <Line options={chartOptions} data={chartData} />
                </div>
            </div>

            <div className="content-card transaction-list-container">
                <div className="list-header"><h2>All Expenses</h2></div>
                 <ul className="transaction-list">
                   {!loading && expenses.length > 0 ? (
                       expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(exp => (
                            <li key={exp._id} className="transaction-item">
                                <div className="transaction-icon expense">💸</div>
                                <div className="transaction-details">
                                    <h4>{exp.name}</h4>
                                    <p>{exp.category} &bull; {new Date(exp.date).toLocaleDateString()}</p>
                                </div>
                                <div className="transaction-amount expense">-₹{parseFloat(exp.amount).toFixed(2)}</div>
                                <div className="transaction-actions">
                                    <button onClick={() => handleEditClick(exp)} className="action-btn edit-btn">✏️</button>
                                    <button onClick={() => deleteExpense(exp._id)} className="action-btn delete-btn">🗑️</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No expenses found. Add one to get started!</p>
                    )}
                </ul>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit' : 'Add'} Expense</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close-btn">&times;</button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Expense Name</label>
                                    <input type="text" name="name" placeholder="e.g., Groceries, Rent" value={name} onChange={onChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Amount</label>
                                    <input type="number" name="amount" placeholder="e.g., 150" value={amount} onChange={onChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={category} onChange={onChange} required>
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" name="date" value={date} onChange={onChange} required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="add-transaction-btn">
                                     <span className="btn-text">{editingId ? 'Update' : 'Add'} Expense</span>
                                     <span className="plus-icon">{editingId ? '✓' : '+'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

const mapStateToProps = state => ({
    expense: state.expense
});

export default connect(mapStateToProps, { getExpenses, addExpense, updateExpense, deleteExpense })(Expense);