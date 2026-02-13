import React from 'react';
import {
    Printer, Package, Truck, CheckCircle2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-start">
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    </div>
);

export default function Dashboard({ models, serials, dispatches }) {
    // Calculate stock for chart
    const chartData = models.map(m => ({
        name: m.name,
        stock: serials.filter(s => s.modelId === m.id && s.status === 'Available').length
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Models"
                    value={models.length}
                    icon={<Printer size={24} />}
                    color="bg-indigo-100 text-indigo-600"
                />
                <StatCard
                    title="Available Stock"
                    value={serials.filter(s => s.status === 'Available').length}
                    icon={<Package size={24} />}
                    color="bg-emerald-100 text-emerald-600"
                />
                <StatCard
                    title="Dispatched"
                    value={dispatches.length}
                    icon={<Truck size={24} />}
                    color="bg-amber-100 text-amber-600"
                />
                <StatCard
                    title="System Status"
                    value="Online"
                    icon={<CheckCircle2 size={24} />}
                    color="bg-blue-100 text-blue-600"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border h-96">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Current Stock Levels by Model</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                            {chartData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}