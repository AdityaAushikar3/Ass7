const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message
    });
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found'
      });
    }
    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expense',
      error: error.message
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (amount === undefined || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a number greater than 0'
      });
    }

    const expense = new Expense({
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Others',
      date: date || new Date().toISOString().split('T')[0]
    });

    const savedExpense = await expense.save();

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: savedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message
    });
  }
};

// @desc    Update existing expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found to update'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found to delete'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message
    });
  }
};

// @desc    Seed sample expenses if empty
// @route   POST /api/expenses/seed
const seedExpenses = async (req, res) => {
  try {
    const count = await Expense.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: `Database already contains ${count} expenses`,
        count
      });
    }

    const sampleExpenses = [
      {
        title: 'Grocery & Vegetables',
        amount: 1450,
        category: 'Food & Dining',
        date: '2026-10-10'
      },
      {
        title: 'Metro Pass Recharge',
        amount: 600,
        category: 'Transportation',
        date: '2026-10-11'
      },
      {
        title: 'WiFi Broadband Bill',
        amount: 899,
        category: 'Bills & Utilities',
        date: '2026-10-11'
      },
      {
        title: 'College Books & Stationery',
        amount: 750,
        category: 'Education',
        date: '2026-10-12'
      }
    ];

    const inserted = await Expense.insertMany(sampleExpenses);
    res.status(201).json({
      success: true,
      message: 'Sample expenses seeded successfully into MongoDB',
      data: inserted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed sample expenses',
      error: error.message
    });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  seedExpenses
};
