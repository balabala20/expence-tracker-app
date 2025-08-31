import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getGoals,
  addGoal,
  deleteGoal,
  updateGoalDetails,
  updateGoalProgress,
} from "../../actions/goals";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Confetti from "react-confetti";
import "./Goals.css";

ChartJS.register(ArcElement, Tooltip);

const Goals = ({
  getGoals,
  addGoal,
  deleteGoal,
  updateGoalDetails,
  updateGoalProgress,
  goals: { goals, loading },
  toggleSidebar,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [contributionAmounts, setContributionAmounts] = useState({});

  useEffect(() => {
    getGoals();
  }, [getGoals]);

  const { name, targetAmount, targetDate } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: "", targetAmount: "", targetDate: "" });
    setShowModal(true);
  };

  const handleEditClick = (goal) => {
    setEditingId(goal._id);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      targetDate: new Date(goal.targetDate).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      targetAmount: parseFloat(targetAmount),
    };
    if (editingId) {
      updateGoalDetails(editingId, dataToSubmit);
    } else {
      addGoal(dataToSubmit);
    }
    setShowModal(false);
  };

  const handleContributionChange = (goalId, amount) => {
    setContributionAmounts({ ...contributionAmounts, [goalId]: amount });
  };

  const handleAddContribution = (goalId, currentAmount) => {
    const amount = contributionAmounts[goalId] || 0;
    if (amount > 0) {
      const newAmount = parseFloat(currentAmount) + parseFloat(amount);
      updateGoalProgress(goalId, newAmount);
      setContributionAmounts({ ...contributionAmounts, [goalId]: "" });
    }
  };

  const createChartData = (goal) => ({
    labels: ["Saved", "Remaining"],
    datasets: [
      {
        data: [
          goal.currentAmount,
          Math.max(0, goal.targetAmount - goal.currentAmount),
        ],
        backgroundColor: ["#12B76A", "#EAECF0"],
        borderColor: ["var(--card-background)"],
        borderWidth: 4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: { tooltip: { enabled: true }, legend: { display: false } },
  };

  return (
    <main className="goals-main">
      <div className="goals-header">
        <h1>Savings Goals</h1>
        <button onClick={handleAddClick} className="add-transaction-btn">
          <span className="btn-text">+ Add Goal</span>
          <span className="plus-icon">+</span>
        </button>
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      <ul className="goal-list">
        {!loading &&
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isComplete = goal.currentAmount >= goal.targetAmount;
            const msLeft = new Date(goal.targetDate) - new Date();
            const weeksLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24 * 7));
            const monthsLeft = Math.ceil(
              msLeft / (1000 * 60 * 60 * 24 * 30.44)
            );
            const neededPerWeek =
              !isComplete && weeksLeft > 0
                ? (goal.targetAmount - goal.currentAmount) / weeksLeft
                : 0;
            const neededPerMonth =
              !isComplete && monthsLeft > 0
                ? (goal.targetAmount - goal.currentAmount) / monthsLeft
                : 0;

            return (
              <li key={goal._id} className="goal-item">
                {isComplete && (
                  <Confetti recycle={false} numberOfPieces={200} />
                )}
                <div className="goal-item-header">
                  <h3>{goal.name}</h3>
                  <div>
                    <button
                      onClick={() => handleEditClick(goal)}
                      className="action-btn edit-btn"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteGoal(goal._id)}
                      className="action-btn delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="chart-container">
                  <div className="chart-center-text">
                    <h3>{progress.toFixed(0)}%</h3>
                    <p>Complete</p>
                  </div>
                  <Doughnut
                    data={createChartData(goal)}
                    options={chartOptions}
                  />
                </div>

                <div className="goal-details">
                  <p>
                    <strong>Saved:</strong> ₹{goal.currentAmount.toFixed(2)} / ₹
                    {goal.targetAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Target Date:</strong>{" "}
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                  {neededPerWeek > 0 && (
                    <p>
                      <strong>Needed per week:</strong> ₹
                      {neededPerWeek.toFixed(2)}
                    </p>
                  )}
                  {neededPerMonth > 0 && (
                    <p>
                      <strong>Needed per month:</strong> ₹
                      {neededPerMonth.toFixed(2)}
                    </p>
                  )}
                </div>

                {!isComplete && (
                  <div className="goal-actions">
                    <input
                      type="number"
                      placeholder="Add to savings"
                      value={contributionAmounts[goal._id] || ""}
                      onChange={(e) =>
                        handleContributionChange(goal._id, e.target.value)
                      }
                    />
                    <button
                      onClick={() =>
                        handleAddContribution(goal._id, goal.currentAmount)
                      }
                      className="add-savings-btn"
                    >
                      Add
                    </button>
                  </div>
                )}
              </li>
            );
          })}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? "Edit Goal" : "Add New Goal"}</h2>
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
                  <label>Goal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Target Amount</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={targetAmount}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Target Date</label>
                  <input
                    type="date"
                    name="targetDate"
                    value={targetDate}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="add-transaction-btn">
                  <span className="btn-text">
                    {editingId ? "Update Goal" : "Add Goal"}
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
  goals: state.goals,
});

export default connect(mapStateToProps, {
  getGoals,
  addGoal,
  deleteGoal,
  updateGoalDetails,
  updateGoalProgress,
})(Goals);
