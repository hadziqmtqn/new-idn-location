import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ExplorerView({ 
  provinces, cities, districts, villages, 
  selectedProv, selectedCity, selectedDistrict,
  onProvinceSelect, onCitySelect, onDistrictSelect,
  explorerLoading, onBack 
}) {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-muted transition-all"><ArrowLeft className="h-4 w-4" /></button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Data Explorer</h1>
          <p className="text-xs text-muted-foreground">Browse all levels of Indonesia administrative regions.</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Step 1: Province */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">1. Provinsi</label>
          <div className="flex flex-col gap-2 max-h-[600px] overflow-auto pr-2 custom-scrollbar">
            {provinces.map(p => (
              <button 
                key={p.code} 
                onClick={() => onProvinceSelect(p)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border text-left text-sm font-bold transition-all",
                  selectedProv?.code === p.code ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-card hover:border-primary/50"
                )}
              >
                <span>{p.name}</span>
                <span className="text-[10px] font-mono opacity-50">{p.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: City */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">2. Kota / Kab</label>
          <div className="flex flex-col gap-2 max-h-[600px] overflow-auto pr-2 custom-scrollbar">
            {cities.length > 0 ? cities.map(c => (
              <button 
                key={c.code} 
                onClick={() => onCitySelect(c)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border text-left text-sm font-bold transition-all",
                  selectedCity?.code === c.code ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-card hover:border-primary/50"
                )}
              >
                <span>{c.name}</span>
                <span className="text-[10px] font-mono opacity-50">{c.code}</span>
              </button>
            )) : (
              <div className="h-20 flex items-center justify-center border border-dashed rounded-xl text-xs text-muted-foreground italic text-center p-4">
                {selectedProv ? (explorerLoading ? 'Loading cities...' : 'No cities found') : 'Select province first'}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: District */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">3. Kecamatan</label>
          <div className="flex flex-col gap-2 max-h-[600px] overflow-auto pr-2 custom-scrollbar">
            {districts.length > 0 ? districts.map(d => (
              <button 
                key={d.code} 
                onClick={() => onDistrictSelect(d)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border text-left text-sm font-bold transition-all",
                  selectedDistrict?.code === d.code ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-card hover:border-primary/50"
                )}
              >
                <span>{d.name}</span>
                <span className="text-[10px] font-mono opacity-50">{d.code}</span>
              </button>
            )) : (
              <div className="h-20 flex items-center justify-center border border-dashed rounded-xl text-xs text-muted-foreground italic text-center p-4">
                {selectedCity ? (explorerLoading ? 'Loading districts...' : 'No districts found') : 'Select city first'}
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Village */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">4. Desa / Kelurahan</label>
          <div className="flex flex-col gap-2 max-h-[600px] overflow-auto pr-2 custom-scrollbar">
            {villages.length > 0 ? villages.map(v => (
              <div 
                key={v.code} 
                className="flex items-center justify-between p-3 rounded-xl border bg-emerald-50/10 border-emerald-500/20 text-left text-sm font-bold animate-in zoom-in-95 duration-200"
              >
                <div className="flex flex-col">
                    <span className="text-emerald-700">{v.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{v.code}</span>
                </div>
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              </div>
            )) : (
              <div className="h-20 flex items-center justify-center border border-dashed border-emerald-500/30 bg-emerald-50/5 rounded-xl text-xs text-muted-foreground italic text-center p-4">
                {selectedDistrict ? (explorerLoading ? 'Loading villages...' : 'No villages found') : 'Select district first'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
