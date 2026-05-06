"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
    { name: "Dashboard", href: "/dashboard", color: "bg-[#4A8BDF]" },
    { name: "Pessoas", href: "/pessoas", color: "bg-blue-500" },
    { name: "Moradores", href: "/moradores", color: "bg-indigo-500" },
    { name: "Funcionários", href: "/funcionarios", color: "bg-orange-500" },
    { name: "Fornecedores", href: "/fornecedores", color: "bg-gray-600" },
    { name: "Visitantes", href: "/visitantes", color: "bg-green-500" },
    { name: "Unidades", href: "/unidades", color: "bg-purple-500" },
    { name: "Áreas Comuns", href: "/areas-comuns", color: "bg-emerald-500" },
    { name: "Reservas", href: "/reservas", color: "bg-rose-500" },
    { name: "Boletos", href: "/boletos", color: "bg-amber-500" },
    { name: "Comunicados", href: "/comunicados", color: "bg-sky-500" },
    { name: "Contratos", href: "/contratos", color: "bg-slate-600" },
    { name: "Contas a Pagar", color: "bg-red-500", href: "/contas-pagar" },
    { name: "Contas a Receber", color: "bg-teal-500", href: "/contas-receber" },
];

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