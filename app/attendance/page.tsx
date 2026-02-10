'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getMembers, submitAttendance } from '../services/api';
import Cookies from 'js-cookie';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AttendancePage() {
    const [members, setMembers] = useState<any[]>([]);
    const [attendanceState, setAttendanceState] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const familyId = Cookies.get('familyId');
    const today = new Date();

    useEffect(() => {
        if (familyId) {
            getMembers(familyId).then(res => {
                if (res.data.success) {
                    setMembers(res.data.body);
                    // Initialize all as present by default? Or absent?
                    // Let's initialize as False (Absent) or let user toggle. 
                    // Better: Empty keys, user toggles.
                }
                setLoading(false);
            });
        }
    }, [familyId]);

    const toggleAttendance = (userId: string) => {
        setAttendanceState(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            // Prepare payload: [{user_id, isPresent}]
            const attendances = members.map(m => ({
                user_id: m._id,
                isPresent: !!attendanceState[m._id]
            }));

            const res = await submitAttendance(attendances, today);
            if (res.data.success) {
                alert("Attendance submitted successfully!");
                router.push('/dashboard');
            } else {
                setError(res.data.error || "Submission failed");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading members...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-3xl mx-auto w-full px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
                <p className="text-gray-500 mb-6">{today.toDateString()}</p>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {members.map(member => {
                            const isPresent = !!attendanceState[member._id];
                            return (
                                <div key={member._id}
                                    onClick={() => toggleAttendance(member._id)}
                                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isPresent ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800 text-lg">{member.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full w-max ${member.isParent ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {member.isParent ? 'Parent' : 'Child'}
                                        </span>
                                    </div>

                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isPresent ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-300'}`}>
                                        {isPresent ? <Check size={24} /> : <X size={20} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
