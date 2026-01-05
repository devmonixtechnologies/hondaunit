import React from 'react';
import { X, Instagram, MapPin, Car, Calendar, ExternalLink, User } from 'lucide-react';
import { UserProfile } from '../types';

interface UserDetailsModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header with cover image */}
        <div className="relative">
          {user.coverImage ? (
            <img 
              src={user.coverImage} 
              alt="Cover" 
              className="w-full h-48 object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-honda-red/20 to-zinc-800 rounded-t-2xl" />
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-zinc-800 rounded-full border-4 border-zinc-900 flex items-center justify-center">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-16">
          {/* Name and basic info */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
            {user.title && (
              <p className="text-honda-red font-medium mb-3">{user.title}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-gray-400">
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              )}
              {user.age && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{user.age} years old</span>
                </div>
              )}
              {user.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram size={16} />
                  <a 
                    href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-honda-red transition-colors"
                  >
                    @{user.instagram.replace('@', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Machine */}
          {user.machine && (
            <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Car size={20} className="text-honda-red" />
                <h3 className="font-bold text-lg">Machine</h3>
              </div>
              <p className="text-white font-medium">{user.machine}</p>
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Bio</h3>
              <p className="text-gray-300">{user.bio}</p>
            </div>
          )}

          {/* Description */}
          {user.description && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">About</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{user.description}</p>
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Connect</h3>
              <div className="space-y-2">
                {user.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                    <div>
                      <span className="text-honda-red font-medium">{link.platform}</span>
                      {link.handle && (
                        <span className="text-gray-400 ml-2">@{link.handle}</span>
                      )}
                    </div>
                    {link.url && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
