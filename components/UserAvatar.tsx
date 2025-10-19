"use client";

import Image from 'next/image';

interface UserAvatarProps {
  name: string;
  profileImage?: string;
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

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      {profileImage ? (
        <Image
          src={profileImage}
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
