import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Globe, 
  Search, 
  BarChart3, 
  Code2, 
  ExternalLink,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Info
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/v1';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Components
const Card = ({ children, className }) => (
  <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}>{children}</div>
);
const CardHeader = ({ children, className }) => <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h3>;
const CardDescription = ({ children, className }) => <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
const CardContent = ({ children, className }) => <div className={cn("p-6 pt-0", className)}>{children}</div>;

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ provinces: 0, cities: 0, districts: 0, villages: 0 });
  const [provinces, setProvinces] = useState([]);
  const [search, setSearch] = useState('');
  
  // Data Explorer State
  const [selectedProv, setSelectedProv] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchProvinces();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchProvinces = async (q = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/provinces${q ? `?q=${q}` : ''}`);
      const data = await res.json();
      setProvinces(data);
    } catch (err) { console.error(err); }
  };

  const fetchCities = async (provCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cities?province_code=${provCode}`);
      const data = await res.json();
      setCities(data);
    } catch (err) { console.error(err); }
  };

  const fetchDistricts = async (cityCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/districts?city_code=${cityCode}`);
      const data = await res.json();
      setDistricts(data);
    } catch (err) { console.error(err); }
  };

  const handleProvinceClick = (prov) => {
    setSelectedProv(prov);
    fetchCities(prov.code);
    setActiveTab('explorer');
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    fetchDistricts(city.code);
  };

  const renderDashboard = () => (
    <>
      <div className="flex items-center"><h1 className="text-lg font-semibold md:text-2xl">Overview</h1></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Provinces', val: stats.provinces, icon: Globe, desc: 'Total provinces' },
          { label: 'Cities', val: stats.cities, icon: MapPin, desc: 'Regencies & Cities' },
          { label: 'Districts', val: stats.districts, icon: BarChart3, desc: 'Sub-districts' },
          { label: 'Villages', val: stats.villages, icon: LayoutDashboard, desc: 'Desa & Kelurahan' },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? <Loader2 className="animate-spin h-5 w-5" /> : item.val.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader><CardTitle>Provinces</CardTitle><CardDescription>Real data from your database.</CardDescription></CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="h-12 px-4 text-left font-medium text-muted-foreground">Code</th><th className="h-12 px-4 text-left font-medium text-muted-foreground">Name</th><th className="h-12 px-4 text-right font-medium text-muted-foreground">Action</th></tr></thead>
                <tbody>
                  {provinces.slice(0, 7).map((p) => (
                    <tr key={p.code} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 font-mono">{p.code}</td>
                      <td className="p-4 font-semibold text-primary">{p.name}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleProvinceClick(p)} className="inline-flex items-center justify-center rounded-md text-sm hover:bg-accent h-8 w-8"><ChevronRight className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>System Info</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4 text-sm"><div className="h-2 w-2 rounded-full bg-green-500" /><span>API Status: Online</span></div>
            <div className="text-sm text-muted-foreground">Connected to Neon PostgreSQL v16.</div>
            <button onClick={() => setActiveTab('docs')} className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">View API Docs</button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderExplorer = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => { setActiveTab('dashboard'); setSelectedProv(null); setSelectedCity(null); }} className="rounded-full border p-2 hover:bg-muted"><ArrowLeft className="h-4 w-4" /></button>
        <h1 className="text-lg font-semibold md:text-2xl">Data Explorer</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">1. Select Province</CardTitle></CardHeader>
          <CardContent>
            <select 
              className="w-full p-2 border rounded-md bg-background text-sm"
              value={selectedProv?.code || ''}
              onChange={(e) => {
                const prov = provinces.find(p => p.code === e.target.value);
                setSelectedProv(prov);
                setSelectedCity(null);
                if (prov) fetchCities(prov.code);
              }}
            >
              <option value="">Select Province...</option>
              {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">2. Select City</CardTitle></CardHeader>
          <CardContent>
            <select 
              className="w-full p-2 border rounded-md bg-background text-sm"
              disabled={!selectedProv}
              value={selectedCity?.code || ''}
              onChange={(e) => {
                const city = cities.find(c => c.code === e.target.value);
                setSelectedCity(city);
                if (city) fetchDistricts(city.code);
              }}
            >
              <option value="">Select City...</option>
              {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">3. Districts in City</CardTitle></CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-auto text-sm space-y-1">
              {districts.length > 0 ? districts.map(d => (
                <div key={d.code} className="p-2 border rounded hover:bg-muted transition-colors flex justify-between">
                  <span>{d.name}</span>
                  <span className="text-muted-foreground font-mono text-xs">{d.code}</span>
                </div>
              )) : <p className="text-muted-foreground italic">No city selected.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveTab('dashboard')} className="rounded-full border p-2 hover:bg-muted"><ArrowLeft className="h-4 w-4" /></button>
        <h1 className="text-lg font-semibold md:text-2xl">API Documentation</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>v1 Endpoints</CardTitle><CardDescription>Base URL: http://localhost:3001/v1</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          {[
            { meth: 'GET', path: '/provinces', desc: 'Get all provinces. Query: ?q=name' },
            { meth: 'GET', path: '/cities', desc: 'Get cities. Query: ?province_code=11' },
            { meth: 'GET', path: '/districts', desc: 'Get districts. Query: ?city_code=1101' },
            { meth: 'GET', path: '/villages', desc: 'Get villages. Query: ?district_code=1101010' },
            { meth: 'GET', path: '/stats', desc: 'Get summary counts for all levels.' },
          ].map((api, i) => (
            <div key={i} className="p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">{api.meth}</span>
                <code className="font-mono font-bold text-sm">{api.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{api.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="#" onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 font-semibold"><MapPin className="h-6 w-6 text-primary" /><span>IDN Location</span></a>
          </div>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
            <button onClick={() => setActiveTab('dashboard')} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", activeTab === 'dashboard' ? "bg-muted text-primary" : "text-muted-foreground")}>
              <LayoutDashboard className="h-4 w-4" />Dashboard
            </button>
            <button onClick={() => setActiveTab('explorer')} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", activeTab === 'explorer' ? "bg-muted text-primary" : "text-muted-foreground")}>
              <Globe className="h-4 w-4" />Data Explorer
            </button>
            <button onClick={() => setActiveTab('docs')} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", activeTab === 'docs' ? "bg-muted text-primary" : "text-muted-foreground")}>
              <Code2 className="h-4 w-4" />API Docs
            </button>
          </nav>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <form onSubmit={(e) => { e.preventDefault(); fetchProvinces(search); setActiveTab('dashboard'); }}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input type="search" placeholder="Search provinces..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-background pl-8 rounded-md border h-9 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
            <button className="rounded-full border bg-background p-2 hover:bg-muted"><ExternalLink className="h-4 w-4" /></button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'explorer' && renderExplorer()}
          {activeTab === 'docs' && renderDocs()}
        </main>
      </div>
    </div>
  );
}
