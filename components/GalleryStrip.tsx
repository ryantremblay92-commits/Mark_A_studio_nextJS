/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Download, ArrowUpRight } from 'lucide-react';

interface GalleryStripProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const GalleryStrip: React.FC<GalleryStripProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full h-32 bg-slate-950/80 backdrop-blur-md border-t border-white/5 flex flex-col shrink-0">
      <div className="px-6 py-2 border-b border-white/5 flex items-center gap-2">
        <Clock className="w-3 h-3 text-slate-500" />
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Session Gallery</span>
      </div>
      <div className="flex-1 overflow-x-auto custom-scrollbar flex items-center gap-4 px-6 py-3">
        {history.slice().reverse().map((item) => (
          <div key={item.id} className="relative group shrink-0 aspect-square h-full rounded-xl overflow-hidden border border-white/10 cursor-pointer" onClick={() => onSelect(item)}>
            <img src={item.imageUrl} alt="History" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
               <button className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 text-white">
                  <ArrowUpRight className="w-3 h-3" />
               </button>
               <a href={item.imageUrl} download={`poster-${item.timestamp}.png`} className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 text-white" onClick={(e) => e.stopPropagation()}>
                  <Download className="w-3 h-3" />
               </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryStrip;