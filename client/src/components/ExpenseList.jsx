import React, { useEffect, useState } from 'react';
import { listExpenses, createExpense, deleteExpense } from '../services/api';

export default function ExpenseList({ eventId }) {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', date: '' });

  useEffect(() => {
    async function load() {
      const res = await listExpenses(eventId);
      setExpenses(res.data.itemList || []);
    }
    load();
  }, [eventId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await createExpense({
        title: form.title,
        amount: Number(form.amount),
        date: new Date(form.date).toISOString(),
        eventId
      });
      setForm({ title: '', amount: '', date: '' });
      const res = await listExpenses(eventId);
      setExpenses(res.data.itemList || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteExpense(id);
      const res = await listExpenses(eventId);
      setExpenses(res.data.itemList || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Výdaje</h2>
      <ul className="space-y-2 mb-4">
        {expenses.map(exp => (
          <li key={exp._id} className="flex justify-between items-center">
            <span className="text-gray-900 dark:text-gray-100">
              {exp.title}: {exp.amount} Kč ({new Date(exp.date).toLocaleDateString()})
            </span>
            <button
              onClick={() => handleDelete(exp._id)}
              className="px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="flex space-x-2 mb-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Název"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        />
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Částka"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
        >
          Přidat
        </button>
      </form>
    </div>
  );
}