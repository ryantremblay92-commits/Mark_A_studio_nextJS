/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Invoice } from '../../types';
import { Download, Plus, Receipt } from 'lucide-react';

const STATUS_COLORS: Record<Invoice['status'], string> = {
    'Paid': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Due': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Overdue': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const InvoicesView: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const handleCreateInvoice = () => {
        const amount = prompt("Enter invoice amount ($):");
        if (!amount || isNaN(Number(amount))) return;

        const newInvoice: Invoice = {
            id: `INV-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString().slice(0, 10),
            amount: Number(amount),
            status: 'Due'
        };
        setInvoices(prev => [newInvoice, ...prev]);
    };

    return (
        <div className="p-12 space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">Invoices & <span className="text-indigo-500">Payments</span></h1>
                <button onClick={handleCreateInvoice} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white">
                    <Plus className="w-3 h-3" /> Create New Invoice
                </button>
            </div>
            
            <div className="bg-[#08080c] border border-white/5 rounded-[2.5rem] overflow-hidden min-h-[400px]">
                {invoices.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice, index) => (
                                <tr key={invoice.id} className={`border-b border-white/5 ${index === invoices.length - 1 ? 'border-none' : ''}`}>
                                    <td className="px-6 py-5 font-bold text-white whitespace-nowrap">{invoice.id}</td>
                                    <td className="px-6 py-5 text-slate-400">{invoice.date}</td>
                                    <td className="px-6 py-5 text-slate-300 font-semibold">${invoice.amount.toLocaleString()}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded border ${STATUS_COLORS[invoice.status]}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-slate-500 hover:text-indigo-400">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-600">
                        <Receipt className="w-16 h-16 opacity-10 mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">No invoices generated yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoicesView;