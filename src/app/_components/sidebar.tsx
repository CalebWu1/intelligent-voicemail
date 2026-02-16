interface SidebarLinkProps {
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ label, active }) => (
  <div className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
    active 
      ? 'bg-white/10 border-l-4 border-pink-500 font-semibold text-white' 
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`}>
    {label}
  </div>
);
export function Sidebar() {

  return (
    <nav className="mt-4 flex-1">
      <SidebarLink label="Patient Outcomes" />
      <SidebarLink label="Infection Control" />
      <SidebarLink label="Hospital Operations" active />
      <SidebarLink label="Revenue Cycle Management" />
      <SidebarLink label="Cost of Care" />
    </nav>
  )
}