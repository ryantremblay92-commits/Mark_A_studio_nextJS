/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Maximize, Share2, Sparkles, Image as ImageIcon, Download, Box } from 'lucide-react';

interface PosterPreviewProps {
  imageUrl: string | null;
  isGenerating: boolean;
}

const PosterPreview: React.FC<PosterPreviewProps> = ({ imageUrl, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="w-full h-full bg-[#08080c] rounded-[3rem] border border-white/5 flex flex-col items-center justify-center gap-8 overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] animate-pulse"></div>
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-[6px] border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-6 border-[6px] border-white/5 border-b-purple-500 rounded-full animate-spin-reverse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Box className="w-8 h-8 text-white/20 animate-bounce" />
          </div>
        </div>
        <div className="text-center z-10 px-12">
          <p className="text-blue-400 font-black uppercase tracking-[0.5em] text-[11px] mb-3">Rendering Master Canvas</p>
          <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">Nano Banana is synthesizing your visual directive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group animate-scale-in flex items-center justify-center">
      <div className="absolute -inset-20 bg-blue-600/5 rounded-full blur-[150px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative h-full w-full bg-[#08080c] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,1)]">
        <img 
          src={imageUrl!} 
          alt="Result" 
          className="w-full h-full object-cover select-none transition-transform duration-[4s] group-hover:scale-105"
        />
        
        {/* Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
          <div className="flex items-center justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex gap-4">
              <a 
                href={imageUrl!} 
                download="mark-a-studio-poster.png"
                className="w-14 h-14 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-90"
              >
                <Download className="w-6 h-6 text-white" />
              </a>
              <button className="w-14 h-14 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-90">
                <Share2 className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 bg-blue-600 px-6 py-3 rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Nano Export Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-10 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-fade-in-up">
         <div className="flex items-center gap-3">
            <ImageIcon className="w-4 h-4 text-blue-500"/>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Mark A Master v2.0</span>
         </div>
         <div className="w-px h-4 bg-white/10"></div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Optimized for Ads</span>
         </div>
      </div>
    </div>
  );
};

export default PosterPreview;