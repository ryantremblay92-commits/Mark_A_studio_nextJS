
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ServiceItem, OptimizedRateSheet, AppState } from '../../types';
import { generateOptimizedRateSheet } from '../../services/geminiService';
import { DollarSign, Cpu, ArrowRight, TrendingDown, Shield, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const INITIAL_SERVICES: ServiceItem[] = [
  { id: 'srv-1', name: 'SEO Retainer (Basic)', category: 'SEO', currentPrice: 1500, billingType: 'Retainer', competitorMin: 1200, competitorMax: 2500, competitorAvg: 1800 },
  { id: 'srv-2', name: 'Social Media Management', category: 'Social', currentPrice: 2000, billingType: 'Retainer', competitorMin: 1800, competitorMax: 3500, competitorAvg: 2600 },
  { id: 'srv-3', name: 'PPC Setup Fee', category: 'PPC', currentPrice: 800, billingType: 'Flat', competitorMin: 500, competitorMax: 1500, competitorAvg: 1000 },
  { id: 'srv-4', name: 'Blog Writing (4 posts)', category: 'Content', currentPrice: 600, billingType: 'Flat', competitorMin: 400, competitorMax: 1200, competitorAvg: 800 },
  { id: 'srv-5', name: 'Email Automation Setup', category: 'Email', currentPrice: 1200, billingType: 'Flat', competitorMin: 1000, competitorMax: 3000, competitorAvg: 1800 },
];

const PricingView: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [optimizedSheet, setOptimizedSheet] = useState<OptimizedRateSheet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePriceChange = (id: string, newPrice: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, currentPrice: newPrice } : s));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate delay for effect
      await new Promise(r => setTimeout(r, 1000));
      const result = await generateOptimizedRateSheet(services);
      if (result) {
        setOptimizedSheet(result);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-12 space-y-10 animate-fade-in-up h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Pricing <span className="text-indigo-500">Assistant</span></h1>
          <p className="text-sm text-slate-500 font-bold uppercase mt-1">Market-Optimized Rate Generation</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> Strategy: Below Competitors
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        
        {/* Left: Input Services */}
        <div className="col-span-5 flex flex-col bg-[#08080c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
           <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                 <DollarSign className="w-4 h-4 text-indigo-500" /> Current Service Rates
              </h3>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                 Adjust your current standard rates below. The AI will use these benchmarks along with market data to propose an optimized fee structure.
              </p>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {services.map(service => (
                 <div key={service.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3 group hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-xs font-bold text-white">{service.name}</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{service.category} • {service.billingType}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] text-slate-600 font-bold uppercase">Mkt Avg</p>
                          <p className="text-[10px] text-slate-400 font-mono">${service.competitorAvg}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                       <label className="text-[10px] font-bold text-slate-500">Current Rate:</label>
                       <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                          <input 
                             type="number" 
                             value={service.currentPrice}
                             onChange={e => handlePriceChange(service.id, parseInt(e.target.value) || 0)}
                             className="w-full bg-white/5 rounded-lg pl-6 pr-3 py-2 text-xs text-white font-mono focus:bg-indigo-900/20 focus:outline-none transition-all text-right"
                          />
                       </div>
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="p-6 border-t border-white/5 bg-white/[0.02]">
              <button 
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                 {isGenerating ? <Cpu className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 
                 {isGenerating ? 'Optimizing Rates...' : 'Generate Rate Sheet'}
              </button>
           </div>
        </div>

        {/* Right: AI Output */}
        <div className="col-span-7 flex flex-col bg-[#08080c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl relative">
           {optimizedSheet ? (
              <>
                 <div className="p-8 border-b border-white/5 bg-gradient-to-r from-indigo-900/10 to-transparent">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                             <Shield className="w-4 h-4 text-emerald-400" /> Optimized Rate Sheet
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-2 max-w-md">
                             {optimizedSheet.global_positioning_statement}
                          </p>
                       </div>
                       <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                          <p className="text-[9px] font-mono text-indigo-300">v{optimizedSheet.engine_version}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                    {optimizedSheet.optimized_rate_sheet.map((rate, idx) => {
                       // Find original for comparison
                       const original = services.find(s => s.name === rate.service_name || s.id === rate.service_id);
                       
                       return (
                          <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-start gap-5">
                             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 font-bold text-xs">
                                {idx + 1}
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                   <h4 className="text-sm font-bold text-white">{rate.service_name}</h4>
                                   <div className="text-right">
                                      <span className="text-lg font-black text-emerald-400 block">{rate.optimized_price}</span>
                                      {original && (
                                         <span className="text-[9px] text-slate-500 line-through mr-2">Was: ${original.currentPrice}</span>
                                      )}
                                   </div>
                                </div>
                                <div className="bg-black/30 rounded-lg p-3 border border-white/5 mb-2">
                                   <p className="text-[10px] text-slate-300 italic leading-relaxed">"{rate.positioning_note}"</p>
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-500 uppercase tracking-widest">{rate.billing_type}</span>
                                   <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-500 uppercase tracking-widest">{rate.category}</span>
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>

                 <div className="p-4 bg-amber-500/5 border-t border-amber-500/10 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-200/80 leading-relaxed font-medium">
                       <strong>Disclaimer:</strong> {optimizedSheet.scope_disclaimer}
                    </p>
                 </div>
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                 <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <DollarSign className="w-10 h-10 text-slate-700" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black uppercase text-slate-600">Awaiting Input</h3>
                    <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto">
                       Review your current rates on the left and click "Generate Rate Sheet" to run the pricing engine.
                    </p>
                 </div>
              </div>
           )}
        </div>
        
      </div>
    </div>
  );
};

export default PricingView;
