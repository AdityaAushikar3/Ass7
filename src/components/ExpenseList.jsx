import React, { useState } from 'react';

function ExpenseList({ expenses, onDeleteExpense }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExpenses = selectedCategory === 'All'
    ? expenses
    : expenses.filter((item) => item.category === selectedCategory);

  return (
    <div className="card list-card">
      <div className="list-header">
        <h2>Recorded Expenses History</h2>
        
        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="filterCategory">Filter Category: </label>
          <select
            id="filterCategory"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills & Utilities">Bills & Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Education">Education</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="no-expenses-msg">No expenses found for this selection.</p>
      ) : (
        <div className="table-responsive">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td><strong>{expense.title}</strong></td>
                  <td>
                    <span className="category-badge">{expense.category}</span>
                  </td>
                  <td className="amount-cell">₹{expense.amount.toLocaleString('en-IN')}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
