'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { addChild, getCourses } from '../../services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AddChild() {
    const [name, setName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [level, setLevel] = useState('4');
    const [courses, setCourses] = useState<any[]>([]);
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
        if (!familyId) {
            setError("Session error. Please relogin.");
            return;
        }
        try {
            const res = await addChild({ name, courseId, level, familyId });
            if (res.data.success) {
                router.push('/dashboard');
            } else {
                setError(res.data.error || 'Failed to add child');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add child');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-md mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Add New Child</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Child Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Course</label>
                        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" required>
                            <option value="">Select Course</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Level</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" required>
                            {["4", "5", "6", "7_1", "7_2", "8"].map(l => <option key={l} value={l}>Level {l.replace('_', '.')}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200">
                        Add Child
                    </button>
                </form>
            </div>
        </div>
    );
}
