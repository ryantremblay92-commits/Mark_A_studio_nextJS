/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { PosterStyle } from '../types';
import { Palette, Layers, Box, Zap, Feather } from 'lucide-react';

export const DEFAULT_STYLES: PosterStyle[] = [
  {
    id: 'minimalist',
    name: 'Clean Minimal',
    description: 'Lots of whitespace, bold typography, simple geometric shapes.',
    promptModifier: 'Minimalist design, high key lighting, ample whitespace, Swiss typography style, clean lines, corporate memphis',
    gradient: 'from-gray-100 to-gray-300'
  },
  {
    id: 'cyberpunk',
    name: 'Neon Future',
    description: 'Dark backgrounds, neon accents, futuristic vibes.',
    promptModifier: 'Cyberpunk aesthetic, neon lighting, dark background, glitch effect overlay, futuristic tech elements, glowing accents',
    gradient: 'from-purple-600 to-blue-600'
  },
  {
    id: 'luxury',
    name: 'High Luxury',
    description: 'Gold accents, serif fonts, marble textures, elegant.',
    promptModifier: 'High-end luxury advertisement, gold textures, marble background, cinematic lighting, elegant serif typography, premium feel',
    gradient: 'from-amber-700 to-yellow-500'
  },
  {
    id: 'brutalist',
    name: 'Neo Brutalism',
    description: 'Raw aesthetic, bold colors, high contrast, modular.',
    promptModifier: 'Neo-brutalism, bold high-contrast colors, raw geometric shapes, thick borders, courier font, retro internet aesthetic',
    gradient: 'from-emerald-600 to-teal-600'
  }
];

interface StyleSelectorProps {
  styles?: PosterStyle[];
  selectedStyle: PosterStyle | null;
  onSelect: (style: PosterStyle) => void;
  title?: string;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles = DEFAULT_STYLES, selectedStyle, onSelect, title = "Artistic Direction" }) => {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-500/10 border border-pink-500/20 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-pink-400" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{title}</h3>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className={`relative p-3 rounded-2xl border text-left transition-all overflow-hidden group ${
              selectedStyle?.id === style.id
                ? 'border-pink-500/50 bg-pink-500/10'
                : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/5'
            }`}
          >
            {/* Background Gradient Hint */}
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${style.gradient} opacity-10 blur-2xl rounded-full -translate-y-4 translate-x-4 transition-transform group-hover:scale-150`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-1">
                 <h4 className={`text-[9px] font-black uppercase tracking-wider ${selectedStyle?.id === style.id ? 'text-white' : 'text-slate-300'}`}>
                   {style.name}
                 </h4>
                 {selectedStyle?.id === style.id && <Zap className="w-3 h-3 text-pink-500 fill-pink-500" />}
              </div>
              <p className="text-[9px] text-slate-500 leading-tight">
                {style.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;