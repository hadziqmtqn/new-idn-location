import React, { useState } from 'react';
import { useLocationData } from './hooks/useLocationData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import ExplorerView from './views/ExplorerView';
import DocsView from './views/DocsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  
  // Explorer Specific State
  const [selectedProv, setSelectedProv] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Custom Hook for all location data logic
  const {
    stats, provinces, cities, districts, villages,
    loading, explorerLoading, fetchProvinces,
    fetchCities, fetchDistricts, fetchVillages,
    setCities, setDistricts, setVillages, API_BASE_URL
  } = useLocationData();

  // Navigation handlers
  const handleProvinceSelect = (prov) => {
    setSelectedProv(prov);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setCities([]); 
    setDistricts([]); 
    setVillages([]);
    if (prov) fetchCities(prov.code);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
    setDistricts([]); 
    setVillages([]);
    if (city) fetchDistricts(city.code);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setVillages([]);
    if (district) fetchVillages(district.code);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProvinces(search);
    setActiveTab('dashboard');
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] bg-muted/20 text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col min-w-0">
        <Header 
          search={search} 
          onSearchChange={setSearch} 
          onSearchSubmit={handleSearchSubmit} 
        />

        <div className="flex-1 overflow-x-hidden">
          <main className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView 
                stats={stats} 
                loading={loading} 
                provinces={provinces}
                onProvinceClick={(p) => { 
                  handleProvinceSelect(p); 
                  setActiveTab('explorer'); 
                }}
                onDocsClick={() => setActiveTab('docs')}
              />
            )}
            
            {activeTab === 'explorer' && (
              <ExplorerView 
                provinces={provinces}
                cities={cities}
                districts={districts}
                villages={villages}
                selectedProv={selectedProv}
                selectedCity={selectedCity}
                selectedDistrict={selectedDistrict}
                explorerLoading={explorerLoading}
                onProvinceSelect={handleProvinceSelect}
                onCitySelect={handleCitySelect}
                onDistrictSelect={handleDistrictSelect}
                onBack={() => {
                    setActiveTab('dashboard');
                    setSelectedProv(null);
                    setSelectedCity(null);
                    setSelectedDistrict(null);
                }}
              />
            )}

            {activeTab === 'docs' && (
              <DocsView 
                baseUrl={API_BASE_URL} 
                onBack={() => setActiveTab('dashboard')} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
