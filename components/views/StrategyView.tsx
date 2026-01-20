
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Client, Strategy, StrategySection } from '../../types';
import { generateMarketingStrategy } from '../../services/geminiService';
import { 
  Target, Cpu, Sparkles, Search, FileText, ExternalLink, 
  RefreshCcw, Share2, UserCheck, ShieldAlert, BarChart3, Rocket, AlertCircle, KeyRound
} from 'lucide-react';

interface StrategyViewProps {
  client: Client;
  onStrategyUpdated: (strategy: Strategy) => void;
  existingStrategy?: Strategy;
  onShare?: () => void;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  'Executive Summary': FileText,
  'ICP (Ideal Customer Profile)': UserCheck,
  'Buyer Personas': Target,
  'Pain Point Analysis': ShieldAlert,
  'Channel Strategy': BarChart3,
  'Competitive Advantage': Rocket,
};

const StrategyView: React.FC<StrategyViewProps> = ({ client, onStrategyUpdated, existingStrategy, onShare }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);

  const handleOpenSelectKey = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      // Reset error state so user can try again after selecting their new/paid key
      setError(null);
      setIsQuotaError(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setIsQuotaError(false);
    try {
      const { sections, sources } = await generateMarketingStrategy(client);
      if (sections.length === 0) {
        throw new Error("Research yielded no actionable sections. Please verify the client details and try again.");
      }
      const newStrategy: Strategy = {
        id: `strat-${Date.now()}`,
        clientId: client.id,
        sections,
        sources,
        lastUpdated: Date.now(),
      };
      onStrategyUpdated(newStrategy);
    } catch (e: any) {
      console.error("Strategy generation failed", e);
      // The API error response body is usually in e.message
      const msg = e.message || "Deep research failed due to a network or API error.";
      setError(msg);
      
      // Check for quota (429), key issues (404/403), or expired sessions
      if (
        msg.includes("RESOURCE_EXHAUSTED") || 
        msg.includes("429") || 
        msg.includes("quota") || 
        msg.includes("Requested entity was not found") ||
        msg.includes("API_KEY")
      ) {
        setIsQuotaError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentLine = (line: string, idx: number) => {
    if (line.startsWith('###') || line.startsWith('##') || line.startsWith('#')) {
      return (
        <h4 key={idx} className="text-indigo-400 font-black uppercase text-xs mt-6 mb-2 tracking-widest">
          {line.replace(/^#+\s/, '')}
        </h4>
      );
    }
    
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="text-white font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      return (
        <div key={idx} className="flex gap-3 mb-2 ml-4">
          <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
          <p className="text-slate-400 text-sm leading-relaxed flex-1">{content}</p>
        </div>
      );
    }

    return (
      <p key={idx} className="mb-4 text-slate-400 text-sm leading-relaxed">
        {content}
      </p>
    );
  };

  const formatContent = (text: string) => {
    return text.split('\n').filter(l => l.trim() !== '').map((line, i) => renderContentLine(line, i));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-8 animate-fade-in-up">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
          <Cpu className="w-10 h-10 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">Synthesizing <span className="text-indigo-500">Dossier</span></h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Scanning Web Metadata & Market Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!existingStrategy) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-8 animate-fade-in-up">
        <div className="w-32 h-32 bg-[#08080c] border border-white/5 rounded-full flex items-center justify-center shadow-2xl">
          <Target className="w-12 h-12 text-slate-800" />
        </div>
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white">Brand <span className="text-indigo-500">Intelligence</span></h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Generate a research-grounded growth blueprint for <strong>{client.name}</strong> covering ICP, Personas, and Market Gaps.
          </p>
          
          {error && (
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex flex-col gap-4 text-rose-400 text-xs font-bold mb-4 max-w-sm mx-auto shadow-2xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-left leading-tight">
                  {isQuotaError ? "API Quota Exhausted. This feature requires a paid API key with Search Grounding enabled." : error}
                </span>
              </div>
              {isQuotaError && (
                <button 
                  onClick={handleOpenSelectKey}
                  className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 py-3.5 rounded-xl border border-rose-500/30 flex items-center justify-center gap-2 transition-all font-black uppercase tracking-widest"
                >
                  <KeyRound className="w-4 h-4" />
                  Select Paid API Key
                </button>
              )}
            </div>
          )}

          <button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 mx-auto transition-all group shadow-xl shadow-indigo-500/10 active:scale-95">
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Start Deep Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-10 animate-fade-in-up h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Strategic <span className="text-indigo-500">Dossier</span></h1>
          <p className="text-sm text-slate-500 font-bold uppercase mt-1">Grounded Market Intelligence for {client.name}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleGenerate} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2 text-slate-400">
            <RefreshCcw className="w-3.5 h-3.5" /> Re-Scan Market
          </button>
          <button onClick={onShare} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" /> Share Dossier
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col gap-4 text-rose-400 text-xs font-bold">
           <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="leading-tight">{error}</span>
          </div>
          {isQuotaError && (
            <button 
              onClick={handleOpenSelectKey}
              className="w-fit bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-6 py-2.5 rounded-xl border border-rose-500/30 flex items-center gap-2 transition-all font-black uppercase tracking-widest"
            >
              <KeyRound className="w-4 h-4" />
              Update API Key
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-12 gap-10 flex-1 overflow-hidden">
        <div className="col-span-8 overflow-y-auto custom-scrollbar pr-6 space-y-10 pb-20">
          {existingStrategy.sections.map((section) => {
            const Icon = SECTION_ICONS[section.title] || FileText;
            return (
              <section key={section.id} className="bg-[#08080c] border border-white/5 p-12 rounded-[3rem] shadow-xl hover:bg-white/[0.01] transition-all group">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white">{section.title}</h3>
                </div>
                <div className="prose prose-invert max-w-none">
                  {formatContent(section.content)}
                </div>
              </section>
            );
          })}
        </div>

        <div className="col-span-4 space-y-6">
          <div className="bg-[#08080c] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" /> Evidence Grounding
            </h4>
            <div className="space-y-4">
              {existingStrategy.sources.map((source, idx) => (
                <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-indigo-500/20">
                  <div className="flex justify-between items-start gap-3">
                    <p className="text-xs font-bold text-slate-300 leading-tight truncate">{source.title}</p>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  </div>
                  <p className="text-[9px] text-slate-600 truncate mt-2 font-mono">{source.uri}</p>
                </a>
              ))}
              {existingStrategy.sources.length === 0 && <p className="text-[10px] text-slate-600 italic">Scanning public data...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyView;
