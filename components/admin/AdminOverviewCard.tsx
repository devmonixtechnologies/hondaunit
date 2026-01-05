import React from 'react';
import { Users, Calendar, Image, MessageSquare, TrendingUp, UserCheck, Shield } from 'lucide-react';
import { AdminOverview } from '../../services/adminApi';

interface AdminOverviewCardProps {
  overview: AdminOverview | null;
  isLoading: boolean;
}

const AdminOverviewCard: React.FC<AdminOverviewCardProps> = ({ overview, isLoading }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: overview?.users.total || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: overview ? `${overview.users.active} active` : 'Loading...'
    },
    {
      title: 'Admin Users',
      value: overview?.users.admins || 0,
      icon: Shield,
      color: 'bg-purple-500',
      change: 'Administrators'
    },
    {
      title: 'Total Events',
      value: overview?.events.total || 0,
      icon: Calendar,
      color: 'bg-green-500',
      change: overview ? `${overview.events.published} published` : 'Loading...'
    },
    {
      title: 'Gallery Items',
      value: overview?.gallery.total || 0,
      icon: Image,
      color: 'bg-orange-500',
      change: overview ? `${overview.gallery.featured} featured` : 'Loading...'
    },
    {
      title: 'New Messages',
      value: overview?.inbox.new || 0,
      icon: MessageSquare,
      color: 'bg-red-500',
      change: overview ? `${overview.inbox.open} total open` : 'Loading...'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded mb-2"></div>
            <div className="h-8 bg-zinc-800 rounded mb-2"></div>
            <div className="h-3 bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome back! Here's what's happening with HondaUnit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 hover:bg-zinc-900/70 transition-colors">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
              <div className="text-3xl font-bold mb-1">{card.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{card.change}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-zinc-900/50 border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-honda-red/10 border border-honda-red/30 rounded-lg hover:bg-honda-red/20 transition-colors">
            <Users size={20} className="text-honda-red" />
            <span className="text-left">
              <div className="font-medium">Manage Users</div>
              <div className="text-xs text-gray-400">View and edit user profiles</div>
            </span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors">
            <Image size={20} className="text-blue-400" />
            <span className="text-left">
              <div className="font-medium">Add Gallery Item</div>
              <div className="text-xs text-gray-400">Upload new content</div>
            </span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors">
            <Calendar size={20} className="text-green-400" />
            <span className="text-left">
              <div className="font-medium">Create Event</div>
              <div className="text-xs text-gray-400">Schedule new events</div>
            </span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors">
            <MessageSquare size={20} className="text-orange-400" />
            <span className="text-left">
              <div className="font-medium">View Messages</div>
              <div className="text-xs text-gray-400">Check contact form</div>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewCard;
