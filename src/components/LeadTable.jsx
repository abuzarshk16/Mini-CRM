import React from 'react';
import { Trash2, MoreHorizontal, User } from 'lucide-react';

const LeadTable = ({ leads, loading, onDelete, onStatusUpdate }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'contacted':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'contacted': return 'bg-amber-600';
      case 'converted': return 'bg-emerald-600';
      default: return 'bg-slate-600';
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto min-h-0">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-slate-100 text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-200 z-10">
          <tr>
            <th className="px-6 py-4 font-bold">Lead Name</th>
            <th className="px-6 py-4 font-bold">Contact Info</th>
            <th className="px-6 py-4 font-bold">Pipeline Stage</th>
            <th className="px-6 py-4 font-bold text-right">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-blue-50/30 group transition-all duration-200">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{lead.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-slate-700 font-medium">{lead.email}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{lead.phone || 'No phone'}</div>
              </td>
              <td className="px-6 py-4">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${getStatusStyle(lead.status)} shadow-sm`}>
                  <span className={`w-2 h-2 rounded-full ${getStatusDot(lead.status)} animate-pulse`}></span>
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusUpdate(lead._id, e.target.value)}
                    className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer capitalize font-bold text-[11px] outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
              </td>
              <td className="px-6 py-4 text-right text-slate-500 tabular-nums font-medium">
                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-red-100"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
