
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Box, UserX } from 'lucide-react';

interface ClientViewPlaceholderProps {
    viewName: string;
}

const ClientViewPlaceholder: React.FC<ClientViewPlaceholderProps> = ({ viewName }) => {
    const isSelectClient = viewName === "Select a Client";

    return (
        <div className="flex flex-col items-center justify-center h-full p-12 animate-fade-in-up">
            <div className="w-full h-full border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-700 space-y-4 text-center bg-[#08080c]/50">
                {isSelectClient ? (
                    <>
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                             <UserX className="w-10 h-10 opacity-40" />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 capitalize">No Client Selected</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest max-w-xs text-slate-500">
                            Please select an active client from the sidebar or create a new one to access this workspace.
                        </p>
                    </>
                ) : (
                    <>
                        <Box className="w-16 h-16 opacity-20" />
                        <h3 className="text-xl font-black text-slate-500 capitalize">{viewName} View</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest max-w-xs">
                            This feature is currently under construction. Check back soon for updates!
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientViewPlaceholder;
