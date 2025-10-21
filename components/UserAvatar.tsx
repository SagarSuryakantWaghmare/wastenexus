"use client";

import Image from 'next/image';

interface UserAvatarProps {
  name: string;
  profileImage?: string | { secure_url?: string; public_id?: string };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function UserAvatar({ name, profileImage, size = 'md', className = '' }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Extract image URL from profileImage (handle both string and object)
  const getImageUrl = (img?: string | { secure_url?: string; public_id?: string }): string | null => {
    if (!img) return null;
    if (typeof img === 'string') {
      // Validate string is not empty and is a valid URL or path
      const trimmed = img.trim();
      if (trimmed.length === 0) return null;
      // Check if it's a valid URL or path
      if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
        return trimmed;
      }
      return null;
    }
    if (typeof img === 'object' && img.secure_url) {
      const url = img.secure_url.trim();
      return url.length > 0 ? url : null;
    }
    return null;
  };

  const imageUrl = getImageUrl(profileImage);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name}'s profile`}
          width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 64 : 96}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 64 : 96}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center">
          <span className={`font-semibold text-white ${sizeClasses[size].split(' ')[2]}`}>
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  );
}
