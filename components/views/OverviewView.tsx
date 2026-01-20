
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
                    <h1 className="font-black italic">Client <span className="text-primary-400">Overview</span></h1>
                    <p className="text-caption text-muted font-semibold mt-2">Status Report for: {client.name}</p>
                </div>
                {client.phoneNumber && (
                  <button
                    onClick={handleWhatsApp}
                    className="btn btn-outline btn-md gap-3 hover:bg-success-500/10 hover:border-success-500/30 hover:text-success-400"
                  >
                    <MessageSquare className="w-4 h-4" /> Contact via WhatsApp
                  </button>
                )}
            </div>

            <div className="grid-mobile">
                {kpis.map(kpi => (
                    <div key={kpi.label} className="card card-body hover:border-neutral-700 transition-all touch-target">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 ${kpi.color.replace('text-', 'text-')}`}>
                                <kpi.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="mobile-heading font-black text-primary">{kpi.value}</p>
                                <p className="text-caption text-muted font-semibold uppercase tracking-wide">{kpi.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
                <div className="col-span-1 md:col-span-3 card">
                     <div className="card-header">
                        <h3 className="text-caption text-muted font-semibold uppercase tracking-wide flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-primary-400" /> Campaign Performance (Q2)
                        </h3>
                     </div>
                     <div className="card-body">
                        <div className="h-48 md:h-64 flex items-end gap-2 md:gap-3">
                           {[40, 65, 30, 85, 45, 95, 70, 55, 90, 60, 100].map((h, i) => (
                              <div key={i} className="flex-1 bg-gradient-to-t from-primary-500/50 to-primary-500/0 rounded-t-lg border-t-2 border-primary-500" style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                     </div>
                </div>
                <div className="col-span-1 md:col-span-2 card">
                    <div className="card-header">
                        <h3 className="text-caption text-muted font-semibold uppercase tracking-wide flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary-400" /> Recent Activity
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="space-y-4 max-h-48 md:max-h-none overflow-y-auto custom-scrollbar">
                            {activities.length > 0 ? activities.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-3 h-3 bg-primary-500/20 rounded-full mt-1.5 border border-primary-500/30"></div>
                                    <div>
                                        <p className="text-body text-secondary font-medium">{item.action}</p>
                                        <p className="text-caption text-muted">{item.time}</p>
                                    </div>
                                </div>
                            )) : (
                              <div className="empty-state py-8">
                                 <Clock className="empty-state-icon" />
                                 <p className="empty-state-title">No recent events</p>
                                 <p className="empty-state-description">Activity will appear here as campaigns progress</p>
                              </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewView;
