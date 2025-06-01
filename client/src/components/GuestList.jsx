import React, { useEffect, useState } from 'react';
import { listGuests, addGuest } from '../services/api';

export default function GuestList({ eventId }) {
  const [guests, setGuests] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function load() {
      const res = await listGuests(eventId);
      setGuests(res.data.itemList || []);
    }
    load();
  }, [eventId]);

  const handleAdd = async e => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await addGuest(eventId, email);
      setGuests(res.data.itemList);
      setEmail('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <ul className="space-y-2 mb-4">
        {guests.map((g, i) => {
          // barva badge podle statusu
          const badgeClasses =
            g.status === 'Přijde'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : g.status === 'Nepřijde'
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
          return (
            <li
              key={i}
              className="flex justify-between items-center px-4 py-2 rounded-md transition-colors bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="text-gray-900 dark:text-gray-100">{g.email}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClasses}`}>
                {g.status}
              </span>
            </li>
          );
        })}
      </ul>
      <form onSubmit={handleAdd} className="flex items-center space-x-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email hosta"
          className="flex-1 border rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
        >
          Přidat hosta
        </button>
      </form>
    </div>
  );
}