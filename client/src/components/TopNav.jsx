import React from 'react';

export default function TopNav({ title = 'Events', onNew, onBack, dark, onToggleDark }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 p-4 mb-4 bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <div className="flex items-center space-x-2">
        {onBack ? (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Zpět
          </button>
        ) : (
          <button
            onClick={onNew}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
          >
            Nový event
          </button>
        )}
        <button
          onClick={onToggleDark}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}