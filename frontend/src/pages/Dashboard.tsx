import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { AlertCircle, CheckSquare, FileText, Search } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-muted-foreground animate-pulse flex items-center gap-2">Gathering intelligence...</div>;

  const summary = data?.summary || {};
  const severityData = data?.deviationsBySeverity || [];

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
         <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Overview</h2>
         <p className="text-muted-foreground">Welcome back. Here is your compliance status for today.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass card-hover border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-full">
               <CheckSquare className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{summary.complianceScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Target &gt; 95% threshold</p>
          </CardContent>
        </Card>
        
        <Card className="glass card-hover border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Deviations</CardTitle>
            <div className="p-2 bg-red-500/10 rounded-full">
               <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{summary.openDeviations}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {summary.totalDeviations} total</p>
          </CardContent>
        </Card>

        <Card className="glass card-hover border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending CAPAs</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-full">
               <FileText className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{summary.pendingCapas}</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate action</p>
          </CardContent>
        </Card>

        <Card className="glass card-hover border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
               <Search className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.audits}</div>
            <p className="text-xs text-muted-foreground mt-1">Historical records</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass relative overflow-hidden">
          <CardHeader>
            <CardTitle>Deviation Trend by Severity</CardTitle>
            <p className="text-xs text-muted-foreground">Breakdown of reported deviations.</p>
          </CardHeader>
          <CardContent className="pl-0 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="severity" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="url(#colorPrimary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 glass relative overflow-hidden">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <p className="text-xs text-muted-foreground">Proportional view of issue severity.</p>
          </CardHeader>
          <CardContent className="h-[320px] pb-8 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="severity"
                    stroke="none"
                  >
                    {severityData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
