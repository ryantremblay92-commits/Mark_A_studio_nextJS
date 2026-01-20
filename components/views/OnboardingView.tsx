
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { 
  Building2, Globe, Phone, Target, Wallet, Volume2, AlertTriangle, 
  Upload, Rocket, X, Plus, FileText, Trash2
} from 'lucide-react';
import { Client, ImageFile, ContextFile } from '../../types';

interface OnboardingViewProps {
  onComplete: (client: Client, initialFiles?: ContextFile[]) => void;
  onCancel: () => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    industry: '',
    website: '',
    phoneNumber: '',
    primaryObjective: 'Growth',
    monthlyBudget: '',
    brandVoice: 'Professional',
    painPoints: []
  });

  const [logo, setLogo] = useState<ImageFile | null>(null);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [currentPainPoint, setCurrentPainPoint] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo({
          file,
          base64: (reader.result as string).split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContextFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: ContextFile[] = await Promise.all(
        Array.from(files).map(async (file: File) => ({
          name: file.name,
          content: await file.text()
        }))
      );
      setContextFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeContextFile = (index: number) => {
    setContextFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addPainPoint = () => {
    if (currentPainPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        painPoints: [...(prev.painPoints || []), currentPainPoint.trim()]
      }));
      setCurrentPainPoint('');
    }
  };

  const removePainPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newClient: Client = {
      id: `client-${Date.now()}`,
      agencyId: '', // Placeholder, populated by parent component
      name: formData.name || 'Unnamed Client',
      industry: formData.industry || 'General',
      website: formData.website || '',
      phoneNumber: formData.phoneNumber || '',
      primaryObjective: formData.primaryObjective || 'Growth',
      monthlyBudget: formData.monthlyBudget || '0',
      brandVoice: formData.brandVoice || 'Professional',
      painPoints: formData.painPoints || [],
      logo: logo || undefined
    };

    onComplete(newClient, contextFiles);
  };

  return (
    <div className="p-12 animate-fade-in-up max-w-5xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Manual <span className="text-indigo-500">Onboarding</span></h1>
          <p className="text-sm text-slate-500 font-bold uppercase mt-1">Initialize a new strategic partnership</p>
        </div>
        <button onClick={onCancel} className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Identity */}
        <section className="bg-[#08080c] border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Brand Identity</h3>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Company Name *</label>
              <input 
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Industry</label>
              <input 
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Luxury Tech"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone (WhatsApp Contact)</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Brand Logo</label>
             <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
                  {logo ? <img src={`data:image/png;base64,${logo.base64}`} className="w-full h-full object-contain p-2" /> : <Building2 className="w-8 h-8 text-slate-800" />}
                </div>
                <label className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all cursor-pointer flex items-center gap-2 text-slate-300">
                  <Upload className="w-3.5 h-3.5" /> {logo ? 'Change Logo' : 'Upload Logo'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
             </div>
          </div>
        </section>

        {/* Section 2: Strategic Context (Optional) */}
        <section className="bg-[#08080c] border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Strategic Context <span className="text-[10px] text-slate-500 lowercase font-medium">(Optional)</span></h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Company Website</label>
            <div className="relative">
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                placeholder="https://acme.com"
              />
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Knowledge Base / Initial Documents</label>
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-4">Upload PDF briefs, brand dossiers, or market research files.</p>
             
             <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 bg-black/20 rounded-[2rem] p-8 hover:bg-white/[0.02] hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 text-slate-700 group-hover:text-indigo-500 transition-colors mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400">Select Files</span>
                  <input type="file" multiple className="hidden" onChange={handleContextFileUpload} />
                </label>

                <div className="space-y-2">
                   {contextFiles.length > 0 ? contextFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group animate-scale-in">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{file.name}</span>
                        </div>
                        <button type="button" onClick={() => removeContextFile(idx)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   )) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-800">
                        <FileText className="w-10 h-10 opacity-10 mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest">No documents staged</span>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </section>

        {/* Section 3: Strategy & DNA */}
        <section className="bg-[#08080c] border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/10 text-pink-400 rounded-xl flex items-center justify-center border border-pink-500/20">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Strategic DNA</h3>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Primary Objective</label>
              <select 
                name="primaryObjective"
                value={formData.primaryObjective}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all appearance-none"
              >
                <option value="Lead Gen">Lead Generation</option>
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="User Retention">User Retention</option>
                <option value="Market Expansion">Market Expansion</option>
                <option value="Direct Sales">Direct Sales</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Monthly Budget ($)</label>
              <div className="relative">
                <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  name="monthlyBudget"
                  type="number"
                  value={formData.monthlyBudget}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Brand Voice</label>
              <div className="relative">
                <Volume2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  name="brandVoice"
                  value={formData.brandVoice}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Bold, Professional, Playful"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Client Pain Points</label>
             <div className="flex gap-3">
                <input 
                  value={currentPainPoint}
                  onChange={e => setCurrentPainPoint(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPainPoint())}
                  className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                  placeholder="Describe a struggle..."
                />
                <button type="button" onClick={addPainPoint} className="bg-white/5 hover:bg-white/10 px-8 rounded-2xl transition-all">
                  <Plus className="w-5 h-5 text-indigo-400" />
                </button>
             </div>
             <div className="flex flex-wrap gap-2">
                {formData.painPoints?.map((point, idx) => (
                  <div key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group">
                    <AlertTriangle className="w-3 h-3" />
                    {point}
                    <button type="button" onClick={() => removePainPoint(idx)} className="opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  </div>
                ))}
             </div>
          </div>
        </section>

        <div className="flex justify-end gap-6 pb-20">
          <button type="button" onClick={onCancel} className="px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 text-slate-500 transition-all">Discard</button>
          <button type="submit" className="px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_20px_40px_rgba(79,70,229,0.3)] flex items-center gap-3 transition-all group">
            Complete Onboarding <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingView;
