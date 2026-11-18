import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Building2, 
  Users, 
  HardHat, 
  FolderKanban, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SearchModal() {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    builders, 
    customers, 
    workers, 
    projects,
    setCurrentTab,
    setSelectedProjectForDetail
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.builder.toLowerCase().includes(query.toLowerCase()) ||
    p.customer.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredBuilders = builders.filter(b => 
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    b.company.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.propertyType?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(query.toLowerCase()) ||
    w.trade.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const totalResults = filteredProjects.length + filteredBuilders.length + filteredCustomers.length + filteredWorkers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3">
          <Search size={20} className="text-[#1E60FF] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type to search projects, builders, clients, or crew..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Stream */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {query.trim() && totalResults === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs sm:text-sm">
              No matching records found for "{query}". Try a different name or keyword.
            </div>
          ) : null}

          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <FolderKanban size={13} className="text-blue-500" />
                <span>Projects</span>
              </div>
              <div className="space-y-1.5">
                {filteredProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedProjectForDetail(p);
                    }}
                    className="p-2.5 rounded-xl hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600">{p.name}</h4>
                        <p className="text-[11px] text-gray-400">{p.builder} • {p.status}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                      {p.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Builders Results */}
          {filteredBuilders.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Building2 size={13} className="text-blue-500" />
                <span>Builders</span>
              </div>
              <div className="space-y-1.5">
                {filteredBuilders.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setCurrentTab('builders');
                    }}
                    className="p-2.5 rounded-xl hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={b.avatar} alt={b.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600">{b.name}</h4>
                        <p className="text-[11px] text-gray-400">{b.specialization}</p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-gray-400 group-hover:text-blue-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Results */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Users size={13} className="text-emerald-500" />
                <span>Customers</span>
              </div>
              <div className="space-y-1.5">
                {filteredCustomers.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setCurrentTab('customers');
                    }}
                    className="p-2.5 rounded-xl hover:bg-emerald-50/60 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600">{c.name}</h4>
                        <p className="text-[11px] text-gray-400">{c.propertyType}</p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-gray-400 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workers Results */}
          {filteredWorkers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <HardHat size={13} className="text-purple-500" />
                <span>Workers</span>
              </div>
              <div className="space-y-1.5">
                {filteredWorkers.map(w => (
                  <div
                    key={w.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setCurrentTab('workers');
                    }}
                    className="p-2.5 rounded-xl hover:bg-purple-50/60 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-purple-600">{w.name}</h4>
                        <p className="text-[11px] text-gray-400">{w.trade}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
          Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono text-[10px]">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
}
