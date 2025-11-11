import React from "react";

export default function UserTable({ users = [] }) {
  return (
    <div className="overflow-x-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
      <table className="min-w-full text-sm text-left text-slate-300">
        <thead className="text-xs uppercase bg-white/10 text-sky-300">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Active</th>
            <th className="px-6 py-3">Created At</th>
            <th className="px-6 py-3">Updated At</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-3 font-mono text-xs text-slate-400">
                  {u.id}
                </td>
                <td className="px-6 py-3">{u.name}</td>
                <td className="px-6 py-3">{u.email}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      u.role === "Recruiter"
                        ? "bg-indigo-600/30 text-indigo-300"
                        : "bg-sky-600/30 text-sky-300"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {u.is_active ? (
                    <span className="text-emerald-400 font-medium">Yes</span>
                  ) : (
                    <span className="text-rose-400 font-medium">No</span>
                  )}
                </td>
                <td className="px-6 py-3 text-slate-400">{u.created_at}</td>
                <td className="px-6 py-3 text-slate-400">{u.updated_at}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center text-slate-500 py-10 text-sm"
              >
                No user data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
