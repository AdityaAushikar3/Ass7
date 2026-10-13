const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      trim: true,
      default: 'Others'
    },
    date: {
      type: String,
      required: [true, 'Expense date is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
