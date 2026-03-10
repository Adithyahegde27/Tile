import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-out"
        style={{ 
          marginLeft: sidebarOpen ? '0px' : '-52px'
        }}
      >
        <AdminNavbar />
        <div className="p-6 overflow-y-auto flex-1 relative bg-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

