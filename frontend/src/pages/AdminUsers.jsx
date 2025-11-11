import React, { useEffect, useState } from "react";
import UserTable from "../components/admin/UserTable";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  // Mock data (replace with API later)
  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Yash Goyal",
        email: "yash@example.com",
        role: "Candidate",
        is_active: true,
        created_at: "2025-11-10 14:32",
        updated_at: "2025-11-11 09:15",
      },
      {
        id: 2,
        name: "Rohan Sharma",
        email: "rohan@company.com",
        role: "Recruiter",
        is_active: true,
        created_at: "2025-11-09 18:21",
        updated_at: "2025-11-11 08:02",
      },
      {
        id: 3,
        name: "Priya Singh",
        email: "priya@gmail.com",
        role: "Candidate",
        is_active: false,
        created_at: "2025-10-22 10:45",
        updated_at: "2025-11-01 12:10",
      },
    ];
    setUsers(data);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#06071a] via-[#071233] to-[#041028] text-slate-200 px-6 py-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-300">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Viewing all{" "}
          <span className="text-sky-400 font-medium">{users.length}</span> users
        </p>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto">
        <UserTable users={users} />
      </div>
    </main>
  );
}
