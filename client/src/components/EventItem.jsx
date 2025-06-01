import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listGuests, listExpenses } from '../services/api';

export default function EventItem({ event, dark }) {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [used, setUsed] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // load guests and expenses once
    async function loadData() {
      try {
        const gRes = await listGuests(event._id);
        setGuests(gRes.data.itemList || []);
        const eRes = await listExpenses(event._id);
        const expensesArr = eRes.data.itemList || [];
        const totalUsed = expensesArr.reduce((sum, x) => sum + x.amount, 0);
        setUsed(totalUsed);
        setPercent(event.budget ? Math.min(100, Math.round((totalUsed / event.budget) * 100)) : 0);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [event]);

  // RSVP counts
  const countComing = guests.filter(g => g.status === 'Přijde').length;
  const countNot    = guests.filter(g => g.status === 'Nepřijde').length;
  const countUndec  = guests.filter(g => g.status === 'Nerozhodnuto').length;

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className={`border-2 ${dark ? 'border-gray-600 bg-gray-800 hover:shadow-lg' : 'border-gray-300 bg-white hover:shadow-lg'} rounded-lg p-6 transition cursor-pointer`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">{event.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>

      {/* Badges */}
      <div className="mt-4 flex space-x-2">
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
          Přijde {countComing}
        </span>
        <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">
          Nepřijde {countNot}
        </span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
          Nerozhodnuto {countUndec}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`${dark ? 'bg-purple-400' : 'bg-purple-600'} h-full transition-all`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
          {used}/{event.budget} Kč ({percent}%)
        </p>
      </div>
    </div>
  );
}