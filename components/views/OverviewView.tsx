
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Client, Campaign } from '../../types';
import { BarChart2, DollarSign, Target, TrendingUp, Zap, Clock, MessageSquare } from 'lucide-react';

interface OverviewViewProps {
  client: Client;
  campaigns: Campaign[];
  activities: { action: string; time: string }[];
}

const OverviewView: React.FC<OverviewViewProps> = ({ client, campaigns, activities }) => {
    const totalBudget = campaigns.reduce((acc, c) => acc + parseInt(c.budget.replace(/[^0-9]/g, '') || '0'), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
    
    // Dynamic engagement calculation based on campaign count
    const baseEngagement = 5.4;
    const dynamicEngagement = (baseEngagement + (activeCampaigns * 1.2)).toFixed(1);

    const kpis = [
        { label: "Active Campaigns", value: activeCampaigns, icon: Zap, color: "text-indigo-400" },
        { label: "Total Budget", value: `$${(totalBudget / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-emerald-400" },
        { label: "Primary Objective", value: client.primaryObjective, icon: Target, color: "text-amber-400" },
        { label: "Engagement (30d)", value: `${dynamicEngagement}%`, icon: TrendingUp, color: "text-rose-400" },
    ];

    const handleWhatsApp = () => {
      if (!client.phoneNumber) return;
      const msg = encodeURIComponent(`Hi ${client.name}, this is MarkA Studio. We've updated your campaign dashboard.`);
      window.open(`https://wa.me/${client.phoneNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    };

    return (
        <div className="p-12 space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">Client <span className="text-indigo-500">Overview</span></h1>
                    <p className="text-sm text-slate-500 font-bold uppercase mt-1">Status Report for: {client.name}</p>
                </div>
                {client.phoneNumber && (
                  <button 
                    onClick={handleWhatsApp}
                    className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" /> Contact via WhatsApp
                  </button>
                )}
            </div>

            <div className="grid grid-cols-4 gap-8">
                {kpis.map(kpi => (
                    <div key={kpi.label} className="bg-[#08080c] border border-white/5 p-6 rounded-[2rem]">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${kpi.color}`}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">{kpi.value}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-5 gap-8">
                <div className="col-span-3 bg-[#08080c] border border-white/5 p-8 rounded-[2.5rem]">
                     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Campaign Performance (Q2)</h3>
                     <div className="h-64 flex items-end gap-3">
                        {[40, 65, 30, 85, 45, 95, 70, 55, 90, 60, 100].map((h, i) => (
                           <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600/50 to-indigo-600/0 rounded-t-lg border-t-2 border-indigo-500" style={{ height: `${h}%` }}></div>
                        ))}
                     </div>
                </div>
                <div className="col-span-2 bg-[#08080c] border border-white/5 p-8 rounded-[2.5rem]">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Activity</h3>
                    <div className="space-y-4">
                        {activities.length > 0 ? activities.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="w-3 h-3 bg-indigo-500/20 rounded-full mt-1 border border-indigo-500/30"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-300">{item.action}</p>
                                    <p className="text-xs text-slate-600">{item.time}</p>
                                </div>
                            </div>
                        )) : (
                          <div className="flex flex-col items-center justify-center py-12 opacity-20">
                             <Clock className="w-10 h-10 mb-2" />
                             <p className="text-[10px] font-black uppercase">No recent events</p>
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewView;
