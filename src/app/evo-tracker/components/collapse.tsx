'use client';

import { useState } from 'react';

export default function Collapse({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between bg-gray-900 p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-gray-100 text-sm">
          {title} [{isOpen ? 'Hide' : 'Show'}]
        </h3>
        <div className="text-gray-100 text-sm">{isOpen ? '▲' : '▼'}</div>
      </div>
      {isOpen && <div className="p-1 bg-gray-800 pt-2">{children}</div>}
    </div>
  );
}
