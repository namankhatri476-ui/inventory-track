import React, { useState } from 'react';
import { printerService } from '../services/api';

export default function Serials({ models, serials, onRefresh }) {
    const [newSerial, setNewSerial] = useState({ modelId: '', value: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newSerial.value || !newSerial.modelId) return;
        try {
            await printerService.addSerial(newSerial);
            onRefresh();
            setNewSerial({ ...newSerial, value: '' }); // Keep model selected
        } catch (error) {
            alert('Error adding serial. It might already exist.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-4 text-lg">Register Serial Number</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <select
                        className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={newSerial.modelId}
                        onChange={e => setNewSerial({ ...newSerial, modelId: e.target.value })}
                        required
                    >
                        <option value="">Select Model...</option>
                        {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <input
                        className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Scan/Enter Serial Number"
                        value={newSerial.value}
                        onChange={e => setNewSerial({ ...newSerial, value: e.target.value })}
                        required
                    />
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        Save Serial
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-semibold">Serial Number</th>
                            <th className="p-4 font-semibold">Model</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {serials.slice().reverse().map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono text-indigo-600 font-medium">{s.value}</td>
                                <td className="p-4">{models.find(m => m.id === s.modelId)?.name || 'Unknown Model'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${s.status === 'Available'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                        {s.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}