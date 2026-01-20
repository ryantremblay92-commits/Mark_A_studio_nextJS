/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import * as React from 'react';
import { CrmDeal, CrmStatus } from '../../types';
import { Plus, Search, Edit, TrendingUp, Target, BarChart3, Users } from 'lucide-react';
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

    // Calculate pipeline metrics
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = deals.filter(d => d.status === 'Won');
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const conversionRate = deals.length > 0 ? (wonDeals.length / deals.length * 100).toFixed(1) : '0';

    // Calculate deal velocity (days in pipeline)
    const avgDealAge = deals.length > 0
        ? Math.round(deals.reduce((sum, deal) => {
            const age = Date.now() - (deal as any).createdAt || Date.now() - Date.parse('2024-01-01');
            return sum + (age / (1000 * 60 * 60 * 24));
          }, 0) / deals.length)
        : 0;

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
                {/* Enhanced Header with Workflow Context */}
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-caption text-muted">
                        <span className="text-primary-400">Client</span>
                        <span className="text-neutral-600">→</span>
                        <span className="text-primary-400 font-semibold">CRM Pipeline</span>
                    </nav>

                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="font-black italic">CRM <span className="text-primary-400">Pipeline</span></h1>
                            <p className="text-caption text-muted font-semibold mt-2">Lead management and deal conversion tracking</p>
                        </div>

                        {/* Pipeline Metrics */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-caption text-muted font-semibold">Total Pipeline</div>
                                    <div className="text-body font-black text-primary">${totalValue.toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-caption text-muted font-semibold">Conversion</div>
                                    <div className="text-body font-black text-success-500">{conversionRate}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-caption text-muted font-semibold">Avg. Age</div>
                                    <div className="text-body font-black text-warning-500">{avgDealAge}d</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Workflow Progress */}
                    <div className="flex items-center gap-4 p-4 card">
                        <div className="flex items-center gap-2 text-caption text-muted">
                            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                            <span>Lead Discovery</span>
                        </div>
                        <div className="flex items-center gap-2 text-caption text-muted">
                            <div className="w-2 h-2 rounded-full bg-success-500"></div>
                            <span>Qualification</span>
                        </div>
                        <div className="flex items-center gap-2 text-caption text-muted">
                            <div className="w-2 h-2 rounded-full bg-success-500"></div>
                            <span>Proposal</span>
                        </div>
                        <div className="flex items-center gap-2 text-caption text-muted">
                            <div className="w-2 h-2 rounded-full bg-success-500"></div>
                            <span>Closure</span>
                        </div>
                        <div className="flex-1 h-px bg-neutral-700"></div>
                        <div className="flex items-center gap-2 text-caption text-muted">
                            <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                            <span>Onboarding</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                         <button onClick={onDiscoverLeads} className="btn btn-outline btn-md gap-2 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400">
                            <Search className="w-4 h-4" /> Discover Leads
                        </button>
                        <button onClick={() => openModal(null)} className="btn btn-primary btn-md gap-2">
                            <Plus className="w-4 h-4" /> Add New Deal
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
                        {filteredDeals.length > 0 ? filteredDeals.map(deal => {
                            // Calculate lead score based on value, contact info, and stage
                            const leadScore = Math.min(100, Math.round(
                                (deal.value / 10000 * 30) + // Value factor
                                (deal.contactPhone ? 20 : 0) + // Contact info factor
                                (STAGES.indexOf(deal.status) * 15) + // Stage progression factor
                                Math.random() * 20 // Random factor for demo
                            ));

                            const scoreColor = leadScore >= 80 ? 'success' : leadScore >= 60 ? 'warning' : 'error';

                            return (
                                <div key={deal.id} className="card p-6 group hover:border-neutral-600 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-12 rounded-full bg-${STAGE_STYLES[deal.status].text.split('-')[1]}-500/60`}></div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="text-body font-bold text-primary">{deal.title}</h4>
                                                    <p className="text-caption text-muted">{deal.contactName}</p>
                                                </div>

                                                {/* Lead Score Badge */}
                                                <div className={`badge badge-${scoreColor} gap-1`}>
                                                    <Target className="w-3 h-3" />
                                                    {leadScore}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-body-large font-black text-primary">
                                                        ${deal.value.toLocaleString()}
                                                    </span>
                                                    <span className={`badge badge-neutral`}>
                                                        {deal.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {deal.status === 'Proposal' && (
                                                        <button
                                                            onClick={() => onGenerateProposal(deal.id)}
                                                            disabled={isGeneratingProposal}
                                                            className="btn btn-outline btn-sm gap-1"
                                                        >
                                                            Generate Proposal
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => openModal(deal)}
                                                        className="btn btn-ghost btn-sm p-2 hover:bg-neutral-800"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="empty-state">
                                <Users className="empty-state-icon" />
                                <h3 className="empty-state-title">Pipeline is Empty</h3>
                                <p className="empty-state-description">
                                    Start building your sales pipeline by discovering leads or manually adding deals.
                                    Track progress through qualification, proposals, and closure.
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <button onClick={onDiscoverLeads} className="btn btn-primary btn-md gap-2">
                                        <Search className="w-4 h-4" />
                                        Discover Leads
                                    </button>
                                    <button onClick={() => openModal(null)} className="btn btn-outline btn-md gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Deal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrmPipelineView;
