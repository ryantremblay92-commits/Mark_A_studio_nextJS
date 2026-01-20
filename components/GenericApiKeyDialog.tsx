/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyRound } from 'lucide-react'; // Changed KeyIcon to KeyRound from lucide-react

interface GenericApiKeyDialogProps {
  onContinue: () => void;
}

const GenericApiKeyDialog: React.FC<GenericApiKeyDialogProps> = ({ onContinue }) => {

  const handleOpenSelectKey = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      onContinue(); // Call onContinue after attempting to open the key selection
    } else {
      console.error("window.aistudio is not available.");
      onContinue(); // Still call onContinue to dismiss the dialog, even if selection failed.
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#08080c] border border-white/5 rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 text-center flex flex-col items-center animate-fade-in-up">
        <div className="bg-indigo-600/20 p-4 rounded-full mb-6">
          <KeyRound className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-3">API Key <span className="text-indigo-500">Required</span></h2>
        <p className="text-slate-400 mb-6 text-sm">
          A valid API key from a paid Google Cloud project with billing enabled is required for this feature.
          This ensures access to advanced AI models and capabilities.
        </p>
        <p className="text-slate-500 mb-8 text-xs font-medium">
          For more information, visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            Gemini API billing documentation
          </a>.
        </p>
        <button
          onClick={handleOpenSelectKey}
          className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors text-white"
        >
          Select Paid API Key
        </button>
      </div>
    </div>
  );
};

export default GenericApiKeyDialog;
