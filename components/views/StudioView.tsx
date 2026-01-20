
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import * as React from 'react';
import { Sparkles, RotateCcw, Target, Text, Cpu } from 'lucide-react';
import { 
  AppState, LogoPlacement, LogoSize, BrandContext, HistoryItem, AspectRatio, FontPair, Client, Service, PosterData, PosterStyle, Strategy 
} from '../../types';
import { generatePosterImage, extractBrandInsights, enhancePrompt } from '../../services/geminiService';
import PosterPreview from '../PosterPreview';
import PosterCanvas from '../PosterCanvas';
import StyleSelector, { DEFAULT_STYLES } from '../StyleSelector';
import GalleryStrip from '../GalleryStrip';

interface StudioViewProps {
    client: Client;
    initialPrompt?: string;
    activeStrategy?: Strategy;
    campaignContext?: any; // Campaign data for context
    scheduleContext?: any; // Schedule data for context
}

const FONT_PAIRS: FontPair[] = [
  { id: 'p1', name: 'Inter Pro', headlineFamily: "'Inter Tight', sans-serif", bodyFamily: "'Inter', sans-serif", category: 'Modern' }
];

const DEFAULT_SERVICES: Service[] = [
  { id: 'web', name: 'Web Dev', iconType: 'wordpress' },
  { id: 'social', name: 'Social Media', iconType: 'social' },
  { id: 'seo', name: 'SEO', iconType: 'search' }
];

const StudioView: React.FC<StudioViewProps> = ({ client, initialPrompt = '', activeStrategy }) => {
    const [appState, setAppState] = React.useState<AppState>(AppState.IDLE);
    const [mainPrompt, setMainPrompt] = React.useState(initialPrompt);
    const [selectedStyle, setSelectedStyle] = React.useState<PosterStyle | null>(DEFAULT_STYLES[0]);
    const [generatedImageUrl, setGeneratedImageUrl] = React.useState<string | null>(null);
    const [history, setHistory] = React.useState<HistoryItem[]>([]);
    const [isAnimatingCanvas, setIsAnimatingCanvas] = React.useState(false);
    const [showDemoPosters, setShowDemoPosters] = React.useState(false); // DemoService.isDemoModeActive()

    // Load demo posters if in demo mode
    React.useEffect(() => {
        if (showDemoPosters) {
            const demoPosters = [
                '/demo_posters_mark_a_studio/Generated Image January 20, 2026 - 9_36AM.png',
                '/demo_posters_mark_a_studio/poster_2.png',
                '/demo_posters_mark_a_studio/poster_one.png',
                '/demo_posters_mark_a_studio/poster_three.png'
            ];
            const demoHistory: HistoryItem[] = demoPosters.map((url: string, index: number) => ({
                id: `demo-${index}`,
                imageUrl: url,
                prompt: `Demo poster ${index + 1} for Mark A Studio`,
                timestamp: Date.now() - (index * 1000) // Stagger timestamps
            }));
            setHistory(demoHistory);
        }
    }, [showDemoPosters]);

    const [brandContext, setBrandContext] = React.useState<BrandContext>({
        websiteUrl: client.website,
        contextFiles: [],
        insights: [],
        fontPair: FONT_PAIRS[0],
    });

    const [posterData, setPosterData] = React.useState<PosterData>({
        headline: 'Innovative Design',
        subheadline: 'Crafted for high impact.',
        services: DEFAULT_SERVICES,
        ctaText: 'Learn More',
        brandName: client.name,
        websiteUrl: client.website,
        aspectRatio: AspectRatio.SQUARE,
        fontPair: FONT_PAIRS[0],
        fontSize: 100,
        logoPlacement: LogoPlacement.BOTTOM_RIGHT,
        logoSize: LogoSize.MEDIUM,
    });

    const handleGeneratePoster = async () => {
      setAppState(AppState.GENERATING);
      try {
        setIsAnimatingCanvas(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsAnimatingCanvas(false);

        const enhanced = await enhancePrompt(mainPrompt, brandContext, activeStrategy);
        const imageUrl = await generatePosterImage(enhanced, posterData.logoPlacement, posterData.logoSize, posterData.fontSize, brandContext, posterData.aspectRatio, selectedStyle || DEFAULT_STYLES[0]);
        setGeneratedImageUrl(imageUrl);
        setHistory(prev => [...prev, { id: `h-${Date.now()}`, imageUrl, prompt: enhanced, timestamp: Date.now() }]);
      } catch (e: any) {
        console.error(e);
      } finally {
        setAppState(AppState.IDLE);
      }
    };

    // Context-aware initialization
    React.useEffect(() => {
        if (initialPrompt && initialPrompt !== mainPrompt) {
            setMainPrompt(initialPrompt);
        }
    }, [initialPrompt]);

    return (
        <div className="p-12 space-y-8 animate-fade-in-up h-full flex flex-col">
            {/* Enhanced Header with Breadcrumb Navigation */}
            <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-caption text-muted">
                    <button onClick={() => {}} className="text-primary-400 hover:text-primary-300 transition-colors">Client</button>
                    <span className="text-neutral-600">→</span>
                    <button onClick={() => {}} className="text-primary-400 hover:text-primary-300 transition-colors">Campaigns</button>
                    <span className="text-neutral-600">→</span>
                    <button onClick={() => {}} className="text-primary-400 hover:text-primary-300 transition-colors">Content Schedule</button>
                    <span className="text-neutral-600">→</span>
                    <span className="text-primary-400 font-semibold">Creative Studio</span>
                </nav>

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="font-black italic">Creative <span className="text-primary-400">Studio</span></h1>
                        <p className="text-caption text-muted font-semibold mt-2">Design & generate marketing assets for {client.name}</p>
                    </div>

                    {/* Context Indicators */}
                    <div className="flex items-center gap-3">
                        {activeStrategy && (
                            <div className="badge badge-success gap-1">
                                <Target className="w-3 h-3" />
                                Strategy Connected
                            </div>
                        )}
                        {initialPrompt && (
                            <div className="badge badge-primary gap-1">
                                <Text className="w-3 h-3" />
                                Brief Loaded
                            </div>
                        )}
                    </div>
                </div>

                {/* Workflow Progress */}
                <div className="flex items-center gap-4 p-4 card">
                    <div className="flex items-center gap-2 text-caption text-muted">
                        <div className="w-2 h-2 rounded-full bg-success-500"></div>
                        <span>Strategy</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-muted">
                        <div className="w-2 h-2 rounded-full bg-success-500"></div>
                        <span>Campaign</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-muted">
                        <div className="w-2 h-2 rounded-full bg-success-500"></div>
                        <span>Schedule</span>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-primary font-semibold">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                        <span>Studio</span>
                    </div>
                    <div className="flex-1 h-px bg-neutral-700"></div>
                    <div className="flex items-center gap-2 text-caption text-muted">
                        <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                        <span>Publish</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-8 relative">
                <div className="col-span-4 bg-[#08080c] border border-white/5 rounded-[2.5rem] p-8 overflow-y-auto custom-scrollbar space-y-8 shadow-2xl">
                    <section className="space-y-4">
                        <header className="flex items-center justify-between pb-3 border-b border-white/5">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Poster Content</h3>
                        </header>
                        <div className="space-y-3">
                            <textarea value={mainPrompt} onChange={e => setMainPrompt(e.target.value)} placeholder="Describe visual concept..." rows={3} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white text-xs font-bold focus:border-pink-500 outline-none transition-all"/>
                            <input value={posterData.headline} onChange={e => setPosterData(prev => ({...prev, headline: e.target.value}))} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white text-xs font-bold" placeholder="Headline"/>
                        </div>
                    </section>
                    <StyleSelector selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
                    <button onClick={handleGeneratePoster} disabled={appState === AppState.GENERATING || !mainPrompt.trim()} className="w-full flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-500 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50">
                        {appState === AppState.GENERATING ? <Cpu className="animate-spin w-4 h-4"/> : <Sparkles className="w-4 h-4"/>} Generate Masterwork
                    </button>
                    {activeStrategy && (
                      <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                         <p className="text-[9px] font-black uppercase text-indigo-400 mb-1">Strategically Grounded</p>
                         <p className="text-[9px] text-slate-500 font-bold leading-tight">Prompt enhancement is utilizing your Dossier's ICP and Market Analysis metadata.</p>
                      </div>
                    )}
                </div>
                <div className="col-span-8 flex flex-col gap-8">
                    <div className="flex-1 relative">
                        <div className={`absolute inset-0 transition-opacity duration-500 ${generatedImageUrl ? 'opacity-0' : 'opacity-100'}`}>
                            <PosterCanvas data={posterData} isPlaying={isAnimatingCanvas} />
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-500 ${generatedImageUrl ? 'opacity-100' : 'opacity-0'}`}>
                            <PosterPreview imageUrl={generatedImageUrl} isGenerating={appState === AppState.GENERATING && !isAnimatingCanvas} />
                        </div>
                    </div>
                </div>
            </div>
            <GalleryStrip history={history} onSelect={item => setGeneratedImageUrl(item.imageUrl)} />
        </div>
    );
};

export default StudioView;
