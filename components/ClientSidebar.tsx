
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Filter, Download, CheckSquare, CreditCard, Folder,
  MessageSquare, ChevronRight, Target, Rocket, Calendar, Brush, Search, BarChart2, Mail, Users, UserPlus, Users2, ChevronDown, Plus, LogOut, Building, ShieldCheck, DollarSign, Menu, X
} from 'lucide-react';
import { Client, Agency, User } from '../types';

interface ClientSidebarProps {
  client: Client;
  clients: Client[];
  activeView: string;
  onViewChange: (view: string) => void;
  onClientChange: (clientId: string) => void;
  currentAgency: Agency;
  currentUser: User;
  onLogout: () => void;
  isAgencyMode?: boolean;
}

interface ViewDef {
  id: string;
  label: string;
  icon: React.ElementType;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ client, clients, activeView, onViewChange, onClientChange, currentAgency, currentUser, onLogout, isAgencyMode = false }) => {
  const [isChannelsOpen, setChannelsOpen] = useState(false);
  const [isClientSwitcherOpen, setClientSwitcherOpen] = useState(false);

  const workflowViews: ViewDef[] = [
    { id: 'OVERVIEW', label: 'Client Overview', icon: LayoutDashboard },
    { id: 'STRATEGY', label: 'Research & Strategy', icon: Target },
    { id: 'CAMPAIGNS', label: 'Campaign Roadmap', icon: Rocket },
    { id: 'SCHEDULE', label: 'Content Schedule', icon: Calendar },
    { id: 'STUDIO', label: 'Creative Studio', icon: Brush },
  ];

  const channelViews: ViewDef[] = [
      { id: 'SEO', label: 'SEO', icon: Search },
      { id: 'PPC', label: 'PPC', icon: BarChart2 },
      { id: 'SOCIAL', label: 'Social', icon: Users },
      { id: 'EMAIL', label: 'Email', icon: Mail },
  ];

  const clientViews: ViewDef[] = [
    { id: 'CRM', label: 'CRM Pipeline', icon: Filter },
    { id: 'TASKS', label: 'Tasks & Approvals', icon: CheckSquare },
    { id: 'INVOICES', label: 'Invoices & Payments', icon: CreditCard },
    { id: 'FILES', label: 'Files & Assets', icon: Folder },
    { id: 'MESSAGES', label: 'Messages/Chat', icon: MessageSquare },
  ];

  // Calculate workflow progress
  const getWorkflowProgress = () => {
    const steps = ['OVERVIEW', 'STRATEGY', 'CAMPAIGNS', 'SCHEDULE', 'STUDIO'];
    const currentIndex = steps.indexOf(activeView);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const isWorkflowView = workflowViews.some(v => v.id === activeView);

  const NavItem: React.FC<{ view: ViewDef, isSubItem?: boolean}> = ({ view, isSubItem = false }) => {
    const isActive = activeView === view.id;
    const isWorkflowItem = workflowViews.some(v => v.id === view.id);

    return (
      <button
        onClick={() => onViewChange(view.id)}
        className={`w-full flex items-center gap-3 text-left rounded-lg transition-all duration-200 ${
          isSubItem ? 'pl-10 pr-3 py-2' : 'px-3 py-2.5'
        } ${
          isActive
            ? 'bg-primary-600/10 text-primary-300 shadow-sm'
            : 'text-secondary hover:bg-neutral-800/50 hover:text-primary'
        } ${isWorkflowItem && isActive ? 'border-l-2 border-primary-500' : ''}`}
      >
        <view.icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-neutral-500'}`} />
        <span className="text-body font-semibold">{view.label}</span>
        {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-gray-900/90 backdrop-blur-3xl border-r border-gray-700 p-4 flex flex-col shrink-0 overflow-y-auto custom-scrollbar z-40">
      
      {/* Agency Branding Header */}
      <div className="mb-6 px-2 flex items-center gap-3">
         <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Building className="w-5 h-5 text-white" />
         </div>
         <div>
            <h2 className="text-body font-black text-primary uppercase tracking-tight leading-tight">{currentAgency.name}</h2>
            <p className="text-micro font-semibold text-muted uppercase tracking-wider">{currentAgency.plan} Plan</p>
         </div>
      </div>

      {/* Agency Overview or Client Switcher */}
      {isAgencyMode ? (
        <div className="mb-6 p-4 card card-body">
          <h3 className="text-caption text-muted font-semibold uppercase tracking-wide mb-3">Agency Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-body-large font-black text-primary">{clients.length}</p>
              <p className="text-micro text-muted font-semibold uppercase tracking-wide">Clients</p>
            </div>
            <div className="text-center">
              <p className="text-body-large font-black text-success-500">${clients.reduce((sum, c) => sum + (Number(c.monthlyBudget) || 0), 0).toLocaleString()}</p>
              <p className="text-micro text-muted font-semibold uppercase tracking-wide">MRR</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mb-6">
          <button
            onClick={() => setClientSwitcherOpen(!isClientSwitcherOpen)}
            className="w-full p-4 card card-body text-left hover:border-neutral-600 transition-all group"
          >
            <p className="text-micro font-semibold uppercase tracking-wide text-muted mb-2">Active Client</p>
            <div className="flex items-center justify-between">
              <h2 className="text-body font-black text-primary truncate pr-2">{client.name || 'Select Client'}</h2>
              <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isClientSwitcherOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {isClientSwitcherOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 card p-2 z-50 animate-scale-in shadow-xl">
              {clients.length > 0 ? clients.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    onClientChange(c.id);
                    setClientSwitcherOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-body font-semibold transition-all ${
                    c.id === client.id
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-secondary hover:bg-neutral-800 hover:text-primary'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <span className="truncate">{c.name}</span>
                </button>
              )) : (
                <div className="p-4 text-center text-secondary font-medium">No clients yet</div>
              )}
              <div className="h-px bg-neutral-700 my-2"></div>
              <button
                onClick={() => {
                  onViewChange('ONBOARDING');
                  setClientSwitcherOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-body font-semibold text-primary-400 hover:bg-primary-500/10 transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Client
              </button>
            </div>
          )}
        </div>
      )}

      <nav className="flex flex-col gap-1.5 flex-1">
        {isAgencyMode ? (
          /* Agency Management Navigation */
          <div>
            <p className="px-3 text-caption text-muted font-black uppercase tracking-widest my-3">Agency Management</p>

            <button
              onClick={() => onViewChange('AGENCY_OVERVIEW')}
              className={`w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-all duration-200 ${
                activeView === 'AGENCY_OVERVIEW'
                  ? 'bg-primary-600/10 text-primary-300 shadow-sm'
                  : 'text-secondary hover:bg-neutral-800/50 hover:text-primary'
              }`}
            >
              <Building className={`w-4 h-4 ${activeView === 'AGENCY_OVERVIEW' ? 'text-primary-400' : 'text-neutral-500'}`} />
              <span className="text-body font-semibold">Agency Dashboard</span>
              {activeView === 'AGENCY_OVERVIEW' && <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>}
            </button>

            <button
              onClick={() => onViewChange('PRICING')}
              className={`w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-all duration-200 ${
                activeView === 'PRICING'
                  ? 'bg-primary-600/10 text-primary-300 shadow-sm'
                  : 'text-secondary hover:bg-neutral-800/50 hover:text-primary'
              }`}
            >
              <DollarSign className={`w-4 h-4 ${activeView === 'PRICING' ? 'text-primary-400' : 'text-neutral-500'}`} />
              <span className="text-body font-semibold">Pricing & Rates</span>
              {activeView === 'PRICING' && <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>}
            </button>
          </div>
        ) : (
          /* Client Management Navigation */
          <>
            {/* Workflow Progress Indicator */}
            {isWorkflowView && (
              <div className="mb-4 px-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-caption text-muted font-semibold uppercase tracking-wide">Workflow Progress</span>
                  <span className="text-micro text-primary-400 font-semibold">{Math.round(getWorkflowProgress())}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${getWorkflowProgress()}%` }}></div>
                </div>
              </div>
            )}

            <div>
               <p className="px-3 text-caption text-muted font-black uppercase tracking-widest my-3">Marketing Workflow</p>
               {workflowViews.map(view => <NavItem key={view.id} view={view} />)}
            </div>

            <div className="mt-4">
                <p className="px-3 text-caption text-muted font-black uppercase tracking-widest my-3">Channel Operations</p>
                <button
                    onClick={() => setChannelsOpen(!isChannelsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-body font-semibold text-secondary hover:bg-neutral-800 hover:text-primary"
                >
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-primary-400" />
                        <span>Marketing Channels</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isChannelsOpen ? 'rotate-90' : ''}`} />
                </button>
                {isChannelsOpen && (
                    <div className="mt-1 space-y-1">
                        {channelViews.map(view => <NavItem key={view.id} view={view} isSubItem />)}
                    </div>
                )}
            </div>

        <div className="mt-4">
            <p className="px-3 text-caption text-muted font-black uppercase tracking-widest my-3">Client Hub</p>
            {clientViews.map(view => <NavItem key={view.id} view={view} />)}
        </div>

        <div className="mt-4">
            <p className="px-3 text-caption text-muted font-black uppercase tracking-widest my-3">Agency Tools</p>
            <button
              onClick={() => onViewChange('PRICING')}
              className={`w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-all duration-200 ${
                activeView === 'PRICING'
                  ? 'bg-primary-600/10 text-primary-300 shadow-sm'
                  : 'text-secondary hover:bg-neutral-800/50 hover:text-primary'
              }`}
            >
              <DollarSign className={`w-4 h-4 ${activeView === 'PRICING' ? 'text-primary-400' : 'text-neutral-500'}`} />
              <span className="text-body font-semibold">Pricing & Rates</span>
              {activeView === 'PRICING' && <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>}
            </button>
        </div>
          </>
        )}
      </nav>

      {/* User Profile Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-700">
         <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center shadow-lg">
              <span className="text-body font-black text-primary">{currentUser.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-body font-bold text-primary truncate">{currentUser.name}</p>
               <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-success-500" />
                  <span className="text-micro font-semibold text-muted uppercase tracking-wide">{currentUser.role}</span>
               </div>
            </div>
         </div>
         <button
            onClick={onLogout}
            className="btn btn-ghost btn-sm w-full gap-2 text-error-400 hover:text-error-300 hover:bg-error-500/10"
         >
            <LogOut className="w-4 h-4" /> Logout Workspace
         </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
