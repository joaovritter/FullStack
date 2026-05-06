"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type MenuItem = { name: string; href: string; color?: string };

export default function Sidebar({ items }: { items: MenuItem[] }) {
    const path = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav aria-label="Navegação principal" className="w-72 bg-white/90 backdrop-blur-xl border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-screen p-6 sticky top-0 flex flex-col z-50">
            <div className="mb-10 flex items-center gap-4 px-2">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#4A8BDF] to-[#A0006D] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#4A8BDF]/30">
                    C
                </div>
                <div>
                    <div className="text-xl font-bold text-slate-800 tracking-tight">Condo<span className="text-[#4A8BDF]">Admin</span></div>
                    <div className="text-xs font-semibold text-[#A0006D] uppercase tracking-widest mt-0.5">Gestão Premium</div>
                </div>
            </div>

            <div className="overflow-y-auto pr-2 -mr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <ul role="menu" className="space-y-1.5">
                    <li className="mb-4 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Menu Principal</li>
                    {items.map((item) => {
                        const isActive = path === item.href;
                        return (
                            <li key={item.href} role="none">
                                <Link
                                    href={item.href}
                                    role="menuitem"
                                    aria-current={isActive ? "page" : undefined}
                                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]/50 transition-all duration-300 relative overflow-hidden ${isActive
                                            ? "bg-gradient-to-r from-[#4A8BDF]/10 to-transparent text-[#4A8BDF] font-semibold"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium"
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4A8BDF] rounded-r-md shadow-[0_0_8px_#4A8BDF]"></div>
                                    )}
                                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? "bg-[#4A8BDF] scale-125" : "bg-slate-300 group-hover:bg-[#A0006D]"}`} aria-hidden="true"></div>
                                    <span className="tracking-wide text-sm">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-white hover:bg-gradient-to-r hover:from-[#A0006D] hover:to-[#c40087] transition-all duration-300 focus:outline-none shadow-md shadow-transparent hover:shadow-[#A0006D]/20 group"
                >
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair do Sistema
                </button>
            </div>
        </nav>
    );
}