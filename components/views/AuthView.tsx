""
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Cpu, ArrowRight, Lock, Mail, Building2, LayoutGrid } from 'lucide-react';
import { User, Agency } from '../../types';
import { registerAgency, loginUser } from '../../services/storageService';

interface AuthViewProps {
  onLogin: (user: User, agency: Agency, useDemo?: boolean) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (mode === 'REGISTER') {
        if (!agencyName) throw new Error("Agency name is required");
        const { user, agency } = registerAgency(agencyName, email, password);
        onLogin(user, agency);
      } else {
        const result = loginUser(email);
        if (result) {
          onLogin(result.user, result.agency);
        } else {
          throw new Error("Invalid credentials or user not found.");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-pink-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-2 bg-[#08080c] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative z-10 animate-fade-in-up">
        {/* Left: Branding */}
        <div className="p-16 flex flex-col justify-between bg-white/[0.02] border-r border-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                   <Cpu className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-black uppercase tracking-widest text-white">Mark A Studio</h1>
             </div>
             <h2 className="font-black italic leading-tight mb-4">
               {mode === 'LOGIN' ? 'Welcome Back' : 'Scale Your Agency'}
             </h2>
             <p className="text-secondary leading-relaxed max-w-sm">
               The operating system for modern marketing agencies. Manage clients, generate assets, and execute campaigns with AI.
             </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
             <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <LayoutGrid className="w-6 h-6 text-indigo-400 mb-3" />
                <p className="text-xs font-bold text-slate-300">Multi-Tenant</p>
                <p className="text-[10px] text-slate-500">Isolated Workspaces</p>
             </div>
             <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <Cpu className="w-6 h-6 text-pink-400 mb-3" />
                <p className="text-xs font-bold text-slate-300">Gemini Powered</p>
                <p className="text-[10px] text-slate-500">Generative Strategy</p>
             </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-16 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto">
             
             {mode === 'REGISTER' && (
               <div className="space-y-2 animate-fade-in-up">
                  <label className="form-label">Agency Name</label>
                  <div className="relative">
                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                     <input
                       value={agencyName}
                       onChange={e => setAgencyName(e.target.value)}
                       className="form-input pl-12"
                       placeholder="Acme Marketing"
                     />
                  </div>
               </div>
             )}

             <div className="space-y-2">
                <label className="form-label">Work Email</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                   <input
                     type="email"
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     className="form-input pl-12"
                     placeholder="name@agency.com"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="form-label">Password</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                   <input
                     type="password"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="form-input pl-12"
                     placeholder="••••••••"
                   />
                </div>
             </div>

             {error && (
               <div className="p-4 bg-error-500/10 border border-error-500/20 rounded-xl text-error-400 font-semibold text-center animate-fade-in-up">
                 {error}
               </div>
             )}

             <button
               disabled={isLoading}
               className="btn btn-primary btn-lg w-full gap-2 group"
             >
               {isLoading ? 'Processing...' : (mode === 'LOGIN' ? 'Access Workspace' : 'Launch Agency')}
               {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
             </button>

             <div className="text-center pt-4 space-y-3">
               <button
                 type="button"
                 onClick={() => { setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setError(''); }}
                 className="btn btn-ghost btn-sm"
               >
                 {mode === 'LOGIN' ? "Don't have an account? Create Agency" : "Already registered? Login"}
               </button>

               {mode === 'LOGIN' && (
                 <div className="pt-2">
                   <button
                     type="button"
                     onClick={() => {
                       const demoUser: User = { id: 'demo-user', email: 'demo@markastudio.com', name: 'Demo User', agencyId: 'demo-agency', role: 'ADMIN' };
                       const demoAgency: Agency = { id: 'demo-agency', name: 'Mark A Studio Demo', plan: 'PRO', createdAt: Date.now() };
                       onLogin(demoUser, demoAgency, true);
                     }}
                     className="btn btn-ghost btn-sm gap-1 text-primary-400 hover:text-primary-300"
                   >
                     <Cpu className="w-3 h-3" />
                     Try Demo Mode
                   </button>
                 </div>
               )}
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
