import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseAnalysis from './components/ExpenseAnalysis';
import ExpenseList from './components/ExpenseList';
import './App.css';

function App() {
  // Sample initial expenses to make the app immediately interactive
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Grocery & Vegetables',
      amount: 1450,
      category: 'Food & Dining',
      date: '2026-10-10'
    },
    {
      id: 2,
      title: 'Metro Pass Recharge',
      amount: 600,
      category: 'Transportation',
      date: '2026-10-11'
    },
    {
      id: 3,
      title: 'WiFi Broadband Bill',
      amount: 899,
      category: 'Bills & Utilities',
      date: '2026-10-11'
    },
    {
      id: 4,
      title: 'College Books & Stationery',
      amount: 750,
      category: 'Education',
      date: '2026-10-12'
    }
  ]);

  // Add new expense handler
  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  // Delete expense handler
  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Personal Expense Tracker & Analyzer</h1>
        <p>A simple React application to record, monitor, and analyze your personal expenses</p>
      </header>

      {/* Main Top Grid: Form and Analysis */}
      <main className="content-grid">
        <ExpenseForm onAddExpense={handleAddExpense} />
        <ExpenseAnalysis expenses={expenses} />
      </main>

      {/* Bottom Section: Expenses History Table */}
      <section className="history-section">
        <ExpenseList
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
        />
      </section>
    </div>
  );
}

export default App;
