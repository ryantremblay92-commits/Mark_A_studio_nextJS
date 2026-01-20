/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import * as React from 'react';
import { CrmDeal, CrmStatus } from '../../types';
import { Plus, Search, Edit } from 'lucide-react';
import DealModal from './DealModal';

const STAGES: CrmStatus[] = ['Lead', 'Contacted', 'Proposal', 'Won', 'Lost'];

const STAGE_STYLES: Record<CrmStatus, { border: string; text: string; bg: string }> = {
    'Lead': { border: 'border-slate-600', text: 'text-slate-400', bg: 'bg-slate-500/10' },
    'Contacted': { border: 'border-sky-500', text: 'text-sky-400', bg: 'bg-sky-500/10' },
    'Proposal': { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10' },
    'Won': { border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    'Lost': { border: 'border-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10' },
}

interface CrmPipelineViewProps {
    deals: CrmDeal[];
    onUpdateDeal: (deal: CrmDeal) => void;
    onAddDeal: (deal: Omit<CrmDeal, 'id' | 'status'>) => void;
    onGenerateProposal: (dealId: string) => void;
    onOnboardClient: (deal: CrmDeal) => void; // NEW
    isGeneratingProposal: boolean;
    onDiscoverLeads: () => void;
}

const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({ deals, onUpdateDeal, onAddDeal, onGenerateProposal, onOnboardClient, isGeneratingProposal, onDiscoverLeads }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedDeal, setSelectedDeal] = React.useState<CrmDeal | null>(null);
    const [activeFilter, setActiveFilter] = React.useState<CrmStatus | 'All'>('All');

    const openModal = (deal: CrmDeal | null) => {
        setSelectedDeal(deal);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDeal(null);
    };

    const handleSaveDeal = (dealData: Omit<CrmDeal, 'id' | 'status'> | CrmDeal) => {
        if ('id' in dealData) {
            onUpdateDeal(dealData as CrmDeal);
        } else {
            onAddDeal(dealData);
        }
        closeModal();
    };

    const filteredDeals = activeFilter === 'All' ? deals : deals.filter(d => d.status === activeFilter);

    return (
        <>
            <DealModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                deal={selectedDeal}
                onSave={handleSaveDeal}
                onGenerateProposal={onGenerateProposal}
                onOnboardClient={onOnboardClient}
                isGeneratingProposal={isGeneratingProposal}
            />
            <div className="p-12 space-y-8 animate-fade-in-up h-full flex flex-col">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">CRM <span className="text-indigo-500">Pipeline</span></h1>
                    <div className="flex items-center gap-4">
                         <button onClick={onDiscoverLeads} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 text-slate-300 border border-white/5">
                            <Search className="w-3 h-3 text-indigo-400" /> Discover Leads
                        </button>
                        <button onClick={() => openModal(null)} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                            <Plus className="w-3 h-3" /> Add New Deal
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 border-b-2 border-white/5 pb-4">
                    <button onClick={() => setActiveFilter('All')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeFilter === 'All' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>All</button>
                    {STAGES.map(stage => (
                         <button key={stage} onClick={() => setActiveFilter(stage)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${activeFilter === stage ? `${STAGE_STYLES[stage].bg} ${STAGE_STYLES[stage].text}` : 'text-slate-400 hover:bg-white/5'}`}>
                            {stage}
                            <span className="text-xs font-mono bg-black/20 px-1.5 py-0.5 rounded">{deals.filter(d => d.status === stage).length}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                    <div className="space-y-4">
                        {filteredDeals.length > 0 ? filteredDeals.map(deal => (
                            <div key={deal.id} className="bg-[#08080c] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/[0.03] transition-all">
                                <div className={`w-2 h-10 rounded-full ${STAGE_STYLES[deal.status].bg.replace('/10', '/50')}`}></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{deal.title}</h4>
                                    <p className="text-xs text-slate-400">{deal.contactName}</p>
                                </div>
                                <div className="text-right">
                                     <span className="font-bold text-white">${deal.value.toLocaleString()}</span>
                                     <p className={`text-[9px] font-bold uppercase tracking-widest ${STAGE_STYLES[deal.status].text}`}>{deal.status}</p>
                                </div>
                                <button onClick={() => openModal(deal)} className="p-3 bg-white/5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-indigo-600/50 transition-all">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-600 border border-dashed border-white/5 rounded-3xl">
                                <Search className="w-12 h-12 opacity-10 mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest italic">No active deals in pipeline</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrmPipelineView;
