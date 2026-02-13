import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Printer, Barcode, Truck,
  LogOut, Loader2, Search
} from 'lucide-react';
import { format } from 'date-fns';

// Import Components
import Dashboard from './components/Dashboard';
import Models from './components/Models';
import Serials from './components/Serials';
import Dispatch from './components/Dispatch';
import { printerService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  // Data State
  const [models, setModels] = useState([]);
  const [serials, setSerials] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data
  const refreshData = async () => {
    try {
      const [m, s, d] = await Promise.all([
        printerService.getModels(),
        printerService.getSerials(),
        printerService.getDispatches()
      ]);
      setModels(m);
      setSerials(s);
      setDispatches(d);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };
    init();

    const savedUser = localStorage.getItem('pt_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      const user = { username: 'admin', role: 'Admin' };
      setCurrentUser(user);
      localStorage.setItem('pt_user', JSON.stringify(user));
    } else {
      setError('Invalid credentials (try admin/admin)');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pt_user');
  };

  // --- LOGIN SCREEN ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-center mb-6 text-indigo-600">
            <Printer size={48} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-800">PrintTrack Pro</h1>
          <p className="text-center text-slate-500 mb-8">Sign in to manage inventory</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'models', icon: Printer, label: 'Models' },
    { id: 'serials', icon: Barcode, label: 'Serials' },
    { id: 'dispatch', icon: Truck, label: 'Dispatch' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm">
        <div className="p-6 font-bold text-xl text-indigo-600 flex gap-2 items-center">
          <Printer className="fill-indigo-100" /> PrintTrack
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <Icon size={20} /> {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {currentUser.username[0].toUpperCase()}
            </div>
            <div className="text-sm font-medium">{currentUser.username}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 text-red-600 text-sm hover:bg-red-50 p-2 rounded transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-bold capitalize text-slate-800">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                placeholder="Quick search serial..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full border">
              {format(new Date(), 'PP')}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-auto p-8 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-50">
              <Loader2 className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
              <p className="text-slate-500 font-medium">Syncing Database...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">

              {/* RENDER VIEW BASED ON TAB */}
              {activeTab === 'dashboard' && (
                <Dashboard models={models} serials={serials} dispatches={dispatches} />
              )}

              {activeTab === 'models' && (
                <Models
                  models={models}
                  onRefresh={refreshData}
                  isAdmin={currentUser.role === 'Admin'}
                />
              )}

              {activeTab === 'serials' && (
                <Serials
                  models={models}
                  serials={serials}
                  onRefresh={refreshData}
                />
              )}

              {activeTab === 'dispatch' && (
                <Dispatch
                  models={models}
                  serials={serials}
                  dispatches={dispatches}
                  currentUser={currentUser}
                  onRefresh={refreshData}
                />
              )}

              {/* GLOBAL SEARCH OVERLAY RESULT */}
              {searchTerm && (
                <div className="absolute top-8 left-8 right-8 bottom-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl border shadow-2xl overflow-auto z-50">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Search Results for "{searchTerm}"</h3>
                    <button onClick={() => setSearchTerm('')} className="text-slate-500 hover:text-slate-800">Close</button>
                  </div>
                  {serials.filter(s => s.value.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                    <div key={s.id} className="border-b py-4">
                      <div className="text-lg font-mono text-indigo-600 font-bold">{s.value}</div>
                      <div className="text-sm text-slate-500">
                        Status: {s.status} | Model: {models.find(m => m.id === s.modelId)?.name}
                      </div>
                    </div>
                  ))}
                  {serials.filter(s => s.value.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <p className="text-slate-500">No matching serial numbers found.</p>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}