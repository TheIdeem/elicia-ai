'use client'
import { FC, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

// Import icons (using heroicons)
import {
  HomeIcon,
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  PhoneArrowDownLeftIcon,
  PhoneArrowUpRightIcon,
  DevicePhoneMobileIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  hasChildren?: boolean;
  children?: { href: string; label: string; icon?: React.ReactNode }[];
  isExpanded?: boolean;
  toggleExpand?: () => void;
}

const NavItem: FC<NavItemProps> = ({
  href,
  label,
  icon,
  isActive,
  hasChildren = false,
  children = [],
  isExpanded = false,
  toggleExpand
}) => {
  return (
    <div>
      <Link
        href={href}
        className={`flex items-center px-4 py-3 text-sm rounded-lg group ${
          isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={hasChildren && toggleExpand ? (e) => {
          e.preventDefault();
          toggleExpand();
        } : undefined}
      >
        <span className="w-5 h-5 mr-3">{icon}</span>
        <span className="flex-1">{label}</span>
        {hasChildren && (
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>
      
      {hasChildren && isExpanded && (
        <div className="pl-12 mt-1 space-y-1">
          {children.map((child, idx) => (
            <Link
              key={idx}
              href={child.href}
              className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                usePathname() === child.href.split('?')[0] && 
                (child.href.includes('?') ? 
                  useSearchParams().toString() === child.href.split('?')[1] : 
                  true)
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {child.icon && <span className="w-4 h-4 mr-3">{child.icon}</span>}
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedItem, setExpandedItem] = useState<string | null>('calls');

  const toggleExpand = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  // Helper to check if a path with query is active
  const isPathActive = (path: string) => {
    if (!path.includes('?')) {
      return pathname === path;
    }
    
    const [basePath, query] = path.split('?');
    return pathname === basePath && searchParams.toString() === query;
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Elicia AI</h1>
        <p className="text-sm text-gray-500 mt-1">AI Calling Agent</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem
          href="/dashboard"
          label="Dashboard"
          icon={<HomeIcon />}
          isActive={pathname === '/dashboard'}
        />
        
        <NavItem
          href="/calls"
          label="Calls"
          icon={<PhoneIcon />}
          isActive={pathname === '/calls'}
        />
        
        <NavItem
          href="/leads"
          label="Leads"
          icon={<UserGroupIcon />}
          isActive={pathname === '/leads'}
        />
        
        <NavItem
          href="/meetings"
          label="Meetings"
          icon={<CalendarIcon />}
          isActive={pathname === '/meetings'}
        />
        
        <NavItem
          href="/tasks"
          label="Tasks"
          icon={<ClipboardIcon className="h-5 w-5" />}
          isActive={pathname === '/tasks'}
        />
        
        <NavItem
          href="/properties"
          label="Properties"
          icon={<BuildingOfficeIcon />}
          isActive={pathname === '/properties'}
        />
        
        <NavItem
          href="/upload"
          label="Upload"
          icon={<ArrowUpTrayIcon />}
          isActive={pathname === '/upload'}
        />

        <NavItem
          href="/demo"
          label="Demo"
          icon={<DevicePhoneMobileIcon />}
          isActive={pathname === '/demo'}
        />
      </nav>

      <div className="p-4 border-t border-gray-200">
        <NavItem
          href="/settings"
          label="Settings"
          icon={<Cog6ToothIcon />}
          isActive={pathname === '/settings'}
        />
      </div>
    </div>
  );
};

export default Sidebar; 