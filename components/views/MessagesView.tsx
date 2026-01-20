/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Client, Message, ManagedFile } from '../../types';
import { Send, MessageSquare, ChevronDown, Paperclip, X, FileText, Image, Video } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.383 1.905 6.344l-1.332 4.869 4.895-1.309z" />
    </svg>
);

const FILE_ICONS: Record<ManagedFile['type'], React.ElementType> = {
    'Document': FileText,
    'Image': Image,
    'Video': Video,
    'Other': FileText,
};

interface MessagesViewProps {
    client: Client;
    messages: Message[];
    clientFiles: ManagedFile[];
    onSendMessage: (text: string, channel: 'Internal' | 'WhatsApp') => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ client, messages, clientFiles, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [channel, setChannel] = useState<'Internal' | 'WhatsApp'>('Internal');
    const [isAttachmentPickerOpen, setAttachmentPickerOpen] = useState(false);

    const handleSend = () => {
        if (newMessage.trim() === '') return;
        
        if (channel === 'WhatsApp') {
            const encodedMessage = encodeURIComponent(newMessage);
            const whatsappUrl = `https://wa.me/${client.phoneNumber?.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        } else {
            onSendMessage(newMessage, 'Internal');
        }
        setNewMessage('');
    };

    const handleAttachFile = (file: ManagedFile) => {
        onSendMessage(`📎 Attachment: ${file.name}\n(Access file in Assets View)`, 'Internal');
        setAttachmentPickerOpen(false);
    };

    return (
        <div className="p-12 animate-fade-in-up h-full flex flex-col">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-10">Client <span className="text-indigo-500">Messenger</span></h1>
            
            <div className="flex-1 bg-[#08080c] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden relative">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {client.logo ? <img src={`data:image/png;base64,${client.logo.base64}`} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{client.name.charAt(0)}</div>}
                        <h3 className="font-bold text-white">{client.name}</h3>
                    </div>
                </div>
                
                <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    {messages.length > 0 ? messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'client' && <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0"></div>}
                            <div className={`p-4 rounded-3xl max-w-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-black/40 text-slate-300 rounded-bl-lg'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>{msg.timestamp}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
                            <MessageSquare className="w-16 h-16 mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">No conversation history</p>
                        </div>
                    )}
                </div>

                {/* Attachment Picker Overlay */}
                {isAttachmentPickerOpen && (
                  <div className="absolute inset-x-0 bottom-[80px] bg-[#0a0a0f] border-t border-white/10 p-6 z-10 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Attach Client Asset</h4>
                      <button onClick={() => setAttachmentPickerOpen(false)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {clientFiles.length > 0 ? clientFiles.map(file => {
                        const Icon = FILE_ICONS[file.type] || FileText;
                        return (
                          <button 
                            key={file.id} 
                            onClick={() => handleAttachFile(file)}
                            className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-all group"
                          >
                            <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-300 truncate">{file.name}</p>
                              <p className="text-[9px] text-slate-600">{file.type}</p>
                            </div>
                          </button>
                        )
                      }) : (
                        <div className="col-span-3 py-6 text-center">
                          <p className="text-[10px] font-bold text-slate-600 uppercase">No assets found for this client</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl p-2">
                        <button 
                          onClick={() => setAttachmentPickerOpen(!isAttachmentPickerOpen)}
                          className={`p-3 rounded-lg transition-all ${isAttachmentPickerOpen ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <input 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent focus:outline-none text-sm px-2 text-white"
                        />
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10">
                                {channel === 'Internal' ? <MessageSquare className="w-4 h-4 text-slate-400" /> : <WhatsAppIcon />}
                                <span className="text-slate-300">{channel}</span>
                                <ChevronDown className="w-3 h-3 text-slate-500" />
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 w-40 bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl p-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                                <button onClick={() => setChannel('Internal')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-slate-300">
                                    <MessageSquare className="w-4 h-4 text-slate-400" /> Internal
                                </button>
                                <button onClick={() => setChannel('WhatsApp')} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-emerald-400">
                                    <WhatsAppIcon /> WhatsApp
                                </button>
                            </div>
                        </div>
                        <button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-lg transition-all">
                            <Send className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesView;