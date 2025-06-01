import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, listGuests, listExpenses } from '../services/api';
import TopNav from './TopNav';
import GuestList from './GuestList';
import ExpenseList from './ExpenseList';
import CircularProgress from './CircularProgress';

export default function EventDetail({ dark, onToggleDark }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState('guests');

  useEffect(() => {
    async function loadAll() {
      const evRes = await getEvent(id);
      setEvent(evRes.data);
      const gRes = await listGuests(id);
      setGuests(gRes.data.itemList || []);
      const eRes = await listExpenses(id);
      setExpenses(eRes.data.itemList || []);
    }
    loadAll();
  }, [id]);

  if (!event) return <div className={`p-6 ${dark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>Načítání...</div>;

  const used = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percent = event.budget ? Math.min(100, Math.round((used / event.budget) * 100)) : 0;

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <TopNav
        title="Detail Eventu"
        onBack={() => navigate('/')}
        dark={dark}
        onToggleDark={onToggleDark}
      />

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className={`border-2 rounded-lg p-6 transition ${dark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}> 
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">{event.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <CircularProgress percent={percent} size={60} strokeWidth={6} />
          </div>
        </div>

        {/* Info */}
        <div className={`border-2 rounded-lg p-6 transition ${dark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}> 
          <p className="mb-2"><strong>Lokace:</strong> {event.location}</p>
          <p className="mb-2"><strong>Popis:</strong> {event.description}</p>
          <p><strong>Rozpočet:</strong> {event.budget} Kč</p>
        </div>

        {/* Toggle */}
        <div className="flex space-x-4">
          <button
            onClick={() => setView('guests')}
            className={`flex-1 py-2 rounded-md transition ${view === 'guests' ? 'bg-purple-600 text-white' : dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
          >Hosté</button>
          <button
            onClick={() => setView('expenses')}
            className={`flex-1 py-2 rounded-md transition ${view === 'expenses' ? 'bg-purple-600 text-white' : dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
          >Výdaje</button>
        </div>

        {/* Content */}
        {view === 'guests' ? (
          <GuestList eventId={id} readOnly />
        ) : (
          <ExpenseList eventId={id} />
        )}
      </div>
    </div>
  );
}