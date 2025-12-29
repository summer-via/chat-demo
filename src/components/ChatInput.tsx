import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Mic, Sparkles, X, FileText, Image as ImageIcon, FileCode, Terminal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, files: File[]) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if ((message.trim() || files.length > 0) && !isLoading) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={14} />;
    if (file.type.includes('javascript') || file.name.endsWith('.ts') || file.name.endsWith('.py')) return <FileCode size={14} />;
    return <FileText size={14} />;
  };

  return (
    <div className="w-full px-4 pb-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="relative glass shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden', padding: '8px', background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 px-2 pt-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all" 
                style={{ background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {getFileIcon(file)}
                <span className="truncate" style={{ maxWidth: '120px' }}>{file.name}</span>
                <button onClick={() => removeFile(i)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 transition-all hover:bg-subtle-bg rounded-xl"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            title="Upload files"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: 'var(--text-primary)', 
              padding: '12px 10px', 
              fontSize: '15px', 
              resize: 'none', 
              minHeight: '44px',
              fontWeight: '500'
            }}
          />

          <div className="flex items-center gap-2 pr-1 mb-1">
            <button
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              title="Voice input"
            >
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || (!message.trim() && files.length === 0)}
              className="p-3 rounded-xl transition-all shadow-md"
              style={{ 
                background: (message.trim() || files.length > 0) ? 'var(--accent-primary)' : 'var(--subtle-bg)', 
                color: (message.trim() || files.length > 0) ? 'white' : 'var(--text-tertiary)',
                border: 'none',
                cursor: (message.trim() || files.length > 0) ? 'pointer' : 'default'
              }}
            >
              {isLoading ? <Sparkles size={18} className="animate-pulse" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4" style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <div className="flex items-center gap-1.5 hover:text-text-secondary cursor-default transition-colors">
          <Sparkles size={12} />
          <span>Advanced Intelligence</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-text-secondary cursor-default transition-colors">
          <Terminal size={12} />
          <span>Secure Sandbox</span>
        </div>
      </div>
    </div>
  );
};
