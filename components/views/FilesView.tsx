/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ManagedFile } from '../../types';
import { FileText, Image, Video, Upload, MoreVertical, Folder } from 'lucide-react';

const FILE_ICONS: Record<ManagedFile['type'], React.ElementType> = {
    'Document': FileText,
    'Image': Image,
    'Video': Video,
    'Other': FileText,
};

interface FilesViewProps {
  onAddFile: (file: ManagedFile) => void;
  files: ManagedFile[];
}

const FilesView: React.FC<FilesViewProps> = ({ onAddFile, files }) => {
    const handleUploadClick = () => {
        const name = prompt("Enter file name:");
        if (!name) return;
        
        const type: ManagedFile['type'] = name.toLowerCase().endsWith('.png') || name.toLowerCase().endsWith('.jpg') ? 'Image' : 
                                       name.toLowerCase().endsWith('.mp4') ? 'Video' : 'Document';

        const newFile: ManagedFile = {
            id: `file-${Date.now()}`,
            name,
            type,
            size: '1.2 MB',
            url: '#'
        };
        onAddFile(newFile);
    };

    return (
        <div className="p-12 space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">Files & <span className="text-indigo-500">Assets</span></h1>
                <button onClick={handleUploadClick} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white">
                    <Upload className="w-3 h-3" /> Upload File
                </button>
            </div>

            <div className="grid grid-cols-4 gap-8">
                {files.length > 0 ? (
                    files.map(file => {
                        const Icon = FILE_ICONS[file.type] || FileText;
                        return (
                            <div key={file.id} className="bg-[#08080c] border border-white/5 p-6 rounded-[2rem] group hover:bg-white/[0.03] transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 flex items-center justify-center bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <button className="text-slate-600 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                                <h4 className="text-sm font-bold text-slate-200 truncate">{file.name}</h4>
                                <p className="text-xs text-slate-500">{file.size}</p>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-4 flex flex-col items-center justify-center py-32 text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <Folder className="w-16 h-16 opacity-10 mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Repository empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilesView;