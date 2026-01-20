
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { 
  BarChart2, Mail, Search, Users, TrendingUp, ArrowUpRight, Globe, Zap, 
  MousePointerClick, MessageSquare, BarChart, PieChart, Layers, Shield,
  CheckCircle2, AlertCircle, Plus, Filter, ExternalLink, Target,
  Link as LinkIcon, Lock, RefreshCw, Sparkles, Wand2, ArrowRight, Rocket
} from 'lucide-react';
import { Client, Campaign, ChannelConnection } from '../../types';

interface ChannelsViewProps {
    channelName: string;
    client: Client;
    campaigns: Campaign[];
    connections: ChannelConnection[];
    onConnect: (platform: string) => void;
    onViewChange: (view: string, context?: any) => void;
    onAddNotification: (msg: string) => void;
}

const ICONS: { [key: string]: React.ElementType } = {
    'SEO': Search,
    'PPC': BarChart2,
    'SOCIAL': Users,
    'EMAIL': Mail,
};

const PLATFORMS: Record<string, string> = {
    'SEO': 'Google Search Console',
    'PPC': 'Google Ads / Meta Ads',
    'SOCIAL': 'Instagram / LinkedIn API',
    'EMAIL': 'Klaviyo / Mailchimp',
};

const CHANNEL_STRATEGIES: Record<string, any> = {
  'SEO': {
    tactics: [
      { id: '1', title: 'Technical Site Audit', status: 'Completed', impact: 'High' },
      { id: '2', title: 'Core Web Vitals Optimization', status: 'In Progress', impact: 'Critical' },
      { id: '3', title: 'Backlink Outreach Campaign', status: 'Planned', impact: 'Medium' },
    ],
    stats: [
      { label: 'Organic Traffic', value: '42.5k', trend: '+12%', icon: Globe },
      { label: 'Keyword Rankings', value: '158', trend: '+5', icon: Search },
      { label: 'Domain Authority', value: '54', trend: '+1', icon: Shield },
    ]
  },
  'PPC': {
    tactics: [
      { id: '1', title: 'Ad Copy A/B Testing', status: 'Active', impact: 'High' },
      { id: '2', title: 'Negative Keyword Scrubbing', status: 'Daily', impact: 'Medium' },
      { id: '3', title: 'Retargeting Pixel Setup', status: 'Completed', impact: 'Critical' },
    ],
    stats: [
      { label: 'Ad Spend', value: '$12.4k', trend: '-5%', icon: Zap },
      { label: 'Avg CTR', value: '3.8%', trend: '+0.2%', icon: MousePointerClick },
      { label: 'Conversions', value: '482', trend: '+18%', icon: TrendingUp },
    ]
  },
  'SOCIAL': {
    tactics: [
      { id: '1', title: 'Influencer Partnership Program', status: 'Active', impact: 'High' },
      { id: '2', title: 'User Generated Content Drive', status: 'Planned', impact: 'High' },
      { id: '3', title: 'Short-form Video Scaling', status: 'Critical', impact: 'High' },
    ],
    stats: [
      { label: 'Followers', value: '185k', trend: '+4.2k', icon: Users },
      { label: 'Engagement Rate', value: '5.2%', trend: '+1.1%', icon: MessageSquare },
      { label: 'Post Reach', value: '1.2M', trend: '+15%', icon: TrendingUp },
    ]
  },
  'EMAIL': {
    tactics: [
      { id: '1', title: 'Welcome Sequence Redesign', status: 'Completed', impact: 'High' },
      { id: '2', title: 'List Segmentation Audit', status: 'In Progress', impact: 'High' },
      { id: '3', title: 'Abandoned Cart Recovery', status: 'Active', impact: 'Critical' },
    ],
    stats: [
      { label: 'Open Rate', value: '24.8%', trend: '+2.1%', icon: Mail },
      { label: 'CTR', value: '4.2%', trend: '+0.5%', icon: MousePointerClick },
      { label: 'Revenue', value: '$8.2k', trend: '+12%', icon: Zap },
    ]
  },
};

const ChannelsView: React.FC<ChannelsViewProps> = ({ channelName, client, campaigns, connections, onConnect, onViewChange, onAddNotification }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeTab, setActiveTab] = useState<'METRICS' | 'TACTICS'>('METRICS');
    const [customTacticName, setCustomTacticName] = useState('');
    
    const platformName = PLATFORMS[channelName];
    const connection = connections.find(c => c.platform === platformName);
    const strategy = CHANNEL_STRATEGIES[channelName] || CHANNEL_STRATEGIES['SEO'];

    const handleConnectClick = () => {
        setIsConnecting(true);
        setTimeout(() => {
            onConnect(platformName);
            setIsConnecting(false);
        }, 1500);
    };

    const handleApplyOptimization = (msg: string) => {
      onAddNotification(`🛠️ *OPTIMIZATION APPLIED:* ${msg}`);
      alert("Optimization directive has been queued for execution.");
    };

    const handleStudioBrief = (tacticTitle: string) => {
      onViewChange('STUDIO', { prompt: `Create a high-impact marketing visual for our ${channelName} channel focused on: ${tacticTitle}. Target Audience: ${client.industry} customers.` });
    };

    if (!connection) {
        return (
            <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
                <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-full flex items-center justify-center relative">
                    <Lock className="w-10 h-10 text-slate-800" />
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl"></div>
                </div>
                <div className="max-w-md space-y-4">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">{channelName} <span className="text-indigo-500">Integration</span></h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        To fetch live performance data and tactical insights for <strong>{client.name}</strong>, please connect the official <strong>{platformName}</strong> account.
                    </p>
                    <button 
                        onClick={handleConnectClick}
                        disabled={isConnecting}
                        className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] flex items-center gap-3 mx-auto transition-all disabled:opacity-50"
                    >
                        {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                        {isConnecting ? 'Authenticating...' : `Connect ${platformName}`}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-12 space-y-10 animate-fade-in-up h-full flex flex-col">
            <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Live Sync Active</span>
                  </div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter italic">{channelName} <span className="text-indigo-500">Operations</span></h1>
                  <p className="text-sm text-slate-500 font-bold uppercase mt-1">Monitoring & Execution for {client.name}</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                   <button 
                    onClick={() => setActiveTab('METRICS')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'METRICS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     Performance
                   </button>
                   <button 
                    onClick={() => setActiveTab('TACTICS')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TACTICS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     Optimizations
                   </button>
                </div>
            </div>

            {activeTab === 'METRICS' ? (
              <>
                <div className="grid grid-cols-3 gap-8">
                  {strategy.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="bg-[#08080c] border border-white/5 p-8 rounded-[2.5rem] group hover:bg-white/[0.02] transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</h4>
                      <p className="text-3xl font-black text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-12 gap-10 flex-1">
                  <div className="col-span-8 bg-[#08080c] border border-white/5 rounded-[3rem] p-10 flex flex-col shadow-2xl overflow-hidden">
                    <header className="flex justify-between items-center mb-10">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-indigo-500" /> Channel Engagement Over Time
                      </h3>
                      <button className="text-[9px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                        Full Report <ExternalLink className="w-3 h-3" />
                      </button>
                    </header>
                    <div className="flex-1 flex items-end gap-3 pb-4">
                      {[40, 65, 30, 85, 45, 95, 70, 55, 90, 60, 100, 75, 80, 45, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-xl group/bar relative" style={{ height: `${h}%` }}>
                          <div className="absolute inset-0 bg-indigo-500 rounded-t-xl opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 bg-[#08080c] border border-white/5 rounded-[3rem] p-8 flex flex-col shadow-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> AI Opportunity Engine
                    </h3>
                    <div className="space-y-6">
                      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3">
                           <Wand2 className="w-4 h-4 text-indigo-500/30" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">High Impact</p>
                        <p className="text-sm font-bold text-slate-200 leading-relaxed italic mb-4">
                          "{channelName} volume is peaking on weekends. Shift budget allocation for 20% better conversion."
                        </p>
                        <button 
                          onClick={() => handleApplyOptimization(`${channelName} Weekend Budget Shift`)}
                          className="w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Apply Optimization
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-12 gap-10 flex-1 overflow-hidden">
                 <div className="col-span-8 overflow-y-auto custom-scrollbar pr-4 space-y-6">
                    {strategy.tactics.map((tactic: any) => (
                      <div key={tactic.id} className="bg-[#08080c] border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-6">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${tactic.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                              {tactic.status === 'Completed' ? <CheckCircle2 className="w-7 h-7" /> : <Target className="w-7 h-7" />}
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-1">{tactic.title}</h4>
                              <div className="flex items-center gap-4">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${tactic.impact === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                  Priority: {tactic.impact}
                                </span>
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{tactic.status}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleStudioBrief(tactic.title)}
                              className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                                <Wand2 className="w-3.5 h-3.5" /> Studio Brief
                            </button>
                        </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="col-span-4 space-y-8">
                    <div className="bg-[#08080c] border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Rocket className="w-4 h-4 text-indigo-500" /> Operational Action
                       </h3>
                       <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
                         "Need a specific creative asset for this channel optimization?"
                       </p>
                       <button 
                          onClick={() => onViewChange('STUDIO')}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          Go to Studio <ArrowRight className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="bg-[#08080c] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Custom Tactic
                       </h3>
                       <div className="space-y-4">
                          <input 
                            value={customTacticName}
                            onChange={(e) => setCustomTacticName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-xs text-white outline-none focus:border-indigo-500 transition-all font-bold" 
                            placeholder="Optimization name..." 
                          />
                          <button 
                            onClick={() => { if(customTacticName) { alert(`Custom tactic "${customTacticName}" added to local roadmap.`); setCustomTacticName(''); } }}
                            className="w-full bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Add to Tactical Roadmap
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
        </div>
    );
};

export default ChannelsView;
