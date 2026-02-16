'use client';

import { useState, type ReactNode } from "react";
import {BookOpen, Inbox, Plus, Upload, Share, Users, Star, Home, ChevronRight} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const tabs = ["Home", "Inbox"];
  const [activeTab, setActiveTab] = useState<string>('Home')
  return (
<div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`
        relative z-50 flex flex-col h-full border-r border-gray-200 bg-white p-4 font-sans text-gray-700 
        transition-all duration-300 ease-in-out shadow-xl shrink-0
        ${isOpen ? "w-78" : "w-[72px]"}
      `}
    >
      <nav className="flex-1 space-y-1 overflow-x-hidden">
        {/* Home */}
        <Link
          href={'/'}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-black cursor-pointer ${activeTab==='Home' ? 'bg-[#f3f4f8]': 'hover:bg-[#f3f4f8]'}`}
        >
          <Home className="w-4 h-4 min-w-[16px]"/>
          <span className={`text-sm font-medium transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}>
            Home
          </span>
        </Link>

        {/* Inbox */}
        <Link
          href={'/inbox'}
          className={`flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer ${activeTab==='Inbox' ? 'bg-[#f3f4f8]': 'hover:bg-[#f3f4f8]'}`}
        >
          <Inbox className="h-4 w-4 min-w-[16px] text-gray-600" />
          <span className={`text-sm font-medium transition-opacity ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}>
            Inbox
          </span>
        </Link>
      </nav>
    </div>
  )
}