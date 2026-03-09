import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar/UserNavbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
