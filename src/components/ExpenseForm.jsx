import React, { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter an expense title.');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddExpense({
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date
      });

      // Reset title and amount, keep category and today's date
      setFormData((prev) => ({
        ...prev,
        title: '',
        amount: ''
      }));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="card form-card">
      <h2>Record New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Expense Description:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping, Books, Taxi"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹):</label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 250"
            min="1"
            step="any"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills & Utilities">Bills & Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Education">Education</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving to MongoDB...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
