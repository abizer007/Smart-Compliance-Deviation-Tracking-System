import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { CheckSquare, AlertCircle, Plus, Loader2 } from 'lucide-react';

export default function CAPAs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ deviationId: '', ownerId: '', action: '', deadline: '' });
  const queryClient = useQueryClient();
  const { data: capas, isLoading } = useQuery({
    queryKey: ['capas'],
    queryFn: async () => {
      const res = await api.get('/capa');
      return res.data;
    }
  });

  const { data: deviations } = useQuery({
    queryKey: ['deviations'],
    queryFn: async () => (await api.get('/deviation')).data
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/auth/users')).data
  });

  const mutation = useMutation({
    mutationFn: async (newCapa: any) => {
      const res = await api.post('/capa', newCapa);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      queryClient.invalidateQueries({ queryKey: ['deviations'] });
      setIsModalOpen(false);
      setFormData({ deviationId: '', ownerId: '', action: '', deadline: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="animate-pulse p-8">Gathering CAPAs...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold tracking-tight">Corrective and Preventive Actions</h2>
         <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
           <Plus className="h-4 w-4 mr-2" /> New CAPA
         </Button>
      </div>

      <div className="grid gap-4 mt-4">
        {capas?.map((capa: any) => (
          <Card key={capa.id} className="border-border">
            <CardHeader className="p-4 pb-2">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-medium">CAPA for Deviation #{capa.deviationId.substring(0, 8)}</CardTitle>
                  </div>
                  <Badge variant={capa.status === 'COMPLETED' ? 'success' : capa.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                    {capa.status.replace('_', ' ')}
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm">
               <div className="flex items-start gap-2 mb-3 mt-2">
                 <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                 <div>
                   <p className="font-medium text-foreground">{capa.deviation.title}</p>
                   <p className="text-muted-foreground line-clamp-1">{capa.deviation.description}</p>
                 </div>
               </div>
               <div className="bg-muted/50 p-3 rounded-md text-foreground mb-3 border border-border">
                 <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Action Required</p>
                 <p>{capa.action}</p>
               </div>
               <div className="flex justify-between text-muted-foreground text-xs mt-4">
                 <span>Assigned to: <span className="font-medium text-foreground">{capa.owner.name}</span></span>
                 <span className={new Date(capa.deadline) < new Date() ? 'text-destructive font-medium' : ''}>
                   Due: {new Date(capa.deadline).toLocaleDateString()}
                 </span>
               </div>
            </CardContent>
          </Card>
        ))}
        {capas?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No CAPAs assigned.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign New CAPA" description="Create a corrective or preventive action for an open deviation.">
         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
               <Label htmlFor="deviationId">Related Deviation</Label>
               <select 
                  id="deviationId" required
                  value={formData.deviationId} onChange={e => setFormData({...formData, deviationId: e.target.value})}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
               >
                  <option value="" disabled>Select a deviation</option>
                  {deviations?.filter((d: any) => d.status !== 'CLOSED').map((d: any) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
               </select>
            </div>
            <div className="space-y-2">
               <Label htmlFor="ownerId">Assign To</Label>
               <select 
                  id="ownerId" required
                  value={formData.ownerId} onChange={e => setFormData({...formData, ownerId: e.target.value})}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
               >
                  <option value="" disabled>Select an owner</option>
                  {users?.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
               </select>
            </div>
            <div className="space-y-2">
               <Label htmlFor="action">Action Required</Label>
               <textarea 
                  id="action" required 
                  value={formData.action} onChange={e => setFormData({...formData, action: e.target.value})}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe the corrective action steps..."
               />
            </div>
            <div className="space-y-2">
               <Label htmlFor="deadline">Deadline</Label>
               <Input type="date" id="deadline" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
            <div className="flex justify-end pt-4 gap-2">
               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button type="submit" disabled={mutation.isPending}>
                 {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                 Assign CAPA
               </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
}
