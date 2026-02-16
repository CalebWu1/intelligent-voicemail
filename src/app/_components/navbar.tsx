'use client';

import { Bell, HelpCircle, MenuIcon, Search } from "lucide-react";
import { IconButton, Tooltip} from "@mui/material";

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
        
        <div className="flex items-center gap-2">
           <img src="/health-icon.svg" alt="" className="w-7 h-auto" />
           <span className="text-lg font-bold">Harbour to Sunset GP</span>
        </div>
      </div>
    </header>
  )
}