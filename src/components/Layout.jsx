import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Settings } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-white tracking-tight text-xl italic uppercase">MiniCRM</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-8 pt-4">
          <div>
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Core Platform</p>
            <div className="space-y-1">
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className={`w-4 h-4 transition-colors ${location.pathname === '/' ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                <span>Leads Manager</span>
              </Link>
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Workspace</p>
            <div className="space-y-1">
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                  location.pathname === '/settings' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className={`w-4 h-4 transition-colors ${location.pathname === '/settings' ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                <span>Account Settings</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-black italic shadow-inner">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-bold truncate tracking-widest uppercase">Pro Workspace</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="md:hidden w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm md:text-lg font-bold text-slate-800 tracking-tight">MiniCRM</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/settings" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
