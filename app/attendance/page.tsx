'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getUsers, getAttendanceByDate, submitAttendance, getAttendanceRange } from '../services/api';
import Cookies from 'js-cookie';
import { Check, X, Calendar as CalendarIcon, Loader2, Save, History, ClipboardCheck, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function AttendancePage() {
    const [users, setUsers] = useState<any[]>([]);
    const [attendanceState, setAttendanceState] = useState<{ [key: string]: boolean }>({});
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState<'none' | 'mark' | 'view'>('none');
    const [pastAttendance, setPastAttendance] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState<{ min: string, max: string }>({ min: '', max: '' });

    const familyId = Cookies.get('familyId');
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    useEffect(() => {
        if (familyId) {
            getUsers(familyId).then(res => {
                if (res.data.success) {
                    setUsers(res.data.body);
                }
            });

            // Fetch date range for calendar restriction
            getAttendanceRange(familyId).then(res => {
                if (res.data.success) {
                    const min = res.data.body.minDate ? new Date(res.data.body.minDate).toISOString().split('T')[0] : '';
                    const max = res.data.body.maxDate ? new Date(res.data.body.maxDate).toISOString().split('T')[0] : todayStr;
                    setDateRange({ min, max: todayStr > max ? todayStr : max });
                }
            });
        }
    }, [familyId]);

    const handleDateChange = async (dateStr: string) => {
        setSelectedDate(dateStr);
        setError('');
        setSubmitted(false);
        setPastAttendance([]);
        setAttendanceState({});

        if (!dateStr) {
            setViewMode('none');
            return;
        }

        if (!familyId) return;

        setLoading(true);
        // Fetch existing attendance for this date
        try {
            const res = await getAttendanceByDate(familyId, dateStr);
            if (res.data.success && res.data.body.length > 0) {
                setPastAttendance(res.data.body);
                setViewMode('view');
            } else if (dateStr === todayStr) {
                setViewMode('mark');
            } else {
                setPastAttendance([]);
                setViewMode('view');
            }
        } catch {
            if (dateStr === todayStr) {
                setViewMode('mark');
            } else {
                setViewMode('view');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleAttendance = (userId: string, status: boolean) => {
        setAttendanceState(prev => ({ ...prev, [userId]: status }));
    };

    const handleSubmit = async () => {
        if (users.length === 0) return;

        const payload = users.map(u => ({
            user_id: u._id,
            family_id: familyId,
            date: selectedDate,
            isPresent: attendanceState[u._id] || false
        }));

        setSubmitting(true);
        try {
            const res = await submitAttendance(payload, new Date(selectedDate));
            if (res.data.success) {
                setSubmitted(true);
                // Switch to view mode after success
                const fetchRes = await getAttendanceByDate(familyId!, selectedDate);
                if (fetchRes.data.success) {
                    setPastAttendance(fetchRes.data.body);
                    setViewMode('view');
                }
            } else {
                setError(res.data.error || 'Transmission failed.');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to sync with central node.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">
                            Registry <span className="text-blue-600">Core</span>
                        </h1>
                        <p className="text-slate-400 font-bold italic text-sm tracking-widest uppercase opacity-70">Sector attendance management</p>
                    </div>

                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-1 w-full md:w-64">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Target Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="date"
                                value={selectedDate}
                                min={dateRange.min}
                                max={dateRange.max}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {viewMode === 'none' && (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <CalendarIcon className="text-slate-200" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic mb-2">Initialize Sector</h3>
                        <p className="text-slate-400 font-bold italic text-xs tracking-widest uppercase opacity-60">Please select a date to start the registry.</p>
                    </div>
                )}

                {loading && (
                    <div className="p-20 text-center animate-pulse">
                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
                        <p className="text-slate-400 font-bold italic text-xs tracking-widest uppercase italic">Gathering sector data...</p>
                    </div>
                )}

                {!loading && viewMode === 'mark' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-head-shake">
                                <AlertCircle size={20} />
                                <p className="text-[10px] font-black uppercase tracking-widest italic">{error}</p>
                            </div>
                        )}

                        <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                                <ClipboardCheck size={20} className="text-blue-500" />
                                <h2 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Operation: Mark Attendance</h2>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {users.map(user => (
                                    <div key={user._id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                        <div>
                                            <h3 className="font-black text-slate-800 text-xl italic mb-1 group-hover:text-blue-600 transition-colors">{user.name}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Entity Level: {user.level?.replace('_', '.') || 'N/A'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleAttendance(user._id, true)}
                                                className={`p-4 rounded-2xl transition-all shadow-sm ${attendanceState[user._id] ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-50 text-slate-300 hover:text-slate-400'}`}
                                            >
                                                <Check size={24} />
                                            </button>
                                            <button
                                                onClick={() => toggleAttendance(user._id, false)}
                                                className={`p-4 rounded-2xl transition-all shadow-sm ${attendanceState[user._id] === false ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-slate-50 text-slate-300 hover:text-slate-400'}`}
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-slate-900 flex items-center justify-between gap-4">
                                <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed max-w-[200px] uppercase tracking-widest">
                                    CAUTION: Verification prevents changes after submission.
                                </p>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm italic"
                                >
                                    {submitting ? 'Syncing...' : (
                                        <>
                                            <Save size={20} />
                                            Commit Record
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && viewMode === 'view' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 bg-slate-900 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <History size={20} className="text-white opacity-40" />
                                    <h2 className="text-lg font-black text-white uppercase italic tracking-tight">Archive Registry: {new Date(selectedDate).toDateString()}</h2>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase italic tracking-[0.2em]">
                                    Read-Only
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {pastAttendance.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <p className="text-slate-400 font-bold italic text-sm tracking-widest uppercase italic bg-slate-50 inline-block px-6 py-3 rounded-2xl">
                                            No records located for this timestamp.
                                        </p>
                                    </div>
                                ) : (
                                    pastAttendance.map((att, idx) => (
                                        <div key={idx} className="p-8 flex items-center justify-between group">
                                            <div>
                                                <h3 className="font-black text-slate-800 text-xl italic mb-1">{att.user_id?.name}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{att.isPresent ? 'Status: Active Participation' : 'Status: Non-Attendace'}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-black text-[11px] uppercase tracking-widest italic ${att.isPresent
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-red-50 text-red-500 border-red-100'
                                                }`}>
                                                {att.isPresent ? (
                                                    <>
                                                        <span>Present</span>
                                                        <CheckCircle2 size={16} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Absent</span>
                                                        <XCircle size={16} className="text-red-400" />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
