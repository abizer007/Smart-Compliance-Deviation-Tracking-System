import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import SOPs from '@/pages/SOPs';
import Deviations from '@/pages/Deviations';
import CAPAs from '@/pages/CAPAs';
import Audits from '@/pages/Audits';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sops" element={<SOPs />} />
          <Route path="/deviations" element={<Deviations />} />
          <Route path="/capas" element={<CAPAs />} />
          <Route path="/audits" element={<Audits />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
