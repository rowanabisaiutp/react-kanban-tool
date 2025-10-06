import React from 'react';
import './UserDetectionPanel.css';

interface UserDetectionPanelProps {
  showDetails?: boolean;
  maxUsers?: number;
  onUserClick?: (user: any) => void;
}

const UserDetectionPanel: React.FC<UserDetectionPanelProps> = ({
  showDetails: _showDetails = false,
  maxUsers: _maxUsers = 10,
  onUserClick: _onUserClick
}) => {
  // Componente temporalmente deshabilitado
  return (
    <div className="user-detection-panel user-detection-panel--disabled">
      <div className="user-detection-toggle">
        <span>👤 Usuarios (próximamente)</span>
      </div>
    </div>
  );
};

export default UserDetectionPanel;