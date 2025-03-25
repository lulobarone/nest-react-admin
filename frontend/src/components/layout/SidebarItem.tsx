import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({ children, to }: SidebarItemProps) {
  const location = useLocation();
  return (
    <Link
      to={to}
      className="no-underline text-white bg-brand-primary hover:bg-red-500 rounded-md p-3 transition-colors flex items-center justify-between"
    >
      <span className="flex items-center justify-between w-full font-semibold">
        <span className="flex items-center gap-x-5">{children}</span>
        {location.pathname === to ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
