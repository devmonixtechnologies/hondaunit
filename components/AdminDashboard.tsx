import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, Image, MessageSquare, LogOut, Settings, MapPin } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useNavigate } from 'react-router-dom';
import { adminApiService, AdminOverview, GalleryItem, Event, ContactMessage } from '../services/adminApi';
import AdminOverviewCard from './admin/AdminOverviewCard';
import GalleryManagement from './admin/GalleryManagement';
import EventsManagement from './admin/EventsManagement';
import ContactManagement from './admin/ContactManagement';
import UsersManagement from './admin/UsersManagement';
import BranchesManagement from './admin/BranchesManagement';

type AdminTab = 'overview' | 'gallery' | 'events' | 'contact' | 'users' | 'branches';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverview();
    }
  }, [activeTab]);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getOverview();
      setOverview(data);
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: BarChart3 },
    { id: 'gallery' as AdminTab, label: 'Gallery', icon: Image },
    { id: 'events' as AdminTab, label: 'Events', icon: Calendar },
    { id: 'contact' as AdminTab, label: 'Messages', icon: MessageSquare },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'branches' as AdminTab, label: 'Branches', icon: MapPin },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AdminOverviewCard
            overview={overview}
            isLoading={isLoading}
            onNavigate={(tab) => setActiveTab(tab as AdminTab)}
          />
        );
      case 'gallery':
        return <GalleryManagement />;
      case 'events':
        return <EventsManagement />;
      case 'contact':
        return <ContactManagement />;
      case 'users':
        return <UsersManagement />;
      case 'branches':
        return <BranchesManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <span className="text-sm text-gray-400">HondaUnit Management</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-left md:text-right">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-gray-400">Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/50 border border-red-500/30 rounded-lg hover:bg-red-900/70 transition-colors text-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row w-full">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-zinc-900 border-r border-white/10">
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-honda-red text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <div className="flex-1">
          {/* Mobile Tabs */}
          <div className="lg:hidden border-b border-white/10 bg-zinc-950">
            <div className="flex overflow-x-auto gap-2 px-4 py-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm border ${
                      isActive
                        ? 'bg-honda-red border-honda-red text-white'
                        : 'border-white/10 text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
;

export default AdminDashboard;
