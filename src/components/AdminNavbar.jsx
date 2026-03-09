import React from "react";
import { FaUserShield } from "react-icons/fa";

const AdminNavbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-400 p-2 rounded-lg">
          <FaUserShield className="text-slate-900 text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-xs text-slate-500">Welcome back, Administrator</p>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;

