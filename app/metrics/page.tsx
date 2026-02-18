'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getMetrics, getAttendanceRange } from '../services/api';
import Cookies from 'js-cookie';
import { Calendar, TrendingUp, BarChart3, Search, UserCheck, UserX, Loader2, ArrowRight } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function MetricsPage() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ present: 0, absent: 0, count: 0 });

    const [dateRange, setDateRange] = useState<{min:string,max:string}>({min:'',max:''});

    const familyId = Cookies.get('familyId');

    const handleFetchMetrics = async () => {
        if (!startDate || !endDate || !familyId) return;

        setLoading(true);
        try {
            const res = await getMetrics({ familyId, startDate, endDate });
            if (res.data.success) {
                const chartData = res.data.body.map((item: any) => ({
                    date: new Date(item._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    present: item.totalPresent,
                    absent: item.totalAbsent,
                    fullDate: new Date(item._id).toDateString()
                }));
                setData(chartData);

                // Calculate summary
                let totalP = 0, totalA = 0;
                chartData.forEach((d: any) => {
                    totalP += d.present;
                    totalA += d.absent;
                });
                setSummary({ present: totalP, absent: totalA, count: chartData.length });
            }
        } catch (error) {
            console.error("Failed to fetch metrics", error);
        } finally {
            setLoading(false);
        }
    };

    // when the date inputs change we fetch metrics
    useEffect(() => {
        if (startDate && endDate) {
            handleFetchMetrics();
        }
    }, [startDate, endDate]);

    // on mount grab available range and set defaults to today
    useEffect(() => {
        if (!familyId) return;
        getAttendanceRange(familyId).then(res => {
            if (res.data.success) {
                const min = res.data.body.minDate ? new Date(res.data.body.minDate).toISOString().split('T')[0] : todayStr;
                const max = res.data.body.maxDate ? new Date(res.data.body.maxDate).toISOString().split('T')[0] : todayStr;
                setDateRange({ min, max });

                // pick today's date within the returned bounds
                const defaultDate = todayStr < min ? min : todayStr > max ? max : todayStr;
                setStartDate(defaultDate);
                setEndDate(defaultDate);
            }
        }).catch(() => {
            // ignore errors
        });
    }, [familyId]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">
                            Analytics <span className="text-blue-600">Core</span>
                        </h1>
                        <p className="text-slate-400 font-bold italic text-sm tracking-widest uppercase opacity-70">Engagement & activity metrics</p>
                    </div>

                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-3 w-full md:w-auto">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 italic">Date Window</label>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={dateRange.min || undefined}
                                        max={endDate || dateRange.max || undefined}
                                        className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <ArrowRight size={14} className="text-slate-300" />
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || dateRange.min || undefined}
                                        max={dateRange.max || undefined}
                                        className="pl-4 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!startDate || !endDate ? (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-20 text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Search className="text-blue-500/40" size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase mb-3 text-2xl font-bold">Initialize Analysis</h2>
                        <p className="text-slate-400 max-w-sm mx-auto font-bold italic text-xs tracking-widest uppercase opacity-60">Please choose a date range to generate sector metrics.</p>
                    </div>
                ) : loading ? (
                    <div className="space-y-8 animate-pulse p-20 text-center">
                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
                        <p className="text-slate-400 font-bold italic text-xs tracking-widest uppercase italic">Synthesizing data points...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-20 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <BarChart3 className="text-slate-200" size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase mb-3">No activity found</h2>
                        <p className="text-slate-400 max-w-sm mx-auto font-bold italic text-xs tracking-widest uppercase opacity-60">The selected window has no localized participation records.</p>
                    </div>
                ) : (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex items-center gap-5 group hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">
                                    <UserCheck size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Total Present</p>
                                    <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{summary.present}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex items-center gap-5 group hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-100 group-hover:scale-110 transition-transform">
                                    <UserX size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Total Absent</p>
                                    <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{summary.absent}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex items-center gap-5 group hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Session Avg</p>
                                    <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{(summary.present / summary.count).toFixed(1)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[200px] -mr-32 -mt-32 opacity-40"></div>

                            <div className="relative z-10 flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-10 bg-slate-900 rounded-full"></div>
                                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Temporal Graph</h3>
                                </div>
                                <div className="flex items-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                                    <div className="flex items-center gap-2 flex items-center"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Present Units</div>
                                </div>
                            </div>

                            <div className="h-[400px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPresentWe" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, style: { textTransform: 'uppercase' } }}
                                            dy={15}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '24px',
                                                border: 'none',
                                                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                                padding: '20px',
                                                background: '#1e293b',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', color: '#60a5fa' }}
                                            labelStyle={{ fontWeight: 900, color: '#fff', marginBottom: '8px', fontSize: '12px', fontStyle: 'italic' }}
                                            cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="present"
                                            stroke="#3b82f6"
                                            strokeWidth={5}
                                            fillOpacity={1}
                                            fill="url(#colorPresentWe)"
                                            dot={{ r: 7, fill: '#3b82f6', strokeWidth: 4, stroke: '#fff' }}
                                            activeDot={{ r: 9, strokeWidth: 0, fill: '#3b82f6' }}
                                            name="Present"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
