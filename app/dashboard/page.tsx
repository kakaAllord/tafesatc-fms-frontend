'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import { getRandomVerse } from '../services/api';
import { ClipboardCheck, UserPlus, Quote, Loader2, ArrowUpRight, BookOpen } from 'lucide-react';

export default function Dashboard() {
    const [verse, setVerse] = useState<any>(null);
    const [loadingVerse, setLoadingVerse] = useState(true);

    useEffect(() => {
        setLoadingVerse(true);
        getRandomVerse().then(res => {
            if (res.data.success) {
                setVerse(res.data.body);
            }
        }).finally(() => {
            setLoadingVerse(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

                
                {/* Verse of the Day Card */}
                <div className="bg-slate-900 rounded-[40px] shadow-2xl shadow-slate-900/40 overflow-hidden relative border border-slate-800">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="p-10 md:p-14 relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                                <BookOpen className="text-blue-400" size={20} />
                            </div>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic">
                                Verse of the Day
                            </h2>
                        </div>

                        {loadingVerse ? (
                            <div className="flex flex-col gap-4 animate-pulse">
                                <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                                <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
                                <div className="h-4 bg-white/5 rounded-full w-2/3 mt-4"></div>
                            </div>
                        ) : verse ? (
                            <div className="space-y-6">
                                <div className="relative">
                                    <Quote className="absolute -top-4 -left-6 text-white/5" size={80} />
                                    <p className="text-xl md:text-2xl font-bold text-white leading-relaxed italic relative z-10">
                                        "{verse.text}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <p className="text-sm font-black text-blue-400 uppercase tracking-widest italic">
                                        — {verse.reference}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 italic font-medium">Unable to fetch nourishment for today.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 mt-12">
                    <Link href="/attendance" className="group relative bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>

                        <div className="relative z-10 flex items-center gap-5 mb-6">
                            <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                                <ClipboardCheck size={32} />
                            </div>
                            <div className="absolute top-0 right-0 p-6 flex items-center justify-center">
                                <ArrowUpRight className="text-slate-200 group-hover:text-blue-400 transition-colors" size={24} />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic mb-1">Attendance</h2>
                            <p className="text-slate-400 font-bold italic text-xs tracking-widest uppercase opacity-70 mb-4">Daily participation registry</p>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[200px]">Report presence for your family members in today's session.</p>
                        </div>
                    </Link>

                    <Link href="/child/add" className="group relative bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors"></div>

                        <div className="relative z-10 flex items-center gap-5 mb-6">
                            <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-xl shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                                <UserPlus size={32} />
                            </div>
                            <div className="absolute top-0 right-0 p-6 flex items-center justify-center">
                                <ArrowUpRight className="text-slate-200 group-hover:text-emerald-400 transition-colors" size={24} />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic mb-1">Add child</h2>
                            <p className="text-slate-400 font-bold italic text-xs tracking-widest uppercase opacity-70 mb-4">Child registration</p>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[200px]">Communicate with the CU secretary before adding any child to your family for approval.</p>
                        </div>
                    </Link>
                </div>


                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">
                        © 2026 TAFES ATC
                    </p>
                </div>
            </div>
        </div>
    );
}
