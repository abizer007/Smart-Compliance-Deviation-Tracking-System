import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { AlertCircle, Plus, Loader2, Circle, CheckCircle2 } from 'lucide-react';

const SEVERITY_META: Record<string, { label: string; cls: string; dot: string }> = {
  CRITICAL: { label: 'Critical', cls: 'severity-critical', dot: '#7c3aed' },
  HIGH:     { label: 'High',     cls: 'severity-high',     dot: '#ef4444' },
  MEDIUM:   { label: 'Medium',   cls: 'severity-medium',   dot: '#f59e0b' },
  LOW:      { label: 'Low',      cls: 'severity-low',      dot: '#22c55e' },
};

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  REPORTED:      { color: '#2563eb', bg: '#eff6ff',  label: 'Reported' },
  UNDER_REVIEW:  { color: '#d97706', bg: '#fffbeb',  label: 'Under Review' },
  CAPA_ASSIGNED: { color: '#7c3aed', bg: '#f5f3ff',  label: 'CAPA Assigned' },
  RESOLVED:      { color: '#16a34a', bg: '#f0fdf4',  label: 'Resolved' },
  CLOSED:        { color: '#6b7280', bg: '#f9fafb',  label: 'Closed' },
};

const SELECT_CLASS = "form-select";
const TEXTAREA_CLASS = "form-textarea";

export default function Deviations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', department: 'IT', severity: 'LOW' });
  const qc = useQueryClient();

  const { data: deviations, isLoading } = useQuery({
    queryKey: ['deviations'],
    queryFn: async () => (await api.get('/deviation')).data,
  });

  const mutation = useMutation({
    mutationFn: async (d: any) => (await api.post('/deviation', d)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['deviations'] }); setIsModalOpen(false); setForm({ title: '', description: '', department: 'IT', severity: 'LOW' }); },
  });

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[...Array(3)].map((_, i) => <div key={i} className="loading-shimmer" style={{ height: 88 }} />)}
    </div>
  );

  const open   = deviations?.filter((d: any) => d.status !== 'CLOSED').length ?? 0;
  const closed = deviations?.filter((d: any) => d.status === 'CLOSED').length ?? 0;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeSlideUp 0.4s both' }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            Deviations
            <span className="count">{deviations?.length ?? 0}</span>
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'hsl(215,16%,50%)' }}>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>{open}</span> open &nbsp;·&nbsp;
            <span style={{ color: '#6b7280', fontWeight: 600 }}>{closed}</span> closed
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', borderRadius: '0.625rem', padding: '0 1rem', height: 38, fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
          <Plus size={15} /> Report Deviation
        </Button>
      </div>

      {/* List */}
      <div style={{ background: '#fff', border: '1px solid hsl(220,13%,90%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        {/* Tabs bar */}
        <div style={{ display: 'flex', gap: '1.5rem', padding: '0 1.25rem', borderBottom: '1px solid hsl(220,13%,90%)', background: 'hsl(220,25%,98%)' }}>
          {[
            { label: `${open} Open`, active: true },
            { label: `${closed} Closed`, active: false },
          ].map(t => (
            <div key={t.label} style={{
              padding: '0.75rem 0', fontSize: '0.8125rem', fontWeight: 600,
              color: t.active ? '#6366f1' : 'hsl(215,16%,50%)',
              borderBottom: t.active ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer', userSelect: 'none',
            }}>{t.label}</div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {deviations?.map((dev: any, i: number) => {
            const sev = SEVERITY_META[dev.severity] ?? SEVERITY_META.LOW;
            const sta = STATUS_META[dev.status] ?? STATUS_META.REPORTED;
            const isClosed = dev.status === 'CLOSED' || dev.status === 'RESOLVED';
            return (
              <div key={dev.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.875rem',
                padding: '1rem 1.25rem',
                borderBottom: i < deviations.length - 1 ? '1px solid hsl(220,13%,93%)' : 'none',
                transition: 'background 0.1s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'hsl(220,25%,98.5%)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {isClosed
                  ? <CheckCircle2 size={18} style={{ color: '#16a34a', marginTop: 2, flexShrink: 0 }} />
                  : <Circle size={18} style={{ color: '#6366f1', marginTop: 2, flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'hsl(224,71%,8%)' }}>{dev.title}</span>
                    <span className={`badge-pill ${sev.cls}`}>{sev.label}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '9999px', background: sta.bg, color: sta.color }}>
                      {sta.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'hsl(215,16%,55%)', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', background: 'hsl(220,14%,94%)', padding: '0 0.3rem', borderRadius: '0.25rem' }}>#{dev.id.substring(0, 8)}</span>
                    <span>opened {new Date(dev.createdAt).toLocaleDateString()} by</span>
                    <span style={{ fontWeight: 600, color: 'hsl(215,16%,40%)' }}>{dev.reportedBy?.name}</span>
                    {dev.sop && <><span>·</span><span>SOP: {dev.sop.title}</span></>}
                  </div>
                </div>
              </div>
            );
          })}
          {deviations?.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(215,16%,55%)' }}>
              <AlertCircle size={36} style={{ opacity: 0.2, margin: '0 auto 0.75rem' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No deviations reported</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem' }}>When deviations are reported, they will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report New Deviation" description="Log a new compliance deviation or issue.">
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <Label htmlFor="dev-title">Title</Label>
            <Input id="dev-title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Brief description of the issue" style={{ marginTop: '0.375rem' }} />
          </div>
          <div>
            <Label htmlFor="dev-desc">Detailed Description</Label>
            <textarea id="dev-desc" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={TEXTAREA_CLASS} style={{ minHeight: 90, marginTop: '0.375rem' }} placeholder="Explain what happened in detail..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <Label htmlFor="dev-dept">Department</Label>
              <select id="dev-dept" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className={SELECT_CLASS} style={{ marginTop: '0.375rem' }}>
                {['IT','Finance','HR','Operations','Quality'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="dev-sev">Severity</Label>
              <select id="dev-sev" value={form.severity} onChange={e => setForm({...form, severity: e.target.value})} className={SELECT_CLASS} style={{ marginTop: '0.375rem' }}>
                <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff' }}>
              {mutation.isPending && <Loader2 size={13} className="animate-spin" style={{ marginRight: 6 }} />} Submit Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
