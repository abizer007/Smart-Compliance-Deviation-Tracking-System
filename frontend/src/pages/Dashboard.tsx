import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckSquare, FileText, ClipboardList, TrendingUp, TrendingDown, Shield } from 'lucide-react';

const SEVERITY_COLORS: Record<string, string> = {
  LOW      : '#22c55e',
  MEDIUM   : '#f59e0b',
  HIGH     : '#ef4444',
  CRITICAL : '#7c3aed',
};

function StatCard({
  label, value, sub, color, icon: Icon, trend,
}: {
  label: string; value: string | number; sub: string; color: string;
  icon: React.ElementType; trend?: 'up' | 'down' | null;
}) {
  return (
    <div className={`stat-card ${color}`} style={{ animation: 'fadeSlideUp 0.4s both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(215,16%,47%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: '0.625rem',
          background: color === 'green' ? '#dcfce7' : color === 'red' ? '#fee2e2' : color === 'amber' ? '#fef3c7' : '#e0e7ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color === 'green' ? '#16a34a' : color === 'red' ? '#dc2626' : color === 'amber' ? '#d97706' : '#4f46e5'} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'hsl(224,71%,8%)', lineHeight: 1 }}>{value}</span>
        {trend && (
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: trend === 'up' ? '#16a34a' : '#dc2626' }}>
            {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          </span>
        )}
      </div>
      <p style={{ margin: '0.375rem 0 0', fontSize: '0.75rem', color: 'hsl(215,16%,52%)' }}>{sub}</p>
    </div>
  );
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid hsl(220,13%,89%)', borderRadius: '0.75rem', padding: '0.625rem 0.875rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'hsl(224,71%,8%)' }}>{label}</p>
        <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: 'hsl(215,16%,47%)' }}>{payload[0].value} deviation{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => (await api.get('/analytics')).data,
  });

  if (isLoading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {[...Array(4)].map((_, i) => <div key={i} className="loading-shimmer" style={{ height: 120 }} />)}
    </div>
  );

  const summary = data?.summary || {};
  const severityData: any[] = data?.deviationsBySeverity || [];

  const score = summary.complianceScore ?? 0;
  const scoreColor = score >= 90 ? '#16a34a' : score >= 70 ? '#d97706' : '#dc2626';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeSlideUp 0.4s both' }}>

      {/* Page heading */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 800, color: 'hsl(224,71%,8%)', letterSpacing: '-0.02em' }}>Compliance Overview</h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'hsl(215,16%,50%)' }}>Real-time metrics across all departments and operations.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard label="Compliance Score" value={`${score}%`} sub="Target ≥ 95%" color="green" icon={CheckSquare} trend={score >= 90 ? 'up' : 'down'} />
        <StatCard label="Open Deviations" value={summary.openDeviations ?? 0} sub={`of ${summary.totalDeviations ?? 0} total reported`} color="red" icon={AlertCircle} />
        <StatCard label="Pending CAPAs" value={summary.pendingCapas ?? 0} sub="Require immediate action" color="amber" icon={FileText} />
        <StatCard label="Total Audits" value={summary.audits ?? 0} sub="Historical audit records" color="blue" icon={ClipboardList} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1rem', marginBottom: '1.75rem' }}>

        {/* Bar chart */}
        <div style={{ background: '#fff', border: '1px solid hsl(220,13%,90%)', borderRadius: '1rem', padding: '1.375rem 1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(224,71%,8%)' }}>Deviations by Severity</h3>
              <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: 'hsl(215,16%,50%)' }}>Breakdown of all reported compliance issues</p>
            </div>
            <Shield size={18} color='#6366f1' />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={severityData} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                {severityData.map((entry: any) => (
                  <linearGradient key={entry.severity} id={`grad-${entry.severity}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SEVERITY_COLORS[entry.severity] ?? '#6366f1'} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={SEVERITY_COLORS[entry.severity] ?? '#6366f1'} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="severity" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {severityData.map((entry: any) => (
                  <Cell key={entry.severity} fill={`url(#grad-${entry.severity})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut + score */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Donut chart */}
          <div style={{ flex: 1, background: '#fff', border: '1px solid hsl(220,13%,90%)', borderRadius: '1rem', padding: '1.375rem 1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(224,71%,8%)' }}>Severity Distribution</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(215,16%,50%)' }}>Proportional breakdown</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={severityData} dataKey="count" nameKey="severity" innerRadius={50} outerRadius={72} paddingAngle={4} stroke="none">
                  {severityData.map((entry: any, i: number) => (
                    <Cell key={i} fill={SEVERITY_COLORS[entry.severity] ?? '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(220,13%,89%)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginTop: 'auto' }}>
              {severityData.map((entry: any) => (
                <div key={entry.severity} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', fontWeight: 600, color: 'hsl(215,16%,47%)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: SEVERITY_COLORS[entry.severity] ?? '#6366f1', flexShrink: 0 }} />
                  {entry.severity} ({entry.count})
                </div>
              ))}
            </div>
          </div>

          {/* Score gauge card */}
          <div style={{
            background: '#fff',
            border: '1px solid hsl(220,13%,90%)',
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(220,14%,93%)" strokeWidth="7" />
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke={scoreColor}
                  strokeWidth="7"
                  strokeDasharray={`${(score / 100) * 163.4} 163.4`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                  style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, color: scoreColor }}>{score}%</div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: 'hsl(224,71%,8%)' }}>Compliance Health</p>
              <p style={{ margin: '0.125rem 0 0', fontSize: '0.7rem', color: 'hsl(215,16%,50%)' }}>Target threshold: 95%</p>
              <div style={{ marginTop: '0.5rem', height: 4, borderRadius: '9999px', background: 'hsl(220,14%,93%)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: scoreColor, borderRadius: '9999px', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
