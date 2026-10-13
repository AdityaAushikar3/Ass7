import React from 'react';

function ExpenseAnalysis({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="card analysis-card">
        <h2>Expense Analysis</h2>
        <div className="empty-state">
          <p>No expenses to analyze yet.</p>
          <p className="sub-text">Add your expenses using the form to see total, average, and category breakdown.</p>
        </div>
      </div>
    );
  }

  // 1. Total spent
  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // 2. Average expense
  const averageAmount = (totalAmount / expenses.length).toFixed(2);

  // 3. Highest expense
  const highestExpense = expenses.reduce(
    (max, item) => (Number(item.amount) > Number(max.amount) ? item : max),
    expenses[0]
  );

  // 4. Category-wise breakdown
  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    amount: categoryTotals[cat],
    percentage: ((categoryTotals[cat] / totalAmount) * 100).toFixed(1)
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="card analysis-card">
      <h2>Expense Analysis & Summary</h2>

      {/* Summary KPI Cards */}
      <div className="summary-kpis">
        <div className="kpi-box kpi-total">
          <span className="kpi-label">Total Spent</span>
          <span className="kpi-value">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>

        <div className="kpi-box">
          <span className="kpi-label">Transactions</span>
          <span className="kpi-value">{expenses.length}</span>
        </div>

        <div className="kpi-box">
          <span className="kpi-label">Avg. Expense</span>
          <span className="kpi-value">₹{Number(averageAmount).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Highest Single Expense highlight */}
      <div className="highlight-box">
        <strong>Highest Single Expense: </strong>
        <span>
          {highestExpense.title} ({highestExpense.category}) — <strong>₹{highestExpense.amount.toLocaleString('en-IN')}</strong>
        </span>
      </div>

      {/* Category Breakdown */}
      <div className="category-breakdown">
        <h3>Category Breakdown</h3>
        <div className="category-list">
          {categories.map((cat) => (
            <div key={cat.name} className="category-item">
              <div className="category-header">
                <span className="cat-name">{cat.name}</span>
                <span className="cat-amount">₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)</span>
              </div>
              <div className="cat-bar-track">
                <div
                  className="cat-bar-fill"
                  style={{ width: `${cat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpenseAnalysis;
