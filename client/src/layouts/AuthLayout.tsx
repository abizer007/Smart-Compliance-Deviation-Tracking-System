import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-gray-100">
      <div className="w-full max-w-md border border-[#30363d] bg-[#161b22] rounded-lg p-8 shadow-lg">
        <h1 className="text-xl font-semibold mb-6 text-center">Smart Compliance</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

