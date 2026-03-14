import React from 'react';

const MOCK_OVERVIEW = {
  openDeviations: 12,
  pendingCapas: 5,
  upcomingAudits: 3,
  capaClosureRate: 78,
};

const DashboardPage: React.FC = () => {
  const data = MOCK_OVERVIEW;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Open deviations', value: data.openDeviations },
          { label: 'Pending CAPA', value: data.pendingCapas },
          { label: 'Upcoming audits', value: data.upcomingAudits },
          { label: 'CAPA closure rate', value: `${data.capaClosureRate}%` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-[#30363d] bg-[#161b22] p-4"
          >
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-400">
        Demo data. Connect a backend later for live analytics.
      </p>
    </div>
  );
};

export default DashboardPage;
