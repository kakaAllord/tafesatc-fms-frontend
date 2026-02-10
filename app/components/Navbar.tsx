'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
             <Link href="/dashboard" className="font-bold text-xl text-white">WeFam</Link>
          </div>
          <div className="flex items-center space-x-4">
             <Link href="/dashboard" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
             <Link href="/attendance" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">Attendance</Link>
             <button onClick={handleLogout} className="text-white hover:text-red-300 p-2">
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
