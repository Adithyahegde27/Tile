import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <div className="p-6 overflow-y-auto flex-1 relative bg-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

