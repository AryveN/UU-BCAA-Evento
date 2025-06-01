import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listEvents, createEvent, listExpenses } from '../services/api';
import TopNav from './TopNav';
import EventItem from './EventItem';
import EventPopup from './EventPopup';

export default function EventList({ dark, onToggleDark }) {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // initial load with full range
    fetchEvents(filters);
  }, []);

  // fetchEvents now accepts an optional overrides object
  async function fetchEvents(overrideFilters) {
    const f = overrideFilters || filters;
    setFilters(f);
    const payload = {};
    if (f.dateFrom) payload.dateFrom = new Date(f.dateFrom).toISOString();
    if (f.dateTo)   payload.dateTo   = new Date(f.dateTo).toISOString();
    try {
      const res = await listEvents(payload);
      const list = res.data.itemList || res.data;
      const enriched = await Promise.all(
        list.map(async ev => {
          const expRes = await listExpenses(ev._id);
          const expensesArr = expRes.data.itemList || [];
          const used = expensesArr.reduce((sum, x) => sum + x.amount, 0);
          const percent = ev.budget ? Math.min(100, Math.round((used / ev.budget) * 100)) : 0;
          return { ...ev, used, percent };
        })
      );
      // Sort by event date ascending (soonest first)
      enriched.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(enriched);
    } catch (err) {
      console.error('Error loading events:', err);
    }
  }

  async function handleCreate(data) {
    try {
      await createEvent(data);
      setShowPopup(false);
      fetchEvents(filters);
    } catch (err) {
      console.error('Error creating event:', err);
    }
  }

  // helper: reset to wide range
  const resetFilters = () => {
    const fullRange = { dateFrom: '1970-01-01', dateTo: '2100-12-31' };
    fetchEvents(fullRange);
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <TopNav
        title="Evento"
        onNew={() => setShowPopup(true)}
        dark={dark}
        onToggleDark={onToggleDark}
      />

      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-wrap items-center gap-4">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
          className={`w-40 p-3 rounded-md border ${dark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
          className={`w-40 p-3 rounded-md border ${dark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
        />
        <button
          onClick={() => fetchEvents(filters)}
          className={`px-4 py-2 rounded-md text-white transition ${dark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 hover:bg-purple-400'}`}
        >
          Filtrovat
        </button>
        <button
          onClick={resetFilters}
          className={`px-4 py-2 rounded-md transition ${dark ? 'bg-gray-600 hover:bg-gray-500 text-gray-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
        >
          Reset
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <div
              key={ev._id}
              onClick={() => navigate(`/events/${ev._id}`)}
            >
              <EventItem event={ev} dark={dark} />
            </div>
          ))}
        </div>
      </div>

      {showPopup && <EventPopup onClose={() => setShowPopup(false)} onSave={handleCreate} />}
    </div>
  );
}
