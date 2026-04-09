import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { FileText, Plus, Loader2, Trash2, Edit, File } from 'lucide-react';

const SELECT_CLASS = "form-select";

export default function SOPs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSopId, setEditingSopId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', department: 'IT', content: '' });
  const [editForm, setEditForm] = useState({ content: '' });
  const qc = useQueryClient();

  const { data: sops, isLoading } = useQuery({ queryKey: ['sops'], queryFn: async () => (await api.get('/sop')).data });

  const createMutation = useMutation({
    mutationFn: async (d: any) => (await api.post('/sop', d)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sops'] }); setIsModalOpen(false); setForm({ title: '', description: '', department: 'IT', content: '' }); },
  });

  const editMutation = useMutation({
    mutationFn: async (p: { id: string; d: any }) => (await api.post(`/sop/${p.id}/versions`, p.d)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sops'] }); setIsEditModalOpen(false); setEditingSopId(null); setEditForm({ content: '' }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/sop/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sops'] }),
  });

  const openEdit = (sop: any) => {
    setEditingSopId(sop.id);
    setEditForm({ content: sop.versions?.[0]?.content ?? '' });
    setIsEditModalOpen(true);
  };

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {[...Array(3)].map((_, i) => <div key={i} className="loading-shimmer" style={{ height: 56 }} />)}
    </div>
  );

  const DEPT_COLORS: Record<string, string> = { IT: '#6366f1', Finance: '#f59e0b', HR: '#ec4899', Operations: '#14b8a6', Quality: '#22c55e' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeSlideUp 0.4s both' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Standard Operating Procedures <span className="count">{sops?.length ?? 0}</span></h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'hsl(215,16%,50%)' }}>All company-wide compliance documents.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', borderRadius: '0.625rem', padding: '0 1rem', height: 38, fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
          <Plus size={15} /> New SOP
        </Button>
      </div>

      {/* Document list */}
      <div style={{ background: '#fff', border: '1px solid hsl(220,13%,90%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        {/* Repo header */}
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220,13%,91%)', background: 'hsl(220,25%,98%)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <FileText size={15} color="#6366f1" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'hsl(224,71%,10%)' }}>compliance-hub / sops</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.1rem 0.5rem', borderRadius: '9999px', background: '#f0f0ff', color: '#6366f1', border: '1px solid #e0e0ff' }}>{sops?.length ?? 0} documents</span>
        </div>

        {sops?.map((sop: any, i: number) => {
          const deptColor = DEPT_COLORS[sop.department] ?? '#6b7280';
          const latestVersion = sop.versions?.[0]?.version ?? 1;
          return (
            <div key={sop.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem',
              padding: '0.875rem 1.25rem',
              borderBottom: i < sops.length - 1 ? '1px solid hsl(220,13%,93%)' : 'none',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(220,25%,98.5%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <File size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6366f1', cursor: 'pointer' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.textDecoration = 'underline')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.textDecoration = 'none')}>
                    {sop.title}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '0.25rem', background: `${deptColor}15`, color: deptColor, border: `1px solid ${deptColor}30` }}>{sop.department}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: '0.25rem', background: 'hsl(220,14%,94%)', color: 'hsl(215,16%,45%)' }}>v{latestVersion}</span>
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: 'hsl(215,16%,55%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sop.description}</p>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'hsl(215,16%,55%)', white_space: 'nowrap', flexShrink: 0 }}>{new Date(sop.updatedAt).toLocaleDateString()}</span>
              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                <button onClick={() => openEdit(sop)} style={{ width: 30, height: 30, borderRadius: '0.375rem', border: '1px solid hsl(220,13%,89%)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'hsl(215,16%,50%)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.color = '#6366f1'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(220,13%,89%)'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(215,16%,50%)' }}>
                  <Edit size={13} />
                </button>
                <button onClick={() => deleteMutation.mutate(sop.id)} style={{ width: 30, height: 30, borderRadius: '0.375rem', border: '1px solid hsl(220,13%,89%)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'hsl(215,16%,50%)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(220,13%,89%)'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(215,16%,50%)'; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
        {sops?.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(215,16%,55%)' }}>
            <FileText size={36} style={{ opacity: 0.15, margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No SOPs yet</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem' }}>Create your first standard operating procedure.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New SOP" description="Add a new standard operating procedure.">
        <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <Label htmlFor="sop-title">Document Title</Label>
            <Input id="sop-title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Safety Data Handling V2" style={{ marginTop: '0.375rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <Label>Department</Label>
              <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className={SELECT_CLASS} style={{ marginTop: '0.375rem' }}>
                {['IT','Finance','HR','Operations','Quality'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="sop-desc">Short Description</Label>
              <Input id="sop-desc" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief overview" style={{ marginTop: '0.375rem' }} />
            </div>
          </div>
          <div>
            <Label htmlFor="sop-content">Initial Content (Markdown)</Label>
            <textarea id="sop-content" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="form-textarea mono" style={{ minHeight: 140, marginTop: '0.375rem' }} placeholder="# Introduction&#10;..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff' }}>
              {createMutation.isPending && <Loader2 size={13} className="animate-spin" style={{ marginRight: 6 }} />} Create SOP
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit SOP" description="Update the content to create a new version.">
        <form onSubmit={e => { e.preventDefault(); if (editingSopId) editMutation.mutate({ id: editingSopId, d: editForm }); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <Label>SOP Content (Markdown)</Label>
            <textarea required value={editForm.content} onChange={e => setEditForm({ content: e.target.value })} className="form-textarea mono" style={{ minHeight: 280, marginTop: '0.375rem' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={editMutation.isPending} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff' }}>
              {editMutation.isPending && <Loader2 size={13} className="animate-spin" style={{ marginRight: 6 }} />} Update SOP
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
