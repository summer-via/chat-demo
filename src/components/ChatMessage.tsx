import React from 'react';
import { User, Sparkles, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThoughtProcess, type TraceStep } from './ThoughtProcess';

interface FileAttachment {
  name: string;
  type: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: FileAttachment[];
  steps?: TraceStep[];
}

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`} style={{ maxWidth: '85%' }}>
        {/* Avatar */}
        <div className="flex shrink-0 items-center justify-center rounded-2xl" 
          style={{ 
            width: '40px', 
            height: '40px', 
            background: isUser ? 'var(--bg-tertiary)' : 'linear-gradient(to top right, var(--accent-primary), var(--accent-secondary))',
            color: isUser ? 'var(--text-secondary)' : 'white',
            boxShadow: isUser ? 'none' : '0 10px 15px -3px rgba(139, 92, 246, 0.2)',
            border: isUser ? '1px solid var(--border-color)' : 'none'
          }}>
          {isUser ? <User size={20} /> : <Sparkles size={20} />}
        </div>

        <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Content Box */}
          <div className="p-5 rounded-2xl shadow-sm" 
            style={{ 
              background: isUser ? 'var(--bg-quaternary)' : 'transparent', 
              color: 'var(--text-primary)',
              border: isUser ? '1px solid var(--border-color)' : 'none',
              borderTopRightRadius: isUser ? '0' : '16px',
              borderTopLeftRadius: isUser ? '16px' : '0'
            }}>
            {/* Thought Process for Assistant */}
            {!isUser && message.steps && (
              <ThoughtProcess steps={message.steps} />
            )}

            {/* Main Text */}
            <div style={{ fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {message.content}
            </div>

            {/* Files Attached */}
            {message.files && message.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {message.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                    style={{ background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <FileText size={14} />
                    <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <ExternalLink size={12} style={{ opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="px-2" style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
