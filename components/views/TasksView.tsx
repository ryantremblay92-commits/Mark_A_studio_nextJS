/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Task } from '../../types';
import { Plus, Check, Trash2, ClipboardList, Sparkles, CheckCircle2, Zap, Clock, ShieldCheck, Link as LinkIcon, Briefcase } from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (text: string) => void;
  onDeleteTask: (id: string) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, onUpdateTask, onAddTask, onDeleteTask }) => {
    const [newTask, setNewTask] = useState('');

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const approvalTasks = tasks.filter(t => t.type !== 'MANUAL');
    const generalTasks = tasks.filter(t => t.type === 'MANUAL');

    const handleAddTask = () => {
        if (newTask.trim() === '') return;
        onAddTask(newTask.trim());
        setNewTask('');
    };

    return (
        <div className="p-12 space-y-10 animate-fade-in-up h-full flex flex-col">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">Tasks & <span className="text-indigo-500">Approvals</span></h1>
                <p className="text-sm text-slate-500 font-bold uppercase mt-1">Operational Flow & Sales Cycle Automation</p>
              </div>
              <div className="bg-[#08080c] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-6 shadow-2xl">
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Completion</p>
                    <p className="text-xl font-black text-white">{progress.toFixed(0)}%</p>
                 </div>
                 <div className="w-px h-10 bg-white/5"></div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Sync</span>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-12 gap-10 overflow-hidden">
                {/* Pending Approvals */}
                <div className="col-span-5 flex flex-col space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> CRM Sales Cycle Approvals
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                      {approvalTasks.length > 0 ? approvalTasks.map(task => (
                        <div key={task.id} className={`bg-[#08080c] border border-white/5 p-6 rounded-[2.5rem] transition-all relative group overflow-hidden ${task.completed ? 'opacity-40 grayscale-[0.5]' : 'hover:border-indigo-500/30'}`}>
                          {!task.completed && (
                            <div className="absolute top-0 right-0 p-4">
                              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                            </div>
                          )}
                          <div className="flex items-start gap-5">
                            <button 
                              onClick={() => onUpdateTask({ ...task, completed: !task.completed })} 
                              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/10 hover:border-indigo-500 bg-white/5 hover:bg-white/10'}`}
                            >
                              {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6 text-slate-600" />}
                            </button>
                            <div className="flex-1">
                               <p className={`text-sm font-black italic uppercase tracking-tight mb-2 ${task.completed ? 'text-slate-500' : 'text-slate-100'}`}>{task.text}</p>
                               <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-[8px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20">Auto-Generated</span>
                                  {task.relatedEntityId && (
                                     <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                        <Briefcase className="w-3 h-3" /> Linked to Deal {task.relatedEntityId.split('-')[1]}
                                     </div>
                                  )}
                               </div>
                               {!task.completed && (
                                 <p className="text-[10px] text-slate-500 font-bold mt-3 border-t border-white/5 pt-3">
                                   * Approving this will automatically trigger follow-up communications.
                                 </p>
                               )}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="h-40 border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-700 opacity-40">
                          <Zap className="w-10 h-10 mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No pending system approvals</p>
                        </div>
                      )}
                    </div>
                </div>

                {/* General Tasks */}
                <div className="col-span-7 flex flex-col space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" /> Project Roadmap Checklist
                    </h3>
                    <div className="bg-[#08080c] border border-white/5 p-10 rounded-[3rem] flex-1 flex flex-col overflow-hidden shadow-2xl relative">
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-6 pr-2">
                            {generalTasks.length > 0 ? generalTasks.map(task => (
                                <div key={task.id} className="flex items-center gap-4 p-5 bg-black/40 rounded-3xl group border border-transparent hover:border-white/10 transition-all hover:bg-white/[0.02]">
                                    <button 
                                      onClick={() => onUpdateTask({ ...task, completed: !task.completed })} 
                                      className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-indigo-600 border-indigo-500' : 'border-slate-800 group-hover:border-indigo-600'}`}
                                    >
                                        {task.completed && <Check className="w-4 h-4 text-white" />}
                                    </button>
                                    <p className={`flex-1 text-sm font-bold ${task.completed ? 'text-slate-600 line-through' : 'text-slate-300'}`}>{task.text}</p>
                                    <button onClick={() => onDeleteTask(task.id)} className="text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center py-12 text-slate-700 opacity-20">
                                    <ClipboardList className="w-16 h-16 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Manual checklist is empty</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-8 border-t border-white/5 bg-[#08080c]">
                            <input 
                                value={newTask}
                                onChange={e => setNewTask(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleAddTask()}
                                placeholder="Delegate a new creative mission..."
                                className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                            />
                            <button onClick={handleAddTask} className="bg-indigo-600 hover:bg-indigo-500 px-10 rounded-2xl transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] group">
                                <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksView;
