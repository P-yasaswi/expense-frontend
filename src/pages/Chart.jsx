import React, { useEffect, useState } from 'react';
import axios from '../api';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ChartPage = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expenses'); // ✅ Fixed path
        setExpenses(res.data);
      } catch (err) {
        console.error('Error fetching expenses for chart:', err);
      }
    };
    fetchExpenses();
  }, []);

  // Totals by category (Pie)
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  // Totals by date (Bar)
  const datesTotals = expenses.reduce((acc, curr) => {
    acc[curr.date] = (acc[curr.date] || 0) + Number(curr.amount);
    return acc;
  }, {});

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Expense Charts</h2>

      <div style={{ width: '400px', margin: '2rem auto' }}>
        <h3 style={{ textAlign: 'center' }}>By Category</h3>
        <Pie
          data={{
            labels: Object.keys(categoryTotals),
            datasets: [
              {
                data: Object.values(categoryTotals),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9CCC65', '#FF7043'],
              },
            ],
          }}
        />
      </div>

      <div style={{ width: '600px', margin: '2rem auto' }}>
        <h3 style={{ textAlign: 'center' }}>By Date</h3>
        <Bar
          data={{
            labels: Object.keys(datesTotals),
            datasets: [
              {
                label: 'Expenses',
                data: Object.values(datesTotals),
                backgroundColor: '#42A5F5',
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default ChartPage;
