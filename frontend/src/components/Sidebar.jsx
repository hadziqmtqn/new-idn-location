import React from 'react';
import { MapPin, LayoutDashboard, Globe, Code2, Github } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'explorer', icon: Globe, label: 'Explorer' },
    { id: 'docs', icon: Code2, label: 'Developer API' },
  ];

  return (
    <div className="hidden border-r bg-background/50 backdrop-blur-xl md:block sticky top-0 h-screen">
      <div className="flex h-full flex-col gap-6 py-6">
        <div className="px-6">
          <a href="#" onClick={() => onTabChange('dashboard')} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-none tracking-tight">IDN Location</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Admin Panel</span>
            </div>
          </a>
        </div>
        
        <div className="px-3 flex-1">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 mt-auto">
          <div className="p-4 rounded-2xl bg-muted/50 border space-y-3">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Connect with me</p>
              <div className="flex items-center gap-3">
                  <a href="https://github.com/hadziqmtqn/new-idn-location" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-background border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <Github className="h-4 w-4" />
                  </a>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
