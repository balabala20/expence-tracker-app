import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getIncomes } from '../../actions/income';
import { getExpenses } from '../../actions/expense';
import './Transactions.css';

const RecentTransactions = ({ getIncomes, getExpenses, income, expense, toggleSidebar }) => {
  useEffect(() => {
    getIncomes();
    getExpenses();
  }, [getIncomes, getExpenses]);

  const allTransactions = [...income.incomes, ...expense.expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="transaction-main">
      <div className="transaction-header">
        <h1>All Transactions</h1>
        <Link to="/" className="back-to-dash">Back</Link>
      </div>

      <div className="content-card transaction-list-container">
        <div className="list-header">
          <h2>Transaction History</h2>
        </div>
        <ul className="transaction-list">
          {!income.loading && !expense.loading && allTransactions.length > 0 ? (
            allTransactions.map(t => (
              <li key={t._id} className="transaction-item">
                <div className={`transaction-icon ${t.source ? 'income' : 'expense'}`}>{t.source ? '💰' : '💸'}</div>
                <div className="transaction-details">
                  <h4>{t.source || t.name}</h4>
                  <p>{t.category ? `${t.category} • ` : ''}{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <p className={`transaction-amount ${t.source ? 'income' : 'expense'}`}>
                  {t.source ? '+' : '-'}₹{parseFloat(t.amount).toFixed(2)}
                </p>
              </li>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </ul>
      </div>
    </main>
  );
};

const mapStateToProps = state => ({
  income: state.income,
  expense: state.expense,
});

export default connect(mapStateToProps, { getIncomes, getExpenses })(RecentTransactions);