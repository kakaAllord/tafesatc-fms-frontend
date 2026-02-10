'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import { getHistory } from '../services/api';
import { Calendar, UserPlus, FileText } from 'lucide-react';

export default function Dashboard() {
    const [history, setHistory] = useState<any[]>([]);
    const familyId = Cookies.get('familyId');

    useEffect(() => {
        if (familyId) {
            getHistory(familyId).then(res => {
                if (res.data.success) setHistory(res.data.body);
            });
        }
    }, [familyId]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome Family!</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link href="/attendance" className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
                            <Calendar size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
                            <p className="text-gray-500 text-sm">Submit attendance for today</p>
                        </div>
                    </Link>

                    <Link href="/child/add" className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow flex items-center">
                        <div className="bg-green-100 p-3 rounded-full mr-4 text-green-600">
                            <UserPlus size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Child</h2>
                            <p className="text-gray-500 text-sm">Register a new child</p>
                        </div>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <FileText className="text-gray-400 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-800">Recent Attendance History</h2>
                    </div>

                    <ul className="divide-y divide-gray-200">
                        {history.length === 0 ? <p className="text-gray-500 py-4 text-center">No history found.</p> :
                            history.slice(0, 5).map((att, idx) => (
                                <li key={idx} className="py-3 flex justify-between items-center">
                                    <span className="text-gray-700">{new Date(att.date).toDateString()}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${att.isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {att.isPresent ? 'Present' : 'Absent'}
                                    </span>
                                    <span className="text-gray-500 text-sm">{att.user_id?.name}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
