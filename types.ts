
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum AppState {
  IDLE,
  RESEARCHING,
  ENHANCING,
  GENERATING,
  PLAYING,
  ERROR,
  PROCESSING_CALENDAR,
  GENERATING_STRATEGY,
  GENERATING_PROPOSAL,
  PUBLISHING,
  DISCOVERING_LEADS,
  OPTIMIZING_PRICING
}

export interface User {
  id: string;
  email: string;
  name: string;
  agencyId: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
  avatarUrl?: string;
}

export interface Agency {
  id: string;
  name: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: number;
}

export enum LogoPlacement {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  CENTER = 'center'
}

export enum LogoSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export type FontSize = number;

export enum AspectRatio {
  SQUARE = '1:1',
  STORY = '9:16',
  BANNER = '16:9'
}

export interface FontPair {
  id: string;
  name: string;
  headlineFamily: string;
  bodyFamily: string;
  category: 'Modern' | 'Elegant' | 'Impact' | 'Tech' | 'Display';
}

export interface Service {
  id: string;
  name: string;
  iconType: string; // e.g., 'wordpress', 'social', 'seo', 'branding'
}

export interface BrandInsight {
  id: string;
  category: string;
  value: string;
  selected: boolean;
}

export interface BrandSource {
  title: string;
  uri: string;
}

export interface ContextFile {
  name: string;
  content: string;
}

export interface ImageFile {
  file: File;
  base64: string;
}

export interface VideoFile {
  file: File;
  base64: string;
}

export interface BrandContext {
  logo?: ImageFile;
  websiteUrl?: string;
  contextFiles: ContextFile[];
  insights: BrandInsight[];
  fontPair?: FontPair;
  brandColors?: string;
}

export interface PosterData {
  headline: string;
  subheadline: string;
  services: Service[];
  ctaText: string;
  brandName: string;
  websiteUrl: string;
  aspectRatio: AspectRatio;
  fontPair: FontPair;
  fontSize: number;
  logoPlacement: LogoPlacement;
  logoSize: LogoSize;
}

export interface PosterStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  gradient: string;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface Client {
  id: string;
  agencyId: string; // SaaS Isolation Key
  name: string;
  industry: string;
  website: string;
  primaryObjective: string;
  monthlyBudget: string;
  brandVoice: string;
  painPoints: string[];
  logo?: ImageFile;
  phoneNumber?: string;
}

export interface StrategySection {
  id: string;
  title: string;
  content: string;
  isRegenerating?: boolean;
}

export interface Strategy {
  id: string;
  clientId: string;
  sections: StrategySection[];
  sources: BrandSource[];
  lastUpdated: number;
}

export interface CampaignContent {
  id: string;
  date: string;
  type: 'POST' | 'STORY' | 'REEL' | 'AD';
  topic: string;
  visualBrief: string;
  status: 'Planned' | 'In Production' | 'Done' | 'Published';
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  platform: 'LinkedIn' | 'Google Ads' | 'Facebook' | 'Instagram' | 'Email';
  status: 'Draft' | 'Active' | 'Completed';
  budget: string;
  roi?: string;
  content?: CampaignContent[];
}

export type CrmStatus = 'Lead' | 'Contacted' | 'Proposal' | 'Won' | 'Lost';

export interface CrmDeal {
  id: string;
  title: string;
  value: number;
  contactName: string;
  contactPhone?: string;
  status: CrmStatus;
  description: string;
  proposalText?: string;
}

export type TaskType = 'MANUAL' | 'APPROVAL_PROPOSAL' | 'KICKOFF' | 'CAMPAIGN_REVIEW';

export interface Task {
  id: string;
  clientId: string;
  text: string;
  completed: boolean;
  type: TaskType;
  relatedEntityId?: string; // e.g. Deal ID or Campaign ID
  dueDate?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Overdue';
}

export interface ManagedFile {
  id: string;
  name: string;
  type: 'Image' | 'Document' | 'Video' | 'Other';
  size: string;
  url: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'client';
  text: string;
  timestamp: string;
  channel: 'Internal' | 'WhatsApp';
}

export type Lead = {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  summary: string;
  confidence?: number;
  sources?: BrandSource[];
}

export interface ChannelConnection {
  id: string;
  platform: string;
  isConnected: boolean;
  lastSynced?: string;
}

export enum VeoModel {
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO = 'veo-3.1-generate-preview'
}

export enum Resolution {
  P720 = '720p',
  P1080 = '1080p'
}

export enum GenerationMode {
  TEXT_TO_VIDEO = 'Text to Video',
  FRAMES_TO_VIDEO = 'Image to Video',
  REFERENCES_TO_VIDEO = 'Reference to Video',
  EXTEND_VIDEO = 'Extend Video'
}

export interface GenerateVideoParams {
  prompt: string;
  model: VeoModel;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  mode: GenerationMode;
  startFrame: ImageFile | null;
  endFrame: ImageFile | null;
  referenceImages: ImageFile[];
  styleImage: ImageFile | null;
  inputVideo: VideoFile | null;
  inputVideoObject: any | null; 
  isLooping: boolean;
}

// --- Pricing Assistant Types ---

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  billingType: 'Hourly' | 'Flat' | 'Retainer' | 'Percentage';
  competitorMin: number;
  competitorMax: number;
  competitorAvg: number;
}

export interface OptimizedServiceRate {
  service_id: string;
  service_name: string;
  category: string;
  optimized_price: string;
  billing_type: string;
  positioning_note: string;
}

export interface OptimizedRateSheet {
  engine_version: string;
  strategy_id: string;
  optimized_rate_sheet: OptimizedServiceRate[];
  global_positioning_statement: string;
  scope_disclaimer: string;
  timestamp?: number;
}
