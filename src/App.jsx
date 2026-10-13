import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseAnalysis from './components/ExpenseAnalysis';
import ExpenseList from './components/ExpenseList';
import './App.css';

const API_URL = 'http://localhost:5000/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('connecting'); // 'connecting' | 'connected' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Fetch all expenses from MongoDB
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setExpenses(data.data || []);
        setDbStatus('connected');
        setErrorMessage('');
      } else {
        throw new Error(data.message || 'Failed to fetch');
      }
    } catch (err) {
      console.error('MongoDB fetch error:', err);
      setDbStatus('error');
      setErrorMessage(
        'Backend server not reachable on http://localhost:5000. Please ensure "node backend/server.js" is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add new expense handler (POST to MongoDB)
  const handleAddExpense = async (newExpenseData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newExpenseData)
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to save expense');
      }

      const savedExpense = result.data;
      setExpenses((prev) => [savedExpense, ...prev]);
      showNotification(
        `Entry "${savedExpense.title}" (₹${savedExpense.amount}) saved to MongoDB collection "expenses"! Check MongoDB Compass.`,
        'success'
      );
    } catch (err) {
      console.error('Error adding expense:', err);
      showNotification(`Failed to save to MongoDB: ${err.message}`, 'error');
      throw err;
    }
  };

  // Delete expense handler (DELETE from MongoDB)
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record from MongoDB?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete expense');
      }

      setExpenses((prev) => prev.filter((item) => (item._id || item.id) !== id));
      showNotification('Expense successfully removed from MongoDB collection.', 'info');
    } catch (err) {
      console.error('Error deleting expense:', err);
      showNotification(`Failed to delete from MongoDB: ${err.message}`, 'error');
    }
  };

  // Seed sample data into MongoDB if empty
  const handleSeedData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/seed`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        showNotification(result.message, 'success');
        await fetchExpenses();
      }
    } catch (err) {
      showNotification(`Seed failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Personal Expense Tracker & Analyzer</h1>
        <p>Live MongoDB Connected Application &middot; View and manage entries in MongoDB Compass</p>

        {/* MongoDB Connection Status Card */}
        <div className={`db-status-bar status-${dbStatus}`}>
          <div className="status-indicator">
            <span className={`status-dot dot-${dbStatus}`}></span>
            <strong>
              {dbStatus === 'connected' && 'MongoDB Connected'}
              {dbStatus === 'connecting' && 'Connecting to MongoDB...'}
              {dbStatus === 'error' && 'MongoDB Connection Offline'}
            </strong>
          </div>

          <div className="compass-info">
            <span className="compass-pill">
              <strong>URI:</strong> mongodb://127.0.0.1:27017
            </span>
            <span className="compass-pill">
              <strong>Database:</strong> expense_tracker
            </span>
            <span className="compass-pill">
              <strong>Collection:</strong> expenses
            </span>
            <span className="compass-pill records-count">
              <strong>Entries:</strong> {expenses.length}
            </span>
          </div>

          <div className="status-actions">
            <button
              type="button"
              className="refresh-db-btn"
              onClick={fetchExpenses}
              disabled={loading}
              title="Refresh records from MongoDB"
            >
              {loading ? 'Refreshing...' : '🔄 Refresh Data'}
            </button>
            {expenses.length === 0 && dbStatus === 'connected' && (
              <button
                type="button"
                className="seed-btn"
                onClick={handleSeedData}
                title="Populate sample expenses into MongoDB"
              >
                🌱 Seed Sample Data
              </button>
            )}
          </div>
        </div>

        {/* Error notification banner if DB is not reached */}
        {dbStatus === 'error' && (
          <div className="db-alert error-alert">
            <p>
              ⚠️ <strong>Backend Not Connected:</strong> {errorMessage}
            </p>
            <p className="sub-instruction">
              Run <code>node backend/server.js</code> in the project directory, then click "Refresh Data".
            </p>
          </div>
        )}

        {/* Live Notification Toast */}
        {notification && (
          <div className={`toast-notification toast-${notification.type}`}>
            <span>{notification.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => setNotification(null)}
            >
              &times;
            </button>
          </div>
        )}
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
