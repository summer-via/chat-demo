import React, { useState } from 'react';
import { MessageSquare, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`h-full border-r transition-all flex flex-col bg-sidebar ${isCollapsed ? 'w-20' : 'w-72'}`}
      style={{ 
        width: isCollapsed ? '80px' : '288px',
        borderColor: 'var(--border-color)',
        background: 'var(--bg-secondary)'
      }}
    >
      <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
        {!isCollapsed && (
          <h1 className="text-lg font-bold gradient-text">AI Assistant</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg transition-all"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-3 p-3 rounded-xl glass transition-all ${isCollapsed ? 'justify-center' : ''}`}
          style={{ cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <Plus size={20} style={{ color: 'var(--accent-primary)' }} />
          {!isCollapsed && <span className="font-medium">New Chat</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isCollapsed ? 'justify-center' : ''}`}
              style={{ 
                border: 'none', 
                background: activeSessionId === session.id ? 'var(--hover-bg)' : 'transparent', 
                color: activeSessionId === session.id ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer' 
              }}
            >
              <MessageSquare size={18} />
              {!isCollapsed && (
                <span className="flex-1 text-left truncate font-medium">{session.title}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '32px', height: '32px', background: 'linear-gradient(to top right, var(--accent-primary), #3b82f6)' }}>
            HW
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Hwf User</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
