import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { FileText, Plus, File, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SOPs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', department: 'IT', content: '' });
  const queryClient = useQueryClient();
  const { data: sops, isLoading } = useQuery({
    queryKey: ['sops'],
    queryFn: async () => {
      const res = await api.get('/sop');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (newSOP: any) => {
      const res = await api.post('/sop', newSOP);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sops'] });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', department: 'IT', content: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="animate-pulse p-8">Gathering SOPs...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold tracking-tight">Standard Operating Procedures</h2>
         <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
           <Plus className="h-4 w-4 mr-2" /> New SOP
         </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/50 border-b p-4">
           <div className="flex items-center gap-2">
             <FileText className="h-5 w-5 text-muted-foreground" />
             <CardTitle className="text-sm font-medium">abizer007 / compliance-sops</CardTitle>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Latest Commit</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sops?.map((sop: any) => (
                <TableRow key={sop.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-primary hover:underline cursor-pointer">{sop.title}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[200px]">
                     {sop.description}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(sop.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {sops?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No SOPs found. Create one.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New SOP" description="Add a new standard operating procedure to the tracking system.">
         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
               <Label htmlFor="title">Document Title</Label>
               <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Safety Data Handling V2" />
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
                  <Label htmlFor="description">Short Description</Label>
                  <Input id="description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief overview" />
               </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="content">Initial Content (Markdown supported)</Label>
               <textarea 
                  id="content" required 
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="# Introduction..."
               />
            </div>
            <div className="flex justify-end pt-4 gap-2">
               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button type="submit" disabled={mutation.isPending}>
                 {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                 Create SOP
               </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
}
