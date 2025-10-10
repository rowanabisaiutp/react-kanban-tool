import React from 'react';
import { teamMembersDetailed } from '../../../data/mockData';

interface TaskCardMentionsProps {
  showMentionDropdown: boolean;
  mentionFilter: string;
  onSelectMention: (userName: string) => void;
}

export const TaskCardMentions: React.FC<TaskCardMentionsProps> = ({
  showMentionDropdown,
  mentionFilter,
  onSelectMention
}) => {
  // Filtrar usuarios según el texto después del @
  const filteredUsers = teamMembersDetailed.filter(user =>
    user.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  if (!showMentionDropdown || filteredUsers.length === 0) {
    return null;
  }

  return (
    <div className="task-card__mention-dropdown" onClick={(e) => e.stopPropagation()}>
      {filteredUsers.map((user) => (
        <div
          key={user.name}
          className="task-card__mention-item"
          onClick={() => onSelectMention(user.name)}
        >
          <div className="task-card__mention-avatar">
            {user.avatar}
          </div>
          <div className="task-card__mention-info">
            <span className="task-card__mention-name">{user.name}</span>
            <span className="task-card__mention-status" data-status={user.status}>
              {user.status === 'online' ? '🟢' : user.status === 'busy' ? '🔴' : user.status === 'away' ? '🟡' : '⚫'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

