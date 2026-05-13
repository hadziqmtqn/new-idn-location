import React from 'react';
import { Globe, Building2, MapPin, Home, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export default function DashboardView({ stats, loading, provinces, onProvinceClick, onDocsClick }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">Real-time statistics of Indonesia administrative regions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Provinces', val: stats.provinces, icon: Globe, desc: 'Provinsi', color: 'text-blue-500' },
          { label: 'Cities', val: stats.cities, icon: Building2, desc: 'Kota / Kabupaten', color: 'text-indigo-500' },
          { label: 'Districts', val: stats.districts, icon: MapPin, desc: 'Kecamatan', color: 'text-rose-500' },
          { label: 'Villages', val: stats.villages, icon: Home, desc: 'Desa / Kelurahan', color: 'text-emerald-500' },
        ].map((item, i) => (
          <Card key={i} className="overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{item.label}</CardTitle>
              <item.icon className={item.color + " h-4 w-4"} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{loading ? <Loader2 className="animate-spin h-6 w-6" /> : (item.val?.toLocaleString() || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{item.desc}</p>
            </CardContent>
            <div className={item.color + " absolute bottom-0 left-0 h-1 w-full opacity-20 bg-current"} />
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Provinces</CardTitle>
              <CardDescription>Click a province to explore its cities.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {provinces.slice(0, 6).map((p) => (
                <div key={p.code} onClick={() => onProvinceClick(p)} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold font-mono">{p.code}</span>
                    <span className="font-bold text-sm group-hover:translate-x-1 transition-transform">{p.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Quick Access</CardTitle>
            <CardDescription>Integrate in seconds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-dashed flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active Endpoint</span>
              </div>
              <code className="text-[10px] font-mono break-all font-bold">GET /v1/provinces</code>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span>CORS Enabled</span>
            </div>
            <button onClick={onDocsClick} className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition-all">Documentation</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
