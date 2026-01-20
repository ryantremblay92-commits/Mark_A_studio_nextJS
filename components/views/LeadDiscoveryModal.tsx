/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import * as React from 'react';
import { Lead } from '../../types';
import { X, Search, Cpu, Plus, Globe, Phone, MapPin, Building, Link as LinkIcon, Filter, CheckCircle2, Download, MessageSquare } from 'lucide-react';

interface LeadDiscoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (category: string, location: string) => void;
    onAddLead: (lead: Lead) => void;
    isLoading: boolean;
    results: Lead[];
    error: string | null;
}

const LeadDiscoveryModal: React.FC<LeadDiscoveryModalProps> = ({ isOpen, onClose, onSearch, onAddLead, isLoading, results, error }) => {
    const [category, setCategory] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [minConfidence, setMinConfidence] = React.useState(0);
    const [filterText, setFilterText] = React.useState('');
    const [addedIds, setAddedIds] = React.useState<Set<string>>(new Set());

    const handleSearch = () => {
        if (category && location) {
            onSearch(category, location);
        }
    };

    const handleAdd = (lead: Lead) => {
        onAddLead(lead);
        setAddedIds(prev => new Set(prev).add(lead.name));
    };

    const handleWhatsApp = (phone: string, leadName: string) => {
      const msg = encodeURIComponent(`Hi ${leadName}, I found your business through our discovery engine and would love to discuss a marketing collaboration.`);
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    };

    const handleExportCSV = () => {
      if (results.length === 0) return;
      const headers = ['Name', 'Address', 'Phone', 'Website', 'Confidence', 'Summary'];
      const rows = results.map(l => [
        `"${l.name}"`, 
        `"${l.address || ''}"`, 
        `"${l.phone || ''}"`, 
        `"${l.website || ''}"`, 
        l.confidence || 0, 
        `"${l.summary.replace(/"/g, '""')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `leads_${category.replace(/\s+/g, '_')}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const filteredResults = results.filter(lead => {
        const matchesConfidence = (lead.confidence || 0) >= minConfidence;
        const matchesText = lead.name.toLowerCase().includes(filterText.toLowerCase()) || 
                           lead.summary.toLowerCase().includes(filterText.toLowerCase());
        return matchesConfidence && matchesText;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-[#0b0b0f] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(79,70,229,0.15)] max-w-5xl w-full p-10 flex flex-col max-h-[92vh] animate-scale-in" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-8 shrink-0">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                            Lead <span className="text-indigo-500">Discovery</span> Engine
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Grounded Real-Time Prospecting via Gemini</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {results.length > 0 && (
                            <button 
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                            >
                                <Download className="w-3.5 h-3.5 text-indigo-400" /> Export CSV
                            </button>
                        )}
                        <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                    </div>
                </div>

                <div className="flex gap-4 mb-8 shrink-0 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Business Category</label>
                        <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input 
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="e.g. Luxury Real Estate, Boutique Cafes"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-bold text-white"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input 
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="e.g. Miami, London, Tokyo"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-bold text-white"
                            />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={handleSearch} 
                            disabled={isLoading || !category || !location} 
                            className="bg-indigo-600 hover:bg-indigo-500 h-[58px] px-8 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(79,70,229,0.3)] group"
                        >
                            {isLoading ? <Cpu className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />}
                            <span className="text-[11px] font-black uppercase tracking-widest">Find Leads</span>
                        </button>
                    </div>
                </div>

                {results.length > 0 && (
                    <div className="flex items-center gap-6 mb-6 px-2 shrink-0">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                <input 
                                    value={filterText}
                                    onChange={e => setFilterText(e.target.value)}
                                    placeholder="Filter collected leads..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[11px] focus:border-indigo-500 outline-none transition-all font-bold text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 ml-4">
                                <Filter className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Confidence</span>
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                <input 
                                    type="range" 
                                    min="0" max="0.9" step="0.1" 
                                    value={minConfidence} 
                                    onChange={e => setMinConfidence(parseFloat(e.target.value))}
                                    className="flex-1 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <span className="text-[10px] font-bold text-indigo-400 uppercase w-20">{(minConfidence * 100).toFixed(0)}%+</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase">
                            {filteredResults.length} / {results.length} Leads
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                                <Cpu className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-white uppercase tracking-tighter italic">Scanning Global Databases</p>
                                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Consulting Search & Maps Grounding Metadata...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-400 bg-red-500/5 rounded-[2rem] border border-red-500/10 p-8 space-y-4">
                             <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
                             <button onClick={handleSearch} className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20">Retry Connection</button>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredResults.map((lead, index) => (
                                <div key={index} className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex items-start gap-6 hover:bg-white/[0.04] transition-all group border-l-4 border-l-transparent hover:border-l-indigo-500 shadow-xl">
                                    <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform"><Building className="w-6 h-6" /></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-4">
                                                <h4 className="text-lg font-black text-white leading-tight">{lead.name}</h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Grounding</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Match Score: {( (lead.confidence || 0) * 100).toFixed(0)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {lead.phone && (
                                                  <button 
                                                      onClick={() => handleWhatsApp(lead.phone!, lead.name)}
                                                      className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all hover:scale-105"
                                                      title="WhatsApp Contact"
                                                  >
                                                      <MessageSquare className="w-4 h-4" />
                                                  </button>
                                                )}
                                                <button 
                                                    onClick={() => handleAdd(lead)} 
                                                    disabled={addedIds.has(lead.name)}
                                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${addedIds.has(lead.name) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 hover:bg-indigo-600 text-slate-300 hover:text-white border border-white/5 hover:shadow-[0_10px_20px_rgba(79,70,229,0.2)]'}`}
                                                >
                                                    {addedIds.has(lead.name) ? <><CheckCircle2 className="w-4 h-4" /> Import Success</> : <><Plus className="w-4 h-4" /> Import to CRM</>}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium bg-black/20 p-4 rounded-2xl border border-white/5">{lead.summary}</p>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                            {lead.address && <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-500"/> {lead.address}</span>}
                                            {lead.phone && <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-indigo-500"/> {lead.phone}</span>}
                                            {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-400 transition-colors"><Globe className="w-3.5 h-3.5 text-indigo-500"/> Website</a>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-6">
                            <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
                                <Search className="w-10 h-10 opacity-20" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-500 uppercase tracking-tighter italic">No Results Match Filters</p>
                                <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-widest">Try clearing your search or lowering confidence thresholds.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadDiscoveryModal;
