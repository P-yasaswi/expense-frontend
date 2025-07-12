import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.delete(`/api/expenses/${editingId}`);
      }
      await axios.post('/api/expenses', form);
      setForm({ title: '', amount: '', category: '', date: '' });
      setEditingId(null);
      setFormVisible(false);
      fetchExpenses();
    } catch (err) {
      console.error('Error submitting expense:', err);
    }
  };

  const handleEdit = (expense) => {
    setForm(expense);
    setEditingId(expense.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const item = document.getElementById(`expense-${id}`);
      item.classList.add('fade-out');
      setTimeout(async () => {
        await axios.delete(`/api/expenses/${id}`);
        fetchExpenses();
      }, 300);
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Expense Dashboard</h2>

      <button className="toggle-form-btn" onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? 'Close Form' : 'Add Expense'}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="add-expense-form">
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            required
          />
          <button type="submit" className="submit-btn">
            {editingId ? 'Update' : 'Add'} Expense
          </button>
        </form>
      )}

      <ul className="expense-list">
        {expenses.map(exp => (
          <li
            key={exp.id}
            id={`expense-${exp.id}`}
            className="expense-item"
          >
            <strong>{exp.title}</strong>: ₹{exp.amount} [{exp.category}] on {exp.date}
            <button onClick={() => handleEdit(exp)} className="edit-btn">Edit</button>
            <button onClick={() => handleDelete(exp.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate('/chart')} className="view-charts-btn">View Charts</button>
    </div>
  );
};

export default Dashboard;

