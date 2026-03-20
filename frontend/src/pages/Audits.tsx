import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Search, Plus, Calendar, User, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Audits() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: 'IT', date: '' });
  const queryClient = useQueryClient();
  const { data: audits, isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      const res = await api.get('/audit');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (newAudit: any) => {
      const res = await api.post('/audit', newAudit);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      setIsModalOpen(false);
      setFormData({ name: '', department: 'IT', date: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="animate-pulse p-8">Gathering Audits...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold tracking-tight">Internal Audits</h2>
         <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
           <Plus className="h-4 w-4 mr-2" /> Schedule Audit
         </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/50 border-b p-4">
           <div className="flex items-center gap-2">
             <Search className="h-5 w-5 text-muted-foreground" />
             <CardTitle className="text-sm font-medium">Audit History</CardTitle>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audit Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits?.map((audit: any) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium text-primary hover:underline cursor-pointer">
                    {audit.name}
                  </TableCell>
                  <TableCell>{audit.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(audit.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {audit.auditor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={audit.status === 'COMPLETED' ? 'success' : audit.status === 'IN_PROGRESS' ? 'warning' : 'secondary'}>
                      {audit.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {audits?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audits recorded.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Audit" description="Plan a new internal compliance audit across departments.">
         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
               <Label htmlFor="name">Audit Name</Label>
               <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Q4 IT Security Review" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="department">Department to Audit</Label>
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
                  <Label htmlFor="date">Audit Date</Label>
                  <Input type="date" id="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
               </div>
            </div>
            <div className="flex justify-end pt-4 gap-2">
               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button type="submit" disabled={mutation.isPending}>
                 {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                 Schedule Session
               </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
}
