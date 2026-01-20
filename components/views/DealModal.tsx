/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import * as React from 'react';
import { CrmDeal, CrmStatus } from '../../types';
import { X, Sparkles, Cpu, Clipboard, MessageSquare, Rocket, UserPlus } from 'lucide-react';

const STAGES: CrmStatus[] = ['Lead', 'Contacted', 'Proposal', 'Won', 'Lost'];

interface DealModalProps {
    isOpen: boolean;
    onClose: () => void;
    deal: CrmDeal | null;
    onSave: (deal: Omit<CrmDeal, 'id' | 'status'> | CrmDeal) => void;
    onGenerateProposal: (dealId: string) => void;
    onOnboardClient: (deal: CrmDeal) => void; // NEW
    isGeneratingProposal: boolean;
}

const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, deal, onSave, onGenerateProposal, onOnboardClient, isGeneratingProposal }) => {
    const [formData, setFormData] = React.useState({
        title: '',
        contactName: '',
        contactPhone: '',
        value: 0,
        description: '',
        status: 'Lead' as CrmStatus,
    });
    const [hasCopied, setHasCopied] = React.useState(false);

    React.useEffect(() => {
        if (deal) {
            setFormData({
                title: deal.title,
                contactName: deal.contactName,
                contactPhone: deal.contactPhone || '',
                value: deal.value,
                description: deal.description || '',
                status: deal.status,
            });
        } else {
            setFormData({ title: '', contactName: '', contactPhone: '', value: 0, description: '', status: 'Lead' });
        }
    }, [deal, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'value' ? parseInt(value) || 0 : value }));
    };

    const handleSave = () => {
        if (deal) {
            onSave({ ...deal, ...formData });
        } else {
            onSave(formData);
        }
    };

    const handleWhatsApp = () => {
        if (!formData.contactPhone) return;
        const msg = encodeURIComponent(`Hello ${formData.contactName}, this is MarkA Studio regarding our ${formData.title} discussion.`);
        window.open(`https://wa.me/${formData.contactPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    };

    const handleCopyProposal = () => {
        if (deal?.proposalText) {
            navigator.clipboard.writeText(deal.proposalText);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-[#08080c] border border-white/5 rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-8 text-left flex flex-col max-h-[90vh] animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">{deal ? 'Edit Deal' : 'Create New Deal'}</h2>
                    <div className="flex items-center gap-3">
                        {deal && formData.status === 'Won' && (
                            <button 
                                onClick={() => onOnboardClient(deal)}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                            >
                                <Rocket className="w-3.5 h-3.5" /> Onboard as Client
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-500"><X className="w-5 h-5" /></button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Deal Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-medium focus:border-indigo-500 outline-none transition-all"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Contact Name</label>
                                <input name="contactName" value={formData.contactName} onChange={handleChange} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-medium focus:border-indigo-500 outline-none transition-all"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Contact Phone</label>
                                <div className="flex gap-2">
                                    <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="+1..." className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-medium focus:border-indigo-500 outline-none transition-all"/>
                                    {formData.contactPhone && (
                                        <button onClick={handleWhatsApp} className="px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-all">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Value ($)</label>
                                <input name="value" type="number" value={formData.value} onChange={handleChange} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-medium focus:border-indigo-500 outline-none transition-all"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-medium focus:border-indigo-500 outline-none transition-all appearance-none">
                                    {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Description / Scope</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-medium focus:border-indigo-500 outline-none transition-all custom-scrollbar"></textarea>
                        </div>
                        
                        {formData.status === 'Proposal' && deal && (
                            <div className="pt-4 border-t border-white/5">
                                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" /> AI Proposal Engine
                                </h3>
                                {deal.proposalText ? (
                                    <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
                                        <div className="prose prose-sm prose-invert max-h-48 overflow-y-auto custom-scrollbar mb-4 text-slate-300 text-[11px] leading-relaxed" dangerouslySetInnerHTML={{ __html: deal.proposalText.replace(/\n/g, '<br />') }}></div>
                                        <button onClick={handleCopyProposal} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                                            <Clipboard className="w-3.5 h-3.5" /> {hasCopied ? 'Copied to Clipboard' : 'Copy Proposal Text'}
                                        </button>
                                    </div>
                                ) : (
                                     <button onClick={() => onGenerateProposal(deal.id)} disabled={isGeneratingProposal} className="w-full flex items-center justify-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">
                                        {isGeneratingProposal ? <><Cpu className="w-4 h-4 animate-spin"/> Architecting Proposal...</> : <><Sparkles className="w-4 h-4"/> Generate Targeted Proposal</>}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/5">
                    <button onClick={onClose} className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-slate-400 transition-all">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default DealModal;
