import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export default function DocsView({ baseUrl, onBack }) {
  const endpoints = [
    { meth: 'GET', path: '/provinces', desc: 'Get all provinces. Parameter `q` for searching by name.' },
    { meth: 'GET', path: '/cities', desc: 'Get cities. Required `province_code` parameter.' },
    { meth: 'GET', path: '/districts', desc: 'Get districts. Required `city_code` parameter.' },
    { meth: 'GET', path: '/villages', desc: 'Get villages. Required `district_code` parameter.' },
    { meth: 'GET', path: '/stats', desc: 'Get count summary of all data levels.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-muted transition-all"><ArrowLeft className="h-4 w-4" /></button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">API Documentation</h1>
          <p className="text-xs text-muted-foreground">Standardized endpoints for developers.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>v1 Endpoints Reference</CardTitle>
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg w-fit mt-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Base URL:</span>
            <code className="text-xs font-mono font-bold">{baseUrl}</code>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {endpoints.map((api, i) => (
            <div key={i} className="group p-4 border rounded-2xl transition-all hover:bg-muted/20">
              <div className="flex items-center gap-4 mb-3">
                <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">GET</span>
                <code className="font-mono font-black text-sm text-primary">{api.path}</code>
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{api.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
