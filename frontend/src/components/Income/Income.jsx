import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from "../../actions/income";
import "../Transactions/Transactions.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Income = ({
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
  income: { incomes, loading },
  toggleSidebar,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getIncomes();
  }, [getIncomes]);

  const { source, amount, date } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ source: "", amount: "", date: "" });
    setShowModal(true);
  };

  const handleEditClick = (income) => {
    setEditingId(income._id);
    setFormData({
      source: income.source,
      amount: income.amount,
      date: new Date(income.date).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateIncome(editingId, formData);
    } else {
      addIncome(formData);
    }
    setShowModal(false);
  };

  const sortedIncomes = [...incomes].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = {
    labels: sortedIncomes.map((inc) => new Date(inc.date).toLocaleDateString()),
    datasets: [
      {
        label: "Income",
        data: sortedIncomes.map((inc) => inc.amount),
        backgroundColor: "rgba(127, 86, 217, 0.6)",
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <main className="transaction-main">
      <div className="transaction-header">
        <h1>Income</h1>
        <div>
          <button onClick={handleAddClick} className="add-transaction-btn">
            <span className="btn-text">+ Add Income</span>
            <span className="plus-icon">+</span>
          </button>
          <button className="menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="chart-container">
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="content-card transaction-list-container">
        <div className="list-header">
          <h2>Income Sources</h2>
        </div>
        <ul className="transaction-list">
          {!loading && incomes.length > 0 ? (
            incomes.map((inc) => (
              <li key={inc._id} className="transaction-item">
                <div className="transaction-icon income">💰</div>
                <div className="transaction-details">
                  <h4>{inc.source}</h4>
                  <p>{new Date(inc.date).toLocaleDateString()}</p>
                </div>
                <div className="transaction-amount income">
                  +₹{inc.amount.toFixed(2)}
                </div>
                <div className="transaction-actions">
                  <button
                    onClick={() => handleEditClick(inc)}
                    className="action-btn edit-btn"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteIncome(inc._id)}
                    className="action-btn delete-btn"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No income sources found. Add one to get started!</p>
          )}
        </ul>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? "Edit" : "Add"} Income</h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    name="source"
                    value={source}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="add-transaction-btn">
                  <span className="btn-text">
                    {editingId ? "Update" : "Add"} Income
                  </span>
                  <span className="plus-icon">{editingId ? "✓" : "+"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

const mapStateToProps = (state) => ({
  income: state.income,
});

export default connect(mapStateToProps, {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
})(Income);
