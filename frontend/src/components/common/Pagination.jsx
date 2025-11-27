import React from "react";

export default function Pagination({ page, totalPages, onPageChange, limit, onLimitChange, total }) {
  const pageNumbers = [];
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-300">Items per page:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="bg-gray-800 text-white px-2 py-1 rounded"
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400 ml-3">Total: {total}</span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(1)} disabled={page === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">« First</button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">‹ Prev</button>
        {start > 1 && <span className="px-2 text-gray-300">...</span>}
        {pageNumbers.map((p) => (
          <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded ${p === page ? "bg-red-500 text-white" : "bg-gray-700 text-gray-200"}`}>{p}</button>
        ))}
        {end < totalPages && <span className="px-2 text-gray-300">...</span>}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Next ›</button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50">Last »</button>
      </div>
    </div>
  );
}
