import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Mail, User, Clock, CheckCircle, AlertCircle, Archive, Trash2, Edit, X, Save } from 'lucide-react';
import { adminApiService, ContactMessage } from '../../services/adminApi';
import useConfirmDialog from '../../hooks/useConfirmDialog';

const ContactManagement: React.FC = () => {
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [formData, setFormData] = useState({
    status: 'new' as 'new' | 'in_progress' | 'resolved',
    adminNotes: ''
  });

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchQuery, statusFilter]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await adminApiService.getContactMessages(
        currentPage, 
        statusFilter === 'all' ? undefined : statusFilter, 
        searchQuery
      );
      setMessages(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMessage) return;
    
    try {
      await adminApiService.updateContactMessage(editingMessage._id, formData);
      setEditingMessage(null);
      setFormData({ status: 'new', adminNotes: '' });
      fetchMessages();
    } catch (error) {
      console.error('Failed to update contact message:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete message?',
      message: 'This message will be permanently removed from the inbox. This action cannot be undone.',
      confirmLabel: 'Delete Message',
      tone: 'danger'
    });

    if (!confirmed) return;

    try {
      await adminApiService.deleteContactMessage(id);
      fetchMessages();
    } catch (error) {
      console.error('Failed to delete contact message:', error);
    }
  };

  const openEditModal = (message: ContactMessage) => {
    setEditingMessage(message);
    setFormData({
      status: message.status,
      adminNotes: message.adminNotes || ''
    });
  };

  const closeModal = () => {
    setEditingMessage(null);
    setFormData({ status: 'new', adminNotes: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return AlertCircle;
      case 'in_progress':
        return Clock;
      case 'resolved':
        return CheckCircle;
      default:
        return MessageSquare;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contact Messages</h2>
        <p className="text-gray-400">Manage inquiries from the contact form</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-zinc-800 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded mb-2"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const StatusIcon = getStatusIcon(message.status);
            return (
              <div key={message._id} className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 hover:bg-zinc-900/70 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-bold">{message.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail size={14} />
                        <span>{message.email}</span>
                        {message.handle && (
                          <>
                            <span>•</span>
                            <span>@{message.handle}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                      <StatusIcon size={12} className="inline mr-1" />
                      {message.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => openEditModal(message)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(message._id)}
                      className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Received: {formatDate(message.createdAt)}</span>
                    {message.respondedAt && (
                      <span>Responded: {formatDate(message.respondedAt)}</span>
                    )}
                  </div>
                  
                  {message.adminNotes && (
                    <div className="text-xs bg-zinc-800 px-2 py-1 rounded">
                      Notes: {message.adminNotes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full transition-colors ${
                currentPage === page
                  ? 'bg-honda-red text-white'
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-2xl border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold">Manage Message</h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Message Info */}
              <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <User size={20} className="text-gray-500" />
                  <div>
                    <div className="font-bold">{editingMessage.name}</div>
                    <div className="text-sm text-gray-400">{editingMessage.email}</div>
                  </div>
                </div>
                <p className="text-gray-300">{editingMessage.message}</p>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Admin Notes</label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none resize-none"
                    placeholder="Add notes about this message..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-white/10">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Save size={16} />
                Update Message
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {ConfirmDialogComponent}
    </>
  );
};

export default ContactManagement;
