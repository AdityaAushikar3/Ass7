const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/expenses', expenseRoutes);

// Health check / info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Expense Tracker REST API connected to MongoDB',
    database: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker',
    endpoints: {
      getAllExpenses: 'GET /api/expenses',
      createExpense: 'POST /api/expenses',
      getExpenseById: 'GET /api/expenses/:id',
      updateExpense: 'PUT /api/expenses/:id',
      deleteExpense: 'DELETE /api/expenses/:id',
      seedExpenses: 'POST /api/expenses/seed'
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints accessible at http://localhost:${PORT}/api/expenses`);
});
