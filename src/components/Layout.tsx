import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Network, 
  FileText, 
  Users, 
  FolderOpen,
  Activity,
  Menu,
  X,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: BarChart3,
    description: 'Overview & analytics'
  },
  { 
    name: 'Network', 
    href: '/network', 
    icon: Network,
    description: 'Collaboration graphs'
  },
  { 
    name: 'Collections', 
    href: '/collections', 
    icon: FolderOpen,
    description: 'Manage paper sets'
  },
  { 
    name: 'Papers', 
    href: '/papers', 
    icon: FileText,
    description: 'Browse research'
  },
  { 
    name: 'Authors', 
    href: '/authors', 
    icon: Users,
    description: 'Researcher profiles'
  },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mesh">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="modal-backdrop md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col bg-white/95 backdrop-blur-lg shadow-hard">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-soft">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gradient">Paper Graph</h1>
                <p className="text-xs text-gray-500">Research Analytics</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn-icon"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${isActive ? 'nav-link-active' : 'nav-link-inactive'} group`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75 truncate">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile footer */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center space-x-3">
              <button className="btn-icon">
                <Bell className="h-4 w-4" />
              </button>
              <button className="btn-icon">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex flex-col flex-1 min-h-0 bg-white/80 backdrop-blur-lg border-r border-white/30 shadow-soft">
          {/* Desktop header */}
          <div className="flex items-center h-20 px-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-soft">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gradient">Paper Graph</h1>
                <p className="text-sm text-gray-500">Research Analytics Platform</p>
              </div>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 px-6 py-8 space-y-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${isActive ? 'nav-link-active' : 'nav-link-inactive'} group`}
                >
                  <item.icon className="h-5 w-5 mr-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop footer */}
          <div className="p-6 border-t border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                v1.0.0 • Built with ❤️
              </div>
              <div className="flex items-center space-x-2">
                <button className="btn-icon">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="btn-icon">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-white/30 shadow-soft md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn-icon"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-purple-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 font-bold text-gradient">Paper Graph</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="btn-icon">
                <Search className="h-5 w-5" />
              </button>
              <button className="btn-icon">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 