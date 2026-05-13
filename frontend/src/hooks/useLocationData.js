import { useState, useEffect } from 'react';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/v1' 
  : '/v1';

export function useLocationData() {
  const [stats, setStats] = useState({ provinces: 0, cities: 0, districts: 0, villages: 0 });
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [explorerLoading, setExplorerLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

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
      if (Array.isArray(data)) setProvinces(data);
    } catch (err) { console.error(err); }
  };

  const fetchCities = async (provCode) => {
    setExplorerLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cities?province_code=${provCode}`);
      const data = await res.json();
      if (Array.isArray(data)) setCities(data);
    } catch (err) { console.error(err); }
    finally { setExplorerLoading(false); }
  };

  const fetchDistricts = async (cityCode) => {
    setExplorerLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/districts?city_code=${cityCode}`);
      const data = await res.json();
      if (Array.isArray(data)) setDistricts(data);
    } catch (err) { console.error(err); }
    finally { setExplorerLoading(false); }
  };

  const fetchVillages = async (districtCode) => {
    setExplorerLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/villages?district_code=${districtCode}`);
      const data = await res.json();
      if (Array.isArray(data)) setVillages(data);
    } catch (err) { console.error(err); }
    finally { setExplorerLoading(false); }
  };

  return {
    stats,
    provinces,
    cities,
    districts,
    villages,
    loading,
    explorerLoading,
    fetchProvinces,
    fetchCities,
    fetchDistricts,
    fetchVillages,
    setCities,
    setDistricts,
    setVillages,
    API_BASE_URL
  };
}
