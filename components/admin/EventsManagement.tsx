import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Search, MapPin, Clock, Eye, EyeOff, X, Save } from 'lucide-react';
import { adminApiService, Event } from '../../services/adminApi';
import useConfirmDialog from '../../hooks/useConfirmDialog';

const EventsManagement: React.FC = () => {
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    coverImage: '',
    isPublished: false
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchQuery]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await adminApiService.getEvents(currentPage, searchQuery);
      setEvents(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const serializeDate = (dateValue: string, timeValue?: string) => {
    if (!dateValue) return undefined;
    const iso = new Date(`${dateValue}T${timeValue && timeValue.length ? timeValue : '00:00'}`);
    if (isNaN(iso.getTime())) {
      throw new Error('Invalid date value');
    }
    return iso.toISOString();
  };

  const handleCreate = async () => {
    setFormError(null);
    const startDateIso = serializeDate(formData.startDate, formData.startTime);
    if (!startDateIso) {
      setFormError('Start date is required.');
      return;
    }
    const endDateIso = serializeDate(formData.endDate, formData.endTime);

    try {
      await adminApiService.createEvent({
        ...formData,
        startDate: startDateIso,
        endDate: endDateIso
      });
      setShowCreateModal(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;
    
    setFormError(null);
    const startDateIso = serializeDate(formData.startDate);
    if (!startDateIso) {
      setFormError('Start date is required.');
      return;
    }
    const endDateIso = serializeDate(formData.endDate);

    try {
      await adminApiService.updateEvent(editingEvent._id, {
        ...formData,
        startDate: startDateIso,
        endDate: endDateIso
      });
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete event?',
      message: 'This event will be removed for everyone. This action cannot be undone.',
      confirmLabel: 'Delete Event',
      tone: 'danger'
    });

    if (!confirmed) return;

    try {
      await adminApiService.deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      coverImage: '',
      isPublished: false
    });
    setFormError(null);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startDate: new Date(event.startDate).toISOString().split('T')[0],
      startTime: new Date(event.startDate).toISOString().split('T')[1]?.slice(0,5) || '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      endTime: event.endDate ? new Date(event.endDate).toISOString().split('T')[1]?.slice(0,5) || '' : '',
      coverImage: event.coverImage || '',
      isPublished: event.isPublished
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingEvent(null);
    resetForm();
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Events Management</h2>
          <p className="text-gray-400">Manage and schedule HondaUnit events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none transition-colors"
        />
      </div>

      {/* Events List */}
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
          {events.map((event) => (
            <div key={event._id} className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 hover:bg-zinc-900/70 transition-colors">
              <div className="flex gap-6">
                {event.coverImage && (
                  <div className="w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                      {event.description && (
                        <p className="text-gray-400 mb-3">{event.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {event.isPublished && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Published
                        </span>
                      )}
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.endDate && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>to {formatDate(event.endDate)}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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

      {/* Create/Edit Modal */}
      {(showCreateModal || editingEvent) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-2xl border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold">
                {editingEvent ? 'Edit Event' : 'Create Event'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                  placeholder="Event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none resize-none"
                  placeholder="Event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Start Date *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                      required
                    />
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                    />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:border-honda-red focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 bg-zinc-800 border border-white/10 rounded focus:border-honda-red"
                />
                <label htmlFor="isPublished" className="text-sm font-medium">
                  Publish this event
                </label>
              </div>
            </div>

            {formError && (
              <div className="px-6 text-sm text-red-400">
                {formError}
              </div>
            )}
            <div className="flex justify-end gap-4 p-6 border-t border-white/10">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? handleUpdate : handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-honda-red text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Save size={16} />
                {editingEvent ? 'Update' : 'Create'}
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

export default EventsManagement;
