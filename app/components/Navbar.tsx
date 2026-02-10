'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { LogOut, LayoutDashboard, ClipboardCheck, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('familyId');
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', href: '/attendance', icon: ClipboardCheck },
    { name: 'Metrics', href: '/metrics', icon: BarChart3 },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2.5">
              <div className="relative w-9 h-9 bg-white rounded-lg p-1.5 shadow-lg shadow-blue-500/20">
                <Image
                  src="/logo-blue.png"
                  alt="TAFES Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-black text-lg text-white tracking-tighter uppercase italic">
                We<span className="text-blue-400">Fam</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <link.icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile/Compact Icons for smaller screens or just simple logout */}
            <div className="sm:hidden flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`p-2 rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                      }`}
                  >
                    <link.icon size={18} />
                  </Link>
                );
              })}
            </div>

            <div className="w-px h-6 bg-slate-800 mx-2"></div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
