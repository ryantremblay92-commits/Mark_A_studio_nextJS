/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { PosterData, AspectRatio, LogoPlacement, LogoSize, Service } from '../types';
import { Globe, Share2, Palette, Sparkles, Search, Zap, Brush } from 'lucide-react';

interface PosterCanvasProps {
  data: PosterData;
  isPlaying: boolean;
  brandLogo?: string; // Base64 image string for the logo
}

const ServiceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'wordpress': return <Globe className="w-5 h-5" />;
    case 'social': return <Share2 className="w-5 h-5" />;
    case 'search': return <Search className="w-5 h-5" />;
    case 'zap': return <Zap className="w-5 h-5" />;
    case 'palette': return <Brush className="w-5 h-5" />;
    default: return <Palette className="w-5 h-5" />;
  }
};

const PosterCanvas: React.FC<PosterCanvasProps> = ({ data, isPlaying, brandLogo }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setStage(0);
      const timers = [
        setTimeout(() => setStage(1), 200),
        setTimeout(() => setStage(2), 600),
        setTimeout(() => setStage(3), 1000),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isPlaying, data]);

  const isPortrait = data.aspectRatio === AspectRatio.STORY;
  const isBanner = data.aspectRatio === AspectRatio.BANNER;

  // Base font sizes for different aspect ratios
  const baseHeadlineSize = isPortrait ? 3.5 : isBanner ? 3.5 : 4.5; // rem
  const baseSubheadSize = isPortrait ? 1 : isBanner ? 1.25 : 1.25; // rem

  // Calculate scaled size
  const scale = data.fontSize / 100;
  const headlineSize = `${baseHeadlineSize * scale}rem`;
  const subheadSize = `${baseSubheadSize * scale}rem`;

  // Calculate logo styles
  const logoSizeClasses: Record<LogoSize, string> = {
    [LogoSize.SMALL]: 'w-10 h-10',
    [LogoSize.MEDIUM]: 'w-14 h-14',
    [LogoSize.LARGE]: 'w-20 h-20',
  };

  const logoPlacementClasses: Record<LogoPlacement, string> = {
    [LogoPlacement.TOP_LEFT]: 'top-8 left-8',
    [LogoPlacement.TOP_RIGHT]: 'top-8 right-8',
    [LogoPlacement.BOTTOM_LEFT]: 'bottom-8 left-8',
    [LogoPlacement.BOTTOM_RIGHT]: 'bottom-8 right-8',
    [LogoPlacement.CENTER]: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div 
      className={`relative bg-black w-full h-full overflow-hidden rounded-[2.5rem] border border-white/10 flex flex-col group transition-all duration-500`}
    >
      {/* Cinematic Base */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      {/* Brand ID Bar (or Logo) */}
      {brandLogo ? (
        <div 
          className={`absolute z-30 flex items-center justify-center transition-all duration-1000 ${logoPlacementClasses[data.logoPlacement]} ${logoSizeClasses[data.logoSize]} ${stage >= 1 ? 'opacity-100' : 'opacity-0 scale-75'}`}
        >
          <img src={brandLogo} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
        </div>
      ) : (
        <div 
            className={`absolute top-8 left-8 z-30 flex items-center gap-3 transition-all duration-1000 ${stage >= 1 ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}
            style={{ fontFamily: data.fontPair?.bodyFamily || 'inherit' }}
        >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-white/90 tracking-tighter leading-none">{data.brandName}</span>
                <span className="text-[7px] font-bold uppercase text-white/40 tracking-[0.2em]">{data.websiteUrl}</span>
            </div>
        </div>
      )}


      <div className={`relative z-10 h-full flex flex-col p-12 ${isBanner ? 'text-left justify-center max-w-[65%]' : 'text-center justify-end'}`}>
        <div className={`transition-all duration-1000 delay-200 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <h1 
              className="font-black text-white leading-[0.9] tracking-tighter uppercase mb-6 drop-shadow-2xl transition-all duration-300"
              style={{ 
                fontSize: headlineSize,
                fontFamily: data.fontPair?.headlineFamily || 'inherit'
              }}
           >
              {data.headline}
           </h1>
           <p 
              className={`text-slate-400 font-bold tracking-tight mb-10 border-l-2 border-blue-600 pl-4 max-w-lg transition-all duration-300 ${isPortrait ? 'mx-auto' : ''}`}
              style={{ 
                fontSize: subheadSize,
                fontFamily: data.fontPair?.bodyFamily || 'inherit'
              }}
           >
              {data.subheadline}
           </p>
        </div>

        <div className={`flex gap-6 mb-12 transition-all duration-1000 delay-500 ${stage >= 2 ? 'opacity-100' : 'opacity-0'} ${isPortrait ? 'justify-center' : ''}`}>
           {data.services.map((s: Service, i: number) => (
             <div key={i} className="flex flex-col items-center gap-2 group/icon">
                <div className="w-12 h-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white/80 group-hover/icon:bg-blue-600/20 group-hover/icon:border-blue-500/50 transition-all shadow-xl">
                   <ServiceIcon type={s.iconType} />
                </div>
                <span 
                  className="text-[8px] font-black uppercase text-white/30 group-hover/icon:text-blue-400 transition-colors tracking-widest"
                  style={{ fontFamily: data.fontPair?.bodyFamily || 'inherit' }}
                >
                  {s.name}
                </span>
             </div>
           ))}
        </div>

        <div className={`transition-all duration-1000 delay-700 ${stage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
           <button 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black py-5 px-12 rounded-[1.5rem] shadow-[0_20px_40px_rgba(37,99,235,0.3)] text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all"
              style={{ fontFamily: data.fontPair?.bodyFamily || 'inherit' }}
            >
              {data.ctaText}
           </button>
        </div>
      </div>
      
      {/* Decorative Overlay */}
      <div className="absolute inset-0 border-[20px] border-white/[0.02] pointer-events-none rounded-[2.5rem]"></div>
    </div>
  );
};

export default PosterCanvas;