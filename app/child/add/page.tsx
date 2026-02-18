'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getCourses, addParent } from '../../services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { UserPlus, ChevronRight, Save, GraduationCap, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AddChild() {
    const [name, setName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [level, setLevel] = useState('4');
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const familyId = Cookies.get('familyId');

    useEffect(() => {
        getCourses().then(res => {
            if (res.data.success) setCourses(res.data.body);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await addParent({
                name,
                courseId,
                level,
                familyId,
                isParent: false // Adding a child
            });
            if (res.data.success) {
                router.push('/dashboard');
            } else {
                setError(res.data.error || 'Initialization failed.');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Sector communication failure.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-2xl mx-auto py-16 px-4">

                <div className="flex items-center gap-4 mb-12">
                    <button onClick={() => router.back()} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 border border-slate-200 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic mb-1">
                            New <span className="text-emerald-600">Child</span>
                        </h1>
                        <p className="text-slate-400 font-bold italic text-xs tracking-widest uppercase opacity-70">
                            Do well to communicate to the CU secretary before adding this child.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 mb-8 animate-head-shake">
                        <AlertCircle size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest italic">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-full -mr-24 -mt-24 opacity-60"></div>

                    <form onSubmit={handleSubmit} className="p-10 relative z-10 space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 italic">Child's Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-black focus:outline-none focus:border-emerald-500 transition-all placeholder:font-normal placeholder:opacity-30"
                                    placeholder="Enter Child's name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 italic">Child's Course</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <select
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-800 focus:outline-none focus:border-emerald-500 transition-all appearance-none"
                                            required
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 italic">Institutional Level</label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                                        required
                                    >
                                        {["4", "5", "6", "7_1", "7_2", "8"].map(l => <option key={l} value={l}>Level {l.replace('_', '.')}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50 flex items-center justify-between gap-6">
                            <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest italic leading-relaxed max-w-[200px]">
                                Do well to make sure that the Secretary is aware of the adding of this child.
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm italic"
                            >
                                {loading ? 'Initializing...' : (
                                    <>
                                        <Save size={20} />
                                        Commit Record
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
