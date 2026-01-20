
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Agency, User } from '../types';

const DB_KEY = 'MARKA_STUDIO_SAAS_DB_V1';

interface AgencyData {
  clients: any[];
  activeClientId: string;
  campaigns: any[];
  deals: any[];
  strategies: any[];
  tasks: any[];
  messages: any;
  clientFiles: any;
  activeView: string;
}

interface GlobalState {
  agencies: Agency[];
  users: User[];
  agencyData: Record<string, AgencyData>; // Keyed by Agency ID
}

const getGlobalState = (): GlobalState => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data) return { agencies: [], users: [], agencyData: {} };
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load DB", e);
    return { agencies: [], users: [], agencyData: {} };
  }
};

const saveGlobalState = (state: GlobalState) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save DB", e);
  }
};

// --- AUTH METHODS ---

export const registerAgency = (agencyName: string, email: string, password: string): { user: User, agency: Agency } => {
  const state = getGlobalState();
  
  // Check if user exists
  if (state.users.find(u => u.email === email)) {
    throw new Error("User already exists");
  }

  const newAgency: Agency = {
    id: `agency-${Date.now()}`,
    name: agencyName,
    plan: 'FREE',
    createdAt: Date.now()
  };

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name: email.split('@')[0], // simplistic name derivation
    agencyId: newAgency.id,
    role: 'ADMIN'
  };

  // Update State
  state.agencies.push(newAgency);
  state.users.push(newUser);
  state.agencyData[newAgency.id] = {
    clients: [],
    activeClientId: '',
    campaigns: [],
    deals: [],
    strategies: [],
    tasks: [],
    messages: {},
    clientFiles: {},
    activeView: 'CRM'
  };

  saveGlobalState(state);
  return { user: newUser, agency: newAgency };
};

export const loginUser = (email: string): { user: User, agency: Agency } | null => {
  const state = getGlobalState();
  const user = state.users.find(u => u.email === email); // In a real app, verify password
  
  if (!user) return null;

  const agency = state.agencies.find(a => a.id === user.agencyId);
  if (!agency) return null;

  return { user, agency };
};

// --- DATA METHODS ---

export const saveAgencyData = (agencyId: string, data: Partial<AgencyData>) => {
  const state = getGlobalState();
  if (!state.agencyData[agencyId]) {
    state.agencyData[agencyId] = {} as AgencyData;
  }
  
  state.agencyData[agencyId] = { ...state.agencyData[agencyId], ...data };
  saveGlobalState(state);
};

export const loadAgencyData = (agencyId: string): AgencyData | null => {
  const state = getGlobalState();
  return state.agencyData[agencyId] || null;
};

export const clearDatabase = () => {
  localStorage.removeItem(DB_KEY);
};
