const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  seedExpenses
} = require('../controllers/expenseController');

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.post('/seed', seedExpenses);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
