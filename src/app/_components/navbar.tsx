'use client';

import { MenuIcon } from "lucide-react";
import { IconButton, Tooltip} from "@mui/material";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  return (
    <header className="flex h-[56px] w-full items-center justify-between border-b border-gray-200 bg-[#1A0B3C] px-4">
      <div className="items-center gap-4 text-white flex grow">
        <Tooltip
            title= {sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            placement="bottom"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: '#111',
                  fontSize: '12px',
                  padding: '4px 8px',
                },
              },
              arrow: {
                sx: { color: '#111' },
              },
            }}
          >
            <IconButton onClick={onMenuClick}>
              <MenuIcon className="h-5 w-5 text-gray-500" />
            </IconButton>
          </Tooltip>
        
        <Link
          href={'/'}
          className="flex items-center gap-2"
        >
           <Image src="/health-icon.svg" alt="PulseTriage Logo" width={28} height={28} className="w-7 h-auto" />
           <span className="text-lg font-bold">PulseTriage</span>
        </Link>
      </div>
    </header>
  )
}