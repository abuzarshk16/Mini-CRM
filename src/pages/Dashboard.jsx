import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LeadTable from '../components/LeadTable';
import LeadForm from '../components/LeadForm';
import { Plus, Search, Filter, TrendingUp, PieChart as PieChartIcon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ new: 0, contacted: 0, converted: 0 });
  const [globalStats, setGlobalStats] = useState({ new: 0, contacted: 0, converted: 0 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [error, setError] = useState('');

  const fetchLeads = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        search: filters.search,
        status: filters.status,
      });
      const response = await api.get(`/leads?${params.toString()}`);
      setLeads(response.data.data);
      setPagination(response.data.pagination);
      setStats(response.data.stats);
      setGlobalStats(response.data.globalStats);
      setError('');
    } catch (err) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeads(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads(pagination.page);
      } catch (err) {
        alert('Failed to delete lead');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      fetchLeads(pagination.page);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    // Clear filters to ensure the new lead is visible in "All Leads"
    // This will trigger the fetchLeads(1) via the useEffect hook
    setFilters({ search: '', status: '' });
  };

  const chartData = [
    { name: 'New', value: globalStats.new, color: '#2563eb' },
    { name: 'Contacted', value: globalStats.contacted, color: '#f59e0b' },
    { name: 'Converted', value: globalStats.converted, color: '#10b981' },
  ];

  const totalUserLeads = globalStats.new + globalStats.contacted + globalStats.converted;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lead Management Dashboard</h1>
          <p className="text-sm text-slate-500">Track and manage your sales pipeline efficiency</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Charts and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Pipeline Analytics</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Distribution across stages</span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Pipeline</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalUserLeads}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <User className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {totalUserLeads > 0 ? ((stats.converted / totalUserLeads) * 100).toFixed(1) : 0}%
              </h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status Distribution</p>
              <PieChartIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table Section */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="flex-1 md:w-48 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <div className="card w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
              <h2 className="text-xl font-bold mb-6">Create New Lead</h2>
              <LeadForm onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card overflow-hidden">
        <LeadTable
          leads={leads}
          loading={loading}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
        />
        
        {!loading && leads.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchLeads(pagination.page - 1)}
                className="btn btn-outline py-1 text-sm disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchLeads(pagination.page + 1)}
                className="btn btn-outline py-1 text-sm disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {!loading && leads.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No leads found. Start by adding a new lead.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
