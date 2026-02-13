import React, { useState } from 'react';
import { printerService } from '../services/api';

export default function Models({ models, onRefresh, isAdmin }) {
    const [newModel, setNewModel] = useState({ name: '', category: 'Laser', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newModel.name) return;
        await printerService.addModel(newModel);
        onRefresh();
        setNewModel({ name: '', category: 'Laser', description: '' });
    };

    return (
        <div className="space-y-6">
            {isAdmin && (
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-bold mb-4 text-lg">Add New Model</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                        <input
                            className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Model Name (e.g. HP LaserJet 1020)"
                            value={newModel.name}
                            onChange={e => setNewModel({ ...newModel, name: e.target.value })}
                            required
                        />
                        <select
                            className="border p-2 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newModel.category}
                            onChange={e => setNewModel({ ...newModel, category: e.target.value })}
                        >
                            <option>Laser</option>
                            <option>Inkjet</option>
                            <option>Thermal</option>
                            <option>3D Printer</option>
                        </select>
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                            Add Model
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-semibold">Model Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold text-center">Total Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {models.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-800">{m.name}</td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border">
                                        {m.category}
                                    </span>
                                </td>
                                <td className="p-4 text-center font-bold text-indigo-600">
                                    {m.stockCount || 0}
                                </td>
                            </tr>
                        ))}
                        {models.length === 0 && (
                            <tr><td colSpan="3" className="p-8 text-center text-slate-400">No models found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}