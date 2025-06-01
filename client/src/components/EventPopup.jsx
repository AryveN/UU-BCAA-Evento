import React, { useState } from 'react';

export default function EventPopup({ onClose, onSave, initialData = {} }) {
  const [form, setForm] = useState({
    name:        initialData.name        || '',
    date:        initialData.date        || '',
    location:    initialData.location    || '',
    description: initialData.description || '',
    budget:      initialData.budget      || ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      name:        form.name,
      date:        new Date(form.date).toISOString(),
      location:    form.location,
      description: form.description,
      budget:      Number(form.budget)
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-6 w-full max-w-md shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Nový event</h2>
        <label className="block mb-3">
          <span className="block text-sm font-medium">Název</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </label>
        <label className="block mb-3">
          <span className="block text-sm font-medium">Datum</span>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </label>
        <label className="block mb-3">
          <span className="block text-sm font-medium">Lokace</span>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </label>
        <label className="block mb-3">
          <span className="block text-sm font-medium">Popis</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 h-24 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </label>
        <label className="block mb-5">
          <span className="block text-sm font-medium">Rozpočet</span>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </label>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Zrušit
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
          >
            Uložit
          </button>
        </div>
      </form>
    </div>
  );
}
