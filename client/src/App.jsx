import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';

export default function App() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventList dark={dark} onToggleDark={() => setDark(d => !d)} />} />
        <Route path="/events/:id" element={<EventDetail dark={dark} onToggleDark={() => setDark(d => !d)} />} />
      </Routes>
    </BrowserRouter>
  );
}