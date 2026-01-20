
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { 
  LayoutDashboard, TrendingUp, Filter, Download, CheckSquare, CreditCard, Folder, 
  MessageSquare, ChevronRight, Target, Rocket, Calendar, Brush, Search, BarChart2, Mail, Users, UserPlus, Users2, ChevronDown, Plus, LogOut, Building, ShieldCheck, DollarSign
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
}

interface ViewDef {
  id: string;
  label: string;
  icon: React.ElementType;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ client, clients, activeView, onViewChange, onClientChange, currentAgency, currentUser, onLogout }) => {
  const [isChannelsOpen, setChannelsOpen] = useState(false);
  const [isClientSwitcherOpen, setClientSwitcherOpen] = useState(false);

  const mainViews: ViewDef[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
    { id: 'STRATEGY', label: 'Research & Strategy', icon: Target },
    { id: 'CAMPAIGNS', label: 'Roadmap', icon: Rocket },
    { id: 'SCHEDULE', label: 'Schedule', icon: Calendar },
    { id: 'STUDIO', label: 'Studio', icon: Brush },
  ];

  const clientManagementViews: ViewDef[] = [
    { id: 'CRM', label: 'CRM Pipeline', icon: Filter },
    { id: 'TASKS', label: 'Tasks & Approvals', icon: CheckSquare },
    { id: 'PRICING', label: 'Pricing & Packages', icon: DollarSign },
    { id: 'INVOICES', label: 'Invoices & Payments', icon: CreditCard },
    { id: 'FILES', label: 'Files & Assets', icon: Folder },
    { id: 'MESSAGES', label: 'Messages/Chat', icon: MessageSquare },
  ];

  const channelViews: ViewDef[] = [
      { id: 'SEO', label: 'SEO', icon: Search },
      { id: 'PPC', label: 'PPC', icon: BarChart2 },
      { id: 'SOCIAL', label: 'Social', icon: Users },
      { id: 'EMAIL', label: 'Email', icon: Mail },
  ];

  const NavItem: React.FC<{ view: ViewDef, isSubItem?: boolean}> = ({ view, isSubItem = false }) => (
    <button 
      onClick={() => onViewChange(view.id)}
      className={`w-full flex items-center gap-3 text-left rounded-lg transition-colors text-xs font-bold ${ isSubItem ? 'pl-10 pr-3 py-2' : 'px-3 py-2.5'} ${activeView === view.id ? 'bg-indigo-600/10 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
    >
      <view.icon className="w-4 h-4" />
      <span>{view.label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-gray-900/90 backdrop-blur-3xl border-r border-gray-700 p-4 flex flex-col shrink-0 overflow-y-auto custom-scrollbar z-40">
      
      {/* Agency Branding Header */}
      <div className="mb-8 px-2 flex items-center gap-3">
         <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Building className="w-4 h-4 text-white" />
         </div>
         <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight leading-none">{currentAgency.name}</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{currentAgency.plan} Plan</p>
         </div>
      </div>

      {/* Client Switcher */}
      <div className="relative mb-4">
        <button 
          onClick={() => setClientSwitcherOpen(!isClientSwitcherOpen)}
          className="w-full p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left hover:bg-white/5 transition-all group"
        >
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Client</p>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white truncate pr-2">{client.name || 'Select Client'}</h2>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isClientSwitcherOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isClientSwitcherOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl p-1 z-50 animate-fade-in-up">
            {clients.length > 0 ? clients.map(c => (
              <button 
                key={c.id}
                onClick={() => {
                  onClientChange(c.id);
                  setClientSwitcherOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${c.id === client.id ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Users2 className="w-3 h-3" />
                </div>
                <span className="truncate">{c.name}</span>
              </button>
            )) : (
              <div className="p-3 text-center text-xs text-slate-400">No clients yet.</div>
            )}
            <div className="h-px bg-white/5 my-1"></div>
            <button 
              onClick={() => {
                onViewChange('ONBOARDING');
                setClientSwitcherOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-600/10"
            >
              <Plus className="w-3 h-3" /> New Client
            </button>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        <div>
           <p className="px-3 text-[8px] font-black uppercase tracking-widest text-slate-700 my-2">Marketing Pipeline</p>
           {mainViews.map(view => <NavItem key={view.id} view={view} />)}
        </div>
        
        <div className="mt-2">
            <p className="px-3 text-[8px] font-black uppercase tracking-widest text-slate-700 my-2">Client Management</p>
            <button 
                onClick={() => setChannelsOpen(!isChannelsOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-slate-200"
            >
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Channels</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isChannelsOpen ? 'rotate-90' : ''}`} />
            </button>
            {isChannelsOpen && (
                <div className="mt-1 space-y-1">
                    {channelViews.map(view => <NavItem key={view.id} view={view} isSubItem />)}
                </div>
            )}
            {clientManagementViews.map(view => <NavItem key={view.id} view={view} />)}
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="mt-4 pt-4 border-t border-white/5">
         <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{currentUser.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
               <div className="flex items-center gap-1 text-[9px] text-slate-500">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> {currentUser.role}
               </div>
            </div>
         </div>
         <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
         >
            <LogOut className="w-3.5 h-3.5" /> Logout Workspace
         </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
