
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Client, Campaign, CampaignContent } from '../../types';
import { generateCampaignSuggestions, generateCampaignSchedule } from '../../services/geminiService';
import { Rocket, Plus, Cpu, Calendar, Target, Globe, ArrowRight, CheckCircle2, MoreVertical, X } from 'lucide-react';

interface CampaignsViewProps {
  client: Client;
  campaigns: Campaign[];
  onAddCampaign: (campaign: Campaign) => void;
  onUpdateCampaign: (campaign: Campaign) => void;
  onGoToStudio: (prompt: string) => void;
  strategyContext?: string;
}

const CampaignsView: React.FC<CampaignsViewProps> = ({ client, campaigns, onAddCampaign, onUpdateCampaign, onGoToStudio, strategyContext }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPlatform, setCustomPlatform] = useState<any>('LinkedIn');

  const handleGenerateSuggestions = async () => {
    if (!strategyContext) return;
    setIsGenerating(true);
    try {
      const suggestions = await generateCampaignSuggestions(client, strategyContext);
      suggestions.forEach(s => onAddCampaign(s));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCustom = () => {
    if (!customName) return;
    onAddCampaign({
      id: `camp-${Date.now()}`,
      clientId: client.id,
      name: customName,
      platform: customPlatform,
      status: 'Draft',
      budget: '$5,000',
    });
    setCustomName('');
    setIsCustomModalOpen(false);
  };

  const handleGenerateSchedule = async (campaign: Campaign) => {
    setIsGenerating(true);
    try {
      const content = await generateCampaignSchedule(client, campaign);
      onUpdateCampaign({ ...campaign, content });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId);

  return (
    <div className="p-12 space-y-10 animate-fade-in-up h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Client <span className="text-indigo-500">Roadmap</span></h1>
          <p className="text-sm text-slate-500 font-bold uppercase mt-1">Campaign Strategy & Execution</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleGenerateSuggestions}
            disabled={isGenerating || !strategyContext}
            className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <Cpu className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />} Suggest Campaigns
          </button>
          <button 
            onClick={() => setIsCustomModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white"
          >
            <Plus className="w-3.5 h-3.5" /> Create Custom
          </button>
        </div>
      </div>

      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
           <div className="bg-[#08080c] border border-white/5 rounded-[2.5rem] p-8 max-w-md w-full animate-scale-in">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-black italic uppercase text-white">Custom Campaign</h3>
                <button onClick={() => setIsCustomModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <input 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Campaign Name..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                />
                <select 
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                >
                  <option>LinkedIn</option>
                  <option>Google Ads</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>Email</option>
                </select>
                <button 
                  onClick={handleCreateCustom}
                  className="w-full bg-indigo-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Add Campaign
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-10 flex-1 overflow-hidden">
        <div className="col-span-5 space-y-4 overflow-y-auto custom-scrollbar pr-4">
          {campaigns.length > 0 ? campaigns.map((campaign) => (
            <button 
              key={campaign.id} 
              onClick={() => setSelectedCampaignId(campaign.id)}
              className={`w-full text-left p-6 rounded-[2.5rem] border transition-all group ${selectedCampaignId === campaign.id ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg' : 'bg-[#08080c] border-white/5 hover:bg-white/[0.03]'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${campaign.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                  {campaign.status}
                </span>
                <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">{campaign.platform}</span>
              </div>
              <h3 className="text-lg font-black text-white mb-2 leading-tight">{campaign.name}</h3>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4 pt-4 border-t border-white/5">
                <span>Budget: {campaign.budget}</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Detail <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600 border border-dashed border-white/5 rounded-[3rem]">
              <Target className="w-12 h-12 opacity-10 mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">No campaigns defined</p>
            </div>
          )}
        </div>

        <div className="col-span-7 bg-[#08080c] border border-white/5 rounded-[3rem] overflow-hidden flex flex-col">
          {activeCampaign ? (
            <div className="h-full flex flex-col p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{activeCampaign.name}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeCampaign.platform} / {activeCampaign.budget}</p>
                </div>
                {!activeCampaign.content?.length && (
                  <button 
                    onClick={() => handleGenerateSchedule(activeCampaign)}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 shadow-xl"
                  >
                    {isGenerating ? <Cpu className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />} Generate Content Schedule
                  </button>
                )}
              </div>

              {activeCampaign.content && activeCampaign.content.length > 0 ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
                  {activeCampaign.content.map((item) => (
                    <div key={item.id} className="bg-black/40 border border-white/5 p-6 rounded-3xl group hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg uppercase tracking-widest">{item.type}</span>
                          <span className="text-xs font-bold text-slate-500">{item.date}</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{item.topic}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed italic">{item.visualBrief}</p>
                      <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
                        <button 
                          onClick={() => onGoToStudio(`Create a ${item.type} for our campaign: "${activeCampaign.name}". Context: ${item.topic}. Visual Brief: ${item.visualBrief}`)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300"
                        >
                          <Rocket className="w-3 h-3" /> Start Production
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
                  <Globe className="w-16 h-16 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-widest">Awaiting Content Strategy</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6">
              <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-slate-800" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest max-w-[200px]">Select a campaign to manage execution roadmap</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsView;
