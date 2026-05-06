"use client";
import React from "react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    color: "blue" | "indigo" | "purple" | "green" | "red" | "amber" | "teal" | "berinjela" | "royal";
    loading?: boolean;
}

const colorMap = {
    blue: "from-blue-500/10 to-transparent text-blue-600 border-blue-100",
    indigo: "from-indigo-500/10 to-transparent text-indigo-600 border-indigo-100",
    purple: "from-purple-500/10 to-transparent text-purple-600 border-purple-100",
    green: "from-emerald-500/10 to-transparent text-emerald-600 border-emerald-100",
    red: "from-rose-500/10 to-transparent text-rose-600 border-rose-100",
    amber: "from-amber-500/10 to-transparent text-amber-600 border-amber-100",
    teal: "from-teal-500/10 to-transparent text-teal-600 border-teal-100",
    berinjela: "from-[#A0006D]/10 to-transparent text-[#A0006D] border-[#A0006D]/20",
    royal: "from-[#4A8BDF]/10 to-transparent text-[#4A8BDF] border-[#4A8BDF]/20",
};

const iconBgMap = {
    blue: "bg-blue-100 text-blue-600",
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-emerald-100 text-emerald-600",
    red: "bg-rose-100 text-rose-600",
    amber: "bg-amber-100 text-amber-600",
    teal: "bg-teal-100 text-teal-600",
    berinjela: "bg-[#A0006D]/10 text-[#A0006D]",
    royal: "bg-[#4A8BDF]/10 text-[#4A8BDF]",
};

export default function StatCard({
    title,
    value,
    icon,
    color,
    loading = false,
}: StatCardProps) {
    return (
        <div className={`p-5 lg:p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
            {/* Background Gradient Accent */}
            <div className={`absolute top-0 right-0 left-0 h-full bg-gradient-to-b ${colorMap[color]} opacity-50 pointer-events-none`}></div>

            <div className="relative flex items-start justify-between z-10">
                <div className="flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 truncate">
                        {title}
                    </p>
                    {loading ? (
                        <div className="h-9 w-24 bg-slate-100 animate-pulse rounded mt-2"></div>
                    ) : (
                        <p className="text-3xl font-black text-slate-800 tracking-tight">
                            {value}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${iconBgMap[color]} group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}