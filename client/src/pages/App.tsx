import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import RequireAuth from '../components/RequireAuth';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="space-y-4">
    <h1 className="text-lg font-semibold">{title}</h1>
    <p className="text-sm text-gray-400">Coming soon. Connect backend to enable.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sop" element={<PlaceholderPage title="SOP Management" />} />
          <Route path="/deviations" element={<PlaceholderPage title="Deviations" />} />
          <Route path="/capa" element={<PlaceholderPage title="CAPA" />} />
          <Route path="/audits" element={<PlaceholderPage title="Audits" />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="/admin" element={<PlaceholderPage title="Admin Panel" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

