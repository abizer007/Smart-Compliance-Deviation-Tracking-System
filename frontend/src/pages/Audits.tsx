import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { ClipboardList, Plus, Loader2, Calendar, User, CheckCircle2, Circle, Pause } from 'lucide-react';

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  SCHEDULED:   { label: 'Scheduled',   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: Pause },
  IN_PROGRESS: { label: 'In Progress', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Circle },
  COMPLETED:   { label: 'Completed',   color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle2 },
};

const DEPT_COLORS: Record<string, string> = { IT: '#6366f1', Finance: '#f59e0b', HR: '#ec4899', Operations: '#14b8a6', Quality: '#22c55e' };

const SELECT_CLASS = "form-select";

export default function Audits() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', department: 'IT', date: '' });
  const qc = useQueryClient();

  const { data: audits, isLoading } = useQuery({ queryKey: ['audits'], queryFn: async () => (await api.get('/audit')).data });

  const mutation = useMutation({
    mutationFn: async (a: any) => (await api.post('/audit', a)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['audits'] }); setIsModalOpen(false); setForm({ name: '', department: 'IT', date: '' }); },
  });

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {[...Array(3)].map((_, i) => <div key={i} className="loading-shimmer" style={{ height: 68 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeSlideUp 0.4s both' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Internal Audits <span className="count">{audits?.length ?? 0}</span></h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'hsl(215,16%,50%)' }}>Schedule and track all compliance audits.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', borderRadius: '0.625rem', padding: '0 1rem', height: 38, fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
          <Plus size={15} /> Schedule Audit
        </Button>
      </div>

      <div style={{ background: '#fff', border: '1px solid hsl(220,13%,90%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 0, padding: '0.625rem 1.25rem', borderBottom: '1px solid hsl(220,13%,91%)', background: 'hsl(220,25%,98%)' }}>
          {['Audit Name', 'Department', 'Date', 'Auditor', 'Status'].map(col => (
            <span key={col} style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(215,16%,50%)' }}>{col}</span>
          ))}
        </div>

        {audits?.map((audit: any, i: number) => {
          const meta = STATUS_META[audit.status] ?? STATUS_META.SCHEDULED;
          const StatusIcon = meta.icon;
          const deptColor = DEPT_COLORS[audit.department] ?? '#6b7280';
          return (
            <div key={audit.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '0.875rem 1.25rem',
              borderBottom: i < audits.length - 1 ? '1px solid hsl(220,13%,93%)' : 'none',
              alignItems: 'center',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(220,25%,98.5%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6366f1', cursor: 'pointer' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.textDecoration = 'underline')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.textDecoration = 'none')}>
                  {audit.name}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '0.25rem', background: `${deptColor}15`, color: deptColor, border: `1px solid ${deptColor}30` }}>{audit.department}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'hsl(215,16%,45%)' }}>
                <Calendar size={12} />
                {new Date(audit.date).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>
                  {(audit.auditor?.name ?? 'U').charAt(0)}
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'hsl(215,16%,40%)', fontWeight: 500 }}>{audit.auditor?.name}</span>
              </div>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                  <StatusIcon size={10} /> {meta.label}
                </span>
              </div>
            </div>
          );
        })}
        {audits?.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(215,16%,55%)' }}>
            <ClipboardList size={36} style={{ opacity: 0.15, margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No audits recorded</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem' }}>Schedule the first internal compliance audit.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Audit" description="Plan a new internal compliance audit across departments.">
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <Label htmlFor="audit-name">Audit Name</Label>
            <Input id="audit-name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Q4 IT Security Review" style={{ marginTop: '0.375rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <Label>Department</Label>
              <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className={SELECT_CLASS} style={{ marginTop: '0.375rem' }}>
                {['IT','Finance','HR','Operations','Quality'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="audit-date">Audit Date</Label>
              <Input type="date" id="audit-date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ marginTop: '0.375rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff' }}>
              {mutation.isPending && <Loader2 size={13} className="animate-spin" style={{ marginRight: 6 }} />} Schedule Audit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
