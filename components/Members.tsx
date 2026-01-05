import React, { useState, useEffect } from 'react';
import { Instagram, MapPin, Car, Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { apiService } from '../services/api';
import { UserProfile } from '../types';
import UserDetailsModal from './UserDetailsModal';
import { useLanguage } from '../lib/languageContext';

const Members: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 20;
  const { t } = useLanguage();

  const fetchUsers = async (page: number, search?: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.getPublicUsers(page, search);
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
      setTotalUsers(response.pagination.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);

  return (
    <>
      <section id="members" className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-honda-red/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-honda-red font-bold tracking-widest uppercase mb-4">{t.members.eyebrow}</h2>
            <h3 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
              {t.members.headlineStart.toUpperCase()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.members.headlineAccent.toUpperCase()}</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t.members.description}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-honda-red transition-colors duration-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-12 pr-4 py-4 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-honda-red/50 focus:bg-zinc-900/80 focus:ring-1 focus:ring-honda-red/50 transition-all duration-300 shadow-lg font-sans"
              placeholder={t.members.searchPlaceholder}
            />
          </div>

          {/* Table Container */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[400px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-gray-500">{t.members.loading}</div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 border-b border-white/10">
                        <th className="py-6 px-6 font-display text-sm uppercase tracking-wider text-gray-500 font-bold">{t.members.table.driver}</th>
                        <th className="py-6 px-6 font-display text-sm uppercase tracking-wider text-gray-500 font-bold">{t.members.table.machine}</th>
                        <th className="py-6 px-6 font-display text-sm uppercase tracking-wider text-gray-500 font-bold hidden sm:table-cell">{t.members.table.location}</th>
                        <th className="py-6 px-6 font-display text-sm uppercase tracking-wider text-gray-500 font-bold text-center hidden sm:table-cell">{t.members.table.age}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr 
                            key={user.id} 
                            className="hover:bg-white/5 transition-colors duration-200 group cursor-pointer"
                            onClick={() => handleUserClick(user)}
                          >
                            {/* Username */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-3 text-white group-hover:text-honda-red transition-colors">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 group-hover:border-honda-red/50">
                                  {user.avatarUrl ? (
                                    <img 
                                      src={user.avatarUrl} 
                                      alt={user.name}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <User size={18} />
                                  )}
                                </div>
                                <div>
                                  <span className="font-bold tracking-wide block">{user.name}</span>
                                  {user.instagram && (
                                    <span className="text-sm text-gray-400">{user.instagram}</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Machine */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-2">
                                <Car size={16} className="text-gray-500 hidden sm:block" />
                                <span className="font-display font-semibold text-white/90 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
                                  {user.machine || 'No machine listed'}
                                </span>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="py-5 px-6 hidden sm:table-cell">
                              <div className="flex items-center gap-2 text-gray-400">
                                <MapPin size={14} />
                                <span>{user.location || 'Unknown'}</span>
                              </div>
                            </td>

                            {/* Age */}
                            <td className="py-5 px-6 text-center font-mono text-gray-500 hidden sm:table-cell">
                              {user.age || '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <Search size={32} className="opacity-20" />
                              <p>{t.members.emptyMessage(searchQuery)}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Footer of Table with Pagination */}
                <div className="bg-black/40 border-t border-white/10 p-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest gap-4">
                  <div className="flex items-center gap-2">
                    {users.length > 0 ? (
                      <span>{t.members.table.showing(startIndex + 1, endIndex, totalUsers)}</span>
                    ) : (
                      <span>{t.members.emptyMessage(searchQuery)}</span>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                              currentPage === page 
                              ? 'bg-honda-red text-white' 
                              : 'hover:bg-white/10 text-gray-500 hover:text-white'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                        aria-label="Next Page"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <UserDetailsModal 
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </>
  );
};

export default Members;