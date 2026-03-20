import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { AlertCircle, Plus, Loader2 } from 'lucide-react';

export default function Deviations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', department: 'IT', severity: 'LOW' });
  const queryClient = useQueryClient();

  const { data: deviations, isLoading } = useQuery({
    queryKey: ['deviations'],
    queryFn: async () => {
      const res = await api.get('/deviation');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (newDeviation: any) => {
      const res = await api.post('/deviation', newDeviation);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviations'] });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', department: 'IT', severity: 'LOW' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="animate-pulse p-8 flex items-center gap-2">Gathering intelligence...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return 'default';
      case 'UNDER_REVIEW': return 'warning';
      case 'CAPA_ASSIGNED': return 'destructive';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'CRITICAL') return <Badge variant="destructive">Critical</Badge>;
    if (severity === 'HIGH') return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
    if (severity === 'MEDIUM') return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="secondary">Low</Badge>;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <div className="flex items-center gap-2">
           <AlertCircle className="h-6 w-6 text-primary" />
           <h2 className="text-3xl font-bold tracking-tight">Issues <span className="text-muted-foreground text-xl bg-muted px-2 py-0.5 rounded-full">{deviations?.length || 0}</span></h2>
         </div>
         <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
           <Plus className="h-4 w-4 mr-2" /> New Deviation
         </Button>
      </div>

      <Card className="border-border shadow-sm">
        <div className="bg-muted/50 border-b p-4 text-sm font-medium flex items-center justify-between">
           <div className="flex items-center gap-4">
              <span className="text-foreground">{deviations?.filter((d: any) => d.status !== 'CLOSED').length} Open</span>
              <span className="text-muted-foreground">{deviations?.filter((d: any) => d.status === 'CLOSED').length} Closed</span>
           </div>
        </div>
        <CardContent className="p-0 flex flex-col divide-y divide-border">
          {deviations?.map((dev: any) => (
            <div key={dev.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-3">
               <AlertCircle className={`h-5 w-5 mt-0.5 ${dev.status === 'CLOSED' ? 'text-purple-500' : 'text-green-500'}`} />
               <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-start justify-between">
                     <span className="font-semibold text-base hover:text-primary cursor-pointer">{dev.title}</span>
                     {getSeverityBadge(dev.severity)}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                     <span>#{dev.id.substring(0, 8)} opened on {new Date(dev.createdAt).toLocaleDateString()} by {dev.reportedBy.name}</span>
                     <span>•</span>
                     <Badge variant={getStatusColor(dev.status) as any} className="text-[10px] px-1.5 py-0 leading-none h-4 rounded-sm">{dev.status.replace('_', ' ')}</Badge>
                     {dev.sop && (
                       <>
                         <span>•</span>
                         <span className="flex items-center gap-1"><span className="opacity-70">SOP:</span> {dev.sop.title}</span>
                       </>
                     )}
                  </div>
               </div>
            </div>
          ))}
          {deviations?.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
               <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
               <p className="text-lg font-medium">No deviations reported</p>
               <p className="text-sm">When deviations are reported, you'll see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report New Deviation" description="Log a new compliance deviation or issue.">
         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
               <Label htmlFor="title">Title</Label>
               <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Brief description of the issue" />
            </div>
            <div className="space-y-2">
               <Label htmlFor="description">Detailed Description</Label>
               <textarea 
                  id="description" required 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Explain what happened in detail..."
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <select 
                     id="department" 
                     value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                     className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                     <option value="IT">IT</option>
                     <option value="Finance">Finance</option>
                     <option value="HR">HR</option>
                     <option value="Operations">Operations</option>
                     <option value="Quality">Quality</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <select 
                     id="severity" 
                     value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}
                     className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                     <option value="LOW">Low</option>
                     <option value="MEDIUM">Medium</option>
                     <option value="HIGH">High</option>
                     <option value="CRITICAL">Critical</option>
                  </select>
               </div>
            </div>
            <div className="flex justify-end pt-4 gap-2">
               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button type="submit" disabled={mutation.isPending}>
                 {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                 Submit Report
               </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
}
