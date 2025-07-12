import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import CSS for animations & styling

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.delete(`/expenses/${editingId}`); // Delete old
      }
      await axios.post('/expenses', form);
      setForm({ title: '', amount: '', category: '', date: '' });
      setEditingId(null);
      setFormVisible(false); // Close form after submit
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (expense) => {
    setForm(expense);
    setEditingId(expense.id);
    setFormVisible(true); // Show form on edit
  };

  const handleDelete = async (id) => {
    try {
      const item = document.getElementById(`expense-${id}`);
      item.classList.add('fade-out'); // Animation before deletion
      setTimeout(async () => {
        await axios.delete(`/expenses/${id}`);
        fetchExpenses();
      }, 300);
    } catch (err) {
      console.error(err);
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
