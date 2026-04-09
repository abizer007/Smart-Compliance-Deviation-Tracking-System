import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { CheckSquare, Plus, Loader2, AlertCircle, Clock, CheckCircle2, Timer } from 'lucide-react';

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  PENDING:     { label: 'Pending',     color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Timer },
  COMPLETED:   { label: 'Completed',   color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle2 },
  OVERDUE:     { label: 'Overdue',     color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: AlertCircle },
};

const SELECT_CLASS = "form-select";
const TEXTAREA_CLASS = "form-textarea";

export default function CAPAs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ deviationId: '', ownerId: '', action: '', deadline: '' });
  const qc = useQueryClient();

  const { data: capas, isLoading } = useQuery({ queryKey: ['capas'], queryFn: async () => (await api.get('/capa')).data });
  const { data: deviations } = useQuery({ queryKey: ['deviations'], queryFn: async () => (await api.get('/deviation')).data });
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: async () => (await api.get('/auth/users')).data });

  const mutation = useMutation({
    mutationFn: async (c: any) => (await api.post('/capa', c)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['capas'] }); qc.invalidateQueries({ queryKey: ['deviations'] }); setIsModalOpen(false); setForm({ deviationId: '', ownerId: '', action: '', deadline: '' }); },
  });

  if (isLoading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
      {[...Array(4)].map((_, i) => <div key={i} className="loading-shimmer" style={{ height: 160 }} />)}
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeSlideUp 0.4s both' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Corrective Actions <span className="count">{capas?.length ?? 0}</span></h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'hsl(215,16%,50%)' }}>Track CAPAs assigned to open deviations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', borderRadius: '0.625rem', padding: '0 1rem', height: 38, fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
          <Plus size={15} /> New CAPA
        </Button>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
        {capas?.map((capa: any) => {
          const meta = STATUS_META[capa.status] ?? STATUS_META.PENDING;
          const StatusIcon = meta.icon;
          const isOverdue = new Date(capa.deadline) < new Date() && capa.status !== 'COMPLETED';
          return (
            <div key={capa.id} className="card-hover" style={{
              background: '#fff',
              border: `1px solid hsl(220,13%,90%)`,
              borderRadius: '0.875rem',
              padding: '1.25rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '0.5rem', background: '#f0f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckSquare size={15} color="#6366f1" />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', background: 'hsl(220,14%,94%)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', color: 'hsl(215,16%,45%)' }}>#{capa.deviationId.substring(0, 8)}</span>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                  <StatusIcon size={11} /> {meta.label}
                </span>
              </div>

              {/* Deviation title */}
              <div style={{ background: 'hsl(220,25%,98%)', borderRadius: '0.625rem', padding: '0.75rem', border: '1px solid hsl(220,13%,92%)' }}>
                <p style={{ margin: '0 0 0.125rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(215,16%,50%)' }}>Related Deviation</p>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'hsl(224,71%,8%)' }}>{capa.deviation?.title}</p>
                {capa.deviation?.description && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'hsl(215,16%,55%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{capa.deviation.description}</p>}
              </div>

              {/* Action */}
              <div>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(215,16%,50%)' }}>Action Required</p>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'hsl(224,71%,12%)', lineHeight: 1.5 }}>{capa.action}</p>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.25rem', borderTop: '1px solid hsl(220,13%,93%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'hsl(215,16%,45%)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>
                    {(capa.owner?.name ?? 'U').charAt(0)}
                  </div>
                  <span style={{ fontWeight: 500 }}>{capa.owner?.name}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isOverdue ? '#dc2626' : 'hsl(215,16%,45%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={11} /> {new Date(capa.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
        {capas?.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: 'hsl(215,16%,55%)', background: '#fff', border: '1px solid hsl(220,13%,90%)', borderRadius: '1rem' }}>
            <CheckSquare size={36} style={{ opacity: 0.15, margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No CAPAs assigned</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign New CAPA" description="Create a corrective or preventive action for an open deviation.">
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <Label>Related Deviation</Label>
            <select required value={form.deviationId} onChange={e => setForm({...form, deviationId: e.target.value})} className={SELECT_CLASS} style={{ marginTop: '0.375rem' }}>
              <option value="" disabled>Select a deviation</option>
              {deviations?.filter((d: any) => d.status !== 'CLOSED').map((d: any) => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
          <div>
            <Label>Assign To</Label>
            <select required value={form.ownerId} onChange={e => setForm({...form, ownerId: e.target.value})} className={SELECT_CLASS} style={{ marginTop: '0.375rem' }}>
              <option value="" disabled>Select an owner</option>
              {users?.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          <div>
            <Label>Action Required</Label>
            <textarea required value={form.action} onChange={e => setForm({...form, action: e.target.value})} className={TEXTAREA_CLASS} style={{ minHeight: 80, marginTop: '0.375rem' }} placeholder="Describe the corrective action steps..." />
          </div>
          <div>
            <Label>Deadline</Label>
            <Input type="date" required value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} style={{ marginTop: '0.375rem' }} />
          </div>
          {mutation.isError && <p style={{ fontSize: '0.8125rem', color: '#dc2626', fontWeight: 500 }}>Failed to create CAPA. Please check all fields and date format.</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff' }}>
              {mutation.isPending && <Loader2 size={13} className="animate-spin" style={{ marginRight: 6 }} />} Assign CAPA
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
