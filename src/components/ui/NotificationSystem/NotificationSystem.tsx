import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotificationSystem } from '../../../hooks/useNotifications';
import './NotificationSystem.css';

interface NotificationProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    actions?: Array<{ label: string; action: () => void; variant?: 'primary' | 'secondary' }>;
    onClose?: () => void;
  };
}

const NotificationItem: React.FC<NotificationProps> = ({ notification }) => {
  const { removeNotification } = useNotificationSystem();

  const handleClose = () => {
    removeNotification(notification.id);
  };

  const getIcon = () => {
    const iconProps = { size: 20, className: 'notification__icon-svg' };
    
    switch (notification.type) {
      case 'success': return <CheckCircle {...iconProps} />;
      case 'error': return <XCircle {...iconProps} />;
      case 'warning': return <AlertTriangle {...iconProps} />;
      case 'info': return <Info {...iconProps} />;
      default: return <Info {...iconProps} />;
    }
  };

  const getTypeClass = () => {
    return `notification notification--${notification.type}`;
  };

  return (
    <div className={getTypeClass()}>
      <div className="notification__icon">
        {getIcon()}
      </div>
      
      <div className="notification__content">
        <h4 className="notification__title">{notification.title}</h4>
        <p className="notification__message">{notification.message}</p>
        
        {notification.actions && notification.actions.length > 0 && (
          <div className="notification__actions">
            {notification.actions.map((action, index) => (
              <button
                key={index}
                className={`notification__action notification__action--${action.variant || 'secondary'}`}
                onClick={action.action}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <button 
        className="notification__close"
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const NotificationSystem: React.FC = () => {
  const { notifications } = useNotificationSystem();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-system">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;



