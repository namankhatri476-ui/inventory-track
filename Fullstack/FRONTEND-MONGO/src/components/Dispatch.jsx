import React, { useState } from 'react';
import { format } from 'date-fns';
import { printerService } from '../services/api';

export default function Dispatch({ models, serials, dispatches, currentUser, onRefresh }) {
    const [newDispatch, setNewDispatch] = useState({ serialId: '', customer: '', address: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newDispatch.customer || !newDispatch.serialId) return;

        const payload = {
            serialNumberId: newDispatch.serialId,
            customerName: newDispatch.customer,
            shippingAddress: newDispatch.address,
            user: currentUser.username
        };

        await printerService.addDispatch(payload);
        onRefresh();
        setNewDispatch({ serialId: '', customer: '', address: '' });
    };

    // Only show Available serials in dropdown
    const availableSerials = serials.filter(s => s.status === 'Available');

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-4 text-lg">Dispatch Printer</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white col-span-2 md:col-span-1"
                        value={newDispatch.serialId}
                        onChange={e => setNewDispatch({ ...newDispatch, serialId: e.target.value })}
                        required
                    >
                        <option value="">Select Available Serial...</option>
                        {availableSerials.map(s => {
                            const m = models.find(x => x.id === s.modelId);
                            return <option key={s.id} value={s.id}>{s.value} - {m?.name}</option>
                        })}
                    </select>
                    <input
                        className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none col-span-2 md:col-span-1"
                        placeholder="Customer Name"
                        value={newDispatch.customer}
                        onChange={e => setNewDispatch({ ...newDispatch, customer: e.target.value })}
                        required
                    />
                    <input
                        className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none col-span-2"
                        placeholder="Shipping Address"
                        value={newDispatch.address}
                        onChange={e => setNewDispatch({ ...newDispatch, address: e.target.value })}
                        required
                    />
                    <button className="bg-indigo-600 text-white p-2 rounded-lg col-span-2 hover:bg-indigo-700 font-medium">
                        Confirm Dispatch
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-semibold">Customer Details</th>
                            <th className="p-4 font-semibold">Serial Number</th>
                            <th className="p-4 font-semibold">Dispatch Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {dispatches.slice().reverse().map(d => {
                            const s = serials.find(x => x.id === d.serialNumberId);
                            return (
                                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{d.customerName}</div>
                                        <div className="text-xs text-slate-500">{d.shippingAddress}</div>
                                    </td>
                                    <td className="p-4 font-mono text-indigo-600 font-medium">{s?.value || 'N/A'}</td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {d.dispatchDate ? format(new Date(d.dispatchDate), 'MMM dd, yyyy HH:mm') : '-'}
                                        <div className="text-xs text-slate-400">By: {d.dispatchedBy}</div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}