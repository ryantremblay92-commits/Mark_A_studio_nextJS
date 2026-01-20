/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Campaign, CampaignContent } from '../../types';
import { Calendar as CalendarIcon, Clock, Filter, CheckCircle2, ChevronLeft, ChevronRight, LayoutGrid, FileText, Download } from 'lucide-react';

interface ScheduleViewProps {
  campaigns: Campaign[];
  clientName: string;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ campaigns, clientName }) => {
  // Aggregate all content items across campaigns
  const allContent = campaigns.flatMap(c => 
    (c.content || []).map(item => ({ ...item, campaignName: c.name, platform: c.platform }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleExportTxt = () => {
    if (allContent.length === 0) return;
    const content = allContent.map(item => (
      `DATE: ${item.date}\nPLATFORM: ${item.platform}\nCAMPAIGN: ${item.campaignName}\nTYPE: ${item.type}\nTOPIC: ${item.topic}\nBRIEF: ${item.visualBrief}\n----------------------------------`
    )).join('\n\n');
    
    const blob = new Blob([`MARKETING CONTENT SCHEDULE - ${clientName}\n\n${content}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `schedule_${clientName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    link.click();
  };

  const handleExportCsv = () => {
    if (allContent.length === 0) return;
    const headers = ['Date', 'Platform', 'Campaign', 'Type', 'Topic', 'Brief'];
    const rows = allContent.map(item => [
      item.date,
      item.platform,
      item.campaignName,
      item.type,
      `"${item.topic.replace(/"/g, '""')}"`,
      `"${item.visualBrief.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `schedule_${clientName.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="p-12 space-y-10 animate-fade-in-up h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Content <span className="text-indigo-500">Schedule</span></h1>
          <p className="text-sm text-slate-500 font-bold uppercase mt-1">Global Campaign Timeline</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportTxt}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 rounded-xl text-xs font-bold transition-all"
          >
            <FileText className="w-4 h-4" /> Export TXT
          </button>
          <button 
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV (Excel)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#08080c] border border-white/5 rounded-[3rem] p-10">
        {allContent.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-6">
              {allContent.map((item) => (
                <div key={item.id} className="flex gap-8 group">
                  <div className="w-24 shrink-0 pt-1">
                    <p className="text-xs font-black uppercase text-indigo-400 tracking-widest">{item.date.split('-')[2]}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{item.date.split('-')[1]} {item.date.split('-')[0]}</p>
                  </div>
                  <div className="flex-1 bg-black/40 border border-white/5 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all flex justify-between items-center group-hover:bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
                          <LayoutGrid className="w-5 h-5 text-indigo-500" />
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-sm font-black text-white">{item.topic}</h4>
                            <span className="text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">{item.type}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.campaignName} • {item.platform}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${item.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {item.status}
                          </span>
                        </div>
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                           <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-20">
            <CalendarIcon className="w-24 h-24" />
            <p className="text-lg font-black uppercase tracking-widest italic">Timeline Inactive</p>
            <p className="text-xs font-bold uppercase tracking-widest">Generate campaigns to populate the calendar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;