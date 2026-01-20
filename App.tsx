
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
"use client";

import * as React from 'react';
import { 
  Zap, FileText, Cpu, Target, Search, Plus
} from 'lucide-react';
import { 
  AppState, LogoPlacement, LogoSize, BrandContext, HistoryItem, AspectRatio, FontPair, Client, Campaign, CrmDeal, Lead, Strategy, Message, ManagedFile, Task, TaskType, ChannelConnection, ContextFile,
  User, Agency
} from './types';
import { 
  generatePosterImage, 
  extractBrandInsights,
  enhancePrompt,
  generateProposal
} from './services/geminiService';
import { discoverLeads } from './services/leadGenerationService';
import { saveAgencyData, loadAgencyData } from './services/storageService';
import GenericApiKeyDialog from './components/GenericApiKeyDialog';
import ClientSidebar from './components/ClientSidebar';
import LeadDiscoveryModal from './components/views/LeadDiscoveryModal';
import AuthView from './components/views/AuthView';

// Views
import OverviewView from './components/views/OverviewView';
import ChannelsView from './components/views/ChannelsView';
import TasksView from './components/views/TasksView';
import InvoicesView from './components/views/InvoicesView';
import FilesView from './components/views/FilesView';
import MessagesView from './components/views/MessagesView';
import ClientViewPlaceholder from './components/ClientViewPlaceholder';
import StudioView from './components/views/StudioView';
import OnboardingView from './components/views/OnboardingView';
import StrategyView from './components/views/StrategyView';
import CampaignsView from './components/views/CampaignsView';
import ScheduleView from './components/views/ScheduleView';
import PricingView from './components/views/PricingView';

const CrmPipelineView = React.lazy(() => import('./components/views/CrmPipelineView'));

const App: React.FC = () => {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [currentAgency, setCurrentAgency] = React.useState<Agency | null>(null);

  // --- APP STATE ---
  const [appState, setAppState] = React.useState<AppState>(AppState.IDLE);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [activeClientId, setActiveClientId] = React.useState<string>('');
  const [activeView, setActiveView] = React.useState('CRM');
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [deals, setDeals] = React.useState<CrmDeal[]>([]);
  const [strategies, setStrategies] = React.useState<Strategy[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [messages, setMessages] = React.useState<Record<string, Message[]>>({});
  const [clientFiles, setClientFiles] = React.useState<Record<string, ManagedFile[]>>({});
  const [isLeadDiscoveryOpen, setIsLeadDiscoveryOpen] = React.useState(false);
  const [leadDiscoveryResults, setLeadDiscoveryResults] = React.useState<Lead[]>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);
  // Mock channel connections state for now
  const [channelConnections, setChannelConnections] = React.useState<ChannelConnection[]>([
      { id: 'conn-1', platform: 'Google Search Console', isConnected: true },
      { id: 'conn-2', platform: 'Instagram / LinkedIn API', isConnected: true }
  ]);

  // Persistence: Load Data ONLY when user is logged in
  React.useEffect(() => {
    if (currentUser && currentAgency) {
      const savedData = loadAgencyData(currentAgency.id);
      if (savedData) {
        setClients(savedData.clients || []);
        setActiveClientId(savedData.activeClientId || '');
        setCampaigns(savedData.campaigns || []);
        setDeals(savedData.deals || []);
        setStrategies(savedData.strategies || []);
        setTasks(savedData.tasks || []);
        setMessages(savedData.messages || {});
        setClientFiles(savedData.clientFiles || {});
        setActiveView(savedData.activeView || 'CRM');
      } else {
        // Initialize Fresh Agency State
        setClients([]);
        setActiveClientId('');
        setDeals([]);
        // ... init others
      }
    }
  }, [currentUser, currentAgency]);

  // Persistence: Save Data scoped to Agency
  React.useEffect(() => {
    if (currentUser && currentAgency) {
      saveAgencyData(currentAgency.id, {
        clients, activeClientId, campaigns, deals, strategies, tasks, messages, clientFiles, activeView
      });
    }
  }, [clients, activeClientId, campaigns, deals, strategies, tasks, messages, clientFiles, activeView, currentUser, currentAgency]);

  const activeClient = React.useMemo(() => {
    return clients.find(c => c.id === activeClientId) || clients[0];
  }, [clients, activeClientId]);

  const currentClientCampaigns = React.useMemo(() => campaigns.filter(c => c.clientId === activeClientId), [campaigns, activeClientId]);
  const currentClientStrategy = React.useMemo(() => strategies.find(s => s.clientId === activeClientId), [strategies, activeClientId]);
  const currentClientTasks = React.useMemo(() => tasks.filter(t => t.clientId === activeClientId), [tasks, activeClientId]);

  // --- HANDLERS ---

  const handleLogin = (user: User, agency: Agency) => {
    setCurrentUser(user);
    setCurrentAgency(agency);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentAgency(null);
    setClients([]); // Clear state for security
  };

  const handleManualOnboardingComplete = (newClient: Client, initialFiles?: ContextFile[]) => {
    if (!currentAgency) return;
    // Enforce Isolation
    const clientWithAgency = { ...newClient, agencyId: currentAgency.id };
    setClients(prev => [...prev, clientWithAgency]);
    setActiveClientId(newClient.id);
    setActiveView('OVERVIEW');
  };

  const handleUpdateStrategy = (strategy: Strategy) => {
    setStrategies(prev => {
      const otherStrategies = prev.filter(s => s.clientId !== strategy.clientId);
      return [...otherStrategies, strategy];
    });
  };

  const handleGenerateProposal = async (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal || !activeClient) return;
    setAppState(AppState.GENERATING_PROPOSAL);
    try {
        const proposalText = await generateProposal(activeClient, deal);
        setDeals(prev => prev.map(d => d.id === dealId ? {...d, proposalText} : d));
    } catch (e) {
      console.error(e);
    } finally {
        setAppState(AppState.IDLE);
    }
  };
  
  const handleConnectChannel = (platform: string) => {
      setChannelConnections(prev => [...prev, { id: `conn-${Date.now()}`, platform, isConnected: true }]);
  };

  const renderActiveView = () => {
    switch(activeView) {
      case 'OVERVIEW': 
        if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
        return <OverviewView client={activeClient} campaigns={currentClientCampaigns} activities={[]} />;
      
      case 'CRM': 
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center h-full"><Cpu className="animate-spin text-indigo-500" /></div>}>
            <CrmPipelineView 
              deals={deals} 
              onUpdateDeal={d => setDeals(prev => prev.map(old => old.id === d.id ? d : old))}
              onAddDeal={d => setDeals(prev => [{...d, id: `deal-${Date.now()}`, status: 'Lead'}, ...prev])}
              onGenerateProposal={handleGenerateProposal}
              onOnboardClient={d => handleManualOnboardingComplete({id: `c-${Date.now()}`, agencyId: currentAgency!.id, name: d.contactName, industry: 'TBD', website: '', primaryObjective: 'Scale', monthlyBudget: '0', brandVoice: 'TBD', painPoints: []})}
              isGeneratingProposal={appState === AppState.GENERATING_PROPOSAL}
              onDiscoverLeads={() => setIsLeadDiscoveryOpen(true)}
            />
          </React.Suspense>
        );

      case 'STRATEGY': 
        if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
        return <StrategyView client={activeClient} onStrategyUpdated={handleUpdateStrategy} existingStrategy={currentClientStrategy} />;
      
      case 'CAMPAIGNS': 
        if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
        return <CampaignsView client={activeClient} campaigns={currentClientCampaigns} onAddCampaign={c => setCampaigns(prev => [...prev, c])} onUpdateCampaign={c => setCampaigns(prev => prev.map(old => old.id === c.id ? c : old))} strategyContext={currentClientStrategy?.sections.map(s => s.content).join('\n')} onGoToStudio={(p) => setActiveView('STUDIO')} />;
      
      case 'SCHEDULE':
        if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
        return <ScheduleView campaigns={currentClientCampaigns} clientName={activeClient.name} />;

      case 'STUDIO': 
        if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
        return <StudioView client={activeClient} activeStrategy={currentClientStrategy} />;
      
      case 'PRICING': return <PricingView />;
      
      case 'TASKS':
         if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
         return (
             <TasksView 
                tasks={currentClientTasks}
                onUpdateTask={(t) => setTasks(prev => prev.map(old => old.id === t.id ? t : old))}
                onAddTask={(text) => setTasks(prev => [...prev, {
                    id: `task-${Date.now()}`,
                    clientId: activeClientId,
                    text,
                    completed: false,
                    type: 'MANUAL'
                }])}
                onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
             />
         );

      case 'INVOICES':
         if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
         return <InvoicesView />;

      case 'FILES':
         if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
         return (
            <FilesView 
              files={clientFiles[activeClientId] || []}
              onAddFile={(file) => setClientFiles(prev => ({
                 ...prev,
                 [activeClientId]: [...(prev[activeClientId] || []), file]
              }))}
            />
         );

      case 'MESSAGES':
         if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
         return (
            <MessagesView 
               client={activeClient}
               messages={messages[activeClientId] || []}
               clientFiles={clientFiles[activeClientId] || []}
               onSendMessage={(text, channel) => setMessages(prev => ({
                   ...prev,
                   [activeClientId]: [...(prev[activeClientId] || []), {
                       id: `msg-${Date.now()}`,
                       sender: 'user',
                       text,
                       timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                       channel
                   }]
               }))}
            />
         );
      
      case 'SEO':
      case 'PPC':
      case 'SOCIAL':
      case 'EMAIL':
         if (!activeClient) return <ClientViewPlaceholder viewName="Select a Client" />;
         return (
            <ChannelsView 
               channelName={activeView}
               client={activeClient}
               campaigns={currentClientCampaigns}
               connections={channelConnections}
               onConnect={handleConnectChannel}
               onViewChange={setActiveView}
               onAddNotification={(msg) => alert(msg)}
            />
         );

      case 'ONBOARDING': return <OnboardingView onComplete={handleManualOnboardingComplete} onCancel={() => setActiveView('CRM')} />;
      default: return <ClientViewPlaceholder viewName={activeView} />;
    }
  };

  // --- RENDER ---

  if (!currentUser || !currentAgency) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="h-full flex bg-gray-900 overflow-hidden">
      <ClientSidebar 
        client={activeClient || { name: 'No Client Selected' } as Client} 
        clients={clients} 
        activeView={activeView}
        onViewChange={setActiveView} 
        onClientChange={setActiveClientId}
        currentAgency={currentAgency}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
        {renderActiveView()}
      </main>
      <LeadDiscoveryModal
        isOpen={isLeadDiscoveryOpen} onClose={() => setIsLeadDiscoveryOpen(false)}
        onSearch={async (c, l) => { 
          if (!activeClient) return;
          setAppState(AppState.DISCOVERING_LEADS); 
          const res = await discoverLeads(activeClient, c, l); 
          setLeadDiscoveryResults(res); 
          setAppState(AppState.IDLE); 
        }}
        onAddLead={l => setDeals(prev => [{id: `d-${Date.now()}`, title: `${l.name} Discovery`, contactName: l.name, value: 0, status: 'Lead', description: l.summary}, ...prev])}
        isLoading={appState === AppState.DISCOVERING_LEADS} results={leadDiscoveryResults} error={null}
      />
      {showApiKeyDialog && <GenericApiKeyDialog onContinue={() => setShowApiKeyDialog(false)} />}
    </div>
  );
};

export default App;
