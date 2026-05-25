"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { menuItems } from "../lib/navigation";

interface PageLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    actionButton?: ReactNode;
}

export default function PageLayout({ children, title, description, actionButton }: PageLayoutProps) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        }
    }, [router]);

    if (!isClient) return null;

    return (
        <div className="min-h-screen flex bg-[#EFFAFD] font-sans">
            <Sidebar items={menuItems} />
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
                        {description && (
                            <p className="text-slate-500 mt-2 font-medium">{description}</p>
                        )}
                    </div>
                    {actionButton && (
                        <div className="flex items-center gap-3">
                            {actionButton}
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-3xl p-6 md:p-8 lg:p-10 lg:px-12 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    {children}
                </div>
            </main>
        </div>
    );
}