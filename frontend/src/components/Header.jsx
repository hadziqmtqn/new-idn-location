import React from 'react';
import { Search, ExternalLink } from 'lucide-react';

export default function Header({ search, onSearchChange, onSearchSubmit }) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/50 backdrop-blur-xl px-4 lg:px-8 sticky top-0 z-10">
      <div className="w-full flex-1">
        <form onSubmit={onSearchSubmit} className="relative group max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="search" 
            placeholder="Search everything..." 
            value={search} 
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-muted/50 pl-10 rounded-2xl border-none h-11 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60" 
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background border rounded-2xl text-[10px] font-black shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground tracking-widest">DATABASE: NEON</span>
        </div>
        <button className="h-10 w-10 rounded-2xl border bg-background flex items-center justify-center hover:bg-muted transition-all shadow-sm">
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
