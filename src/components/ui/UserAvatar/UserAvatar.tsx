import React from 'react';
import { teamMembersDetailed } from '../../../data/mockData';
import './UserAvatar.css';

interface UserAvatarProps {
  userName: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  userName, 
  size = 'md', 
  showStatus = true,
  className = '' 
}) => {
  const userInfo = teamMembersDetailed.find(u => u.name === userName);
  
  if (!userInfo) {
    return null;
  }

  const statusColor = userInfo.status === 'available' ? '#22c55e' : 
                     userInfo.status === 'busy' ? '#f59e0b' : '#6b7280';
  const statusText = userInfo.status === 'available' ? 'Disponible' : 
                    userInfo.status === 'busy' ? 'Ocupado' : 'Ausente';

  return (
    <div 
      className={`user-avatar user-avatar--${size} ${className}`}
      title={`${userInfo.name} - ${statusText}`}
    >
      <div className="user-avatar__circle">
        {userInfo.avatar}
        {showStatus && (
          <span 
            className="user-avatar__status"
            style={{ backgroundColor: statusColor }}
          />
        )}
      </div>
    </div>
  );
};

export default UserAvatar;

