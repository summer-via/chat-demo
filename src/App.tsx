import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { type TraceStep } from './components/ThoughtProcess';
import { Sparkles, Terminal, Shield, Zap, Search, Sun, Moon } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  date: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: { name: string; type: string }[];
  steps?: TraceStep[];
}

const INITIAL_SESSIONS: ChatSession[] = [
  { id: '1', title: 'Deep Learning Model Analysis', date: '2025-12-28' },
  { id: '2', title: 'Performance Bottleneck Fix', date: '2025-12-27' },
  { id: '3', title: 'New Layout Concept', date: '2025-12-26' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: "Greetings! I am your Advanced Intelligence Agent. How can I assist you with your project today?",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'm2',
    role: 'user',
    content: "Can you help me investigate the memory leak in the production logs I've uploaded?",
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: 'm3',
    role: 'assistant',
    content: "I've analyzed the logs. It seems the heap usage grows steadily after each garbage collection cycle, indicating a possible closure leak in the request handler.",
    timestamp: new Date(Date.now() - 2000000),
    steps: [
      { id: 's1', type: 'Thought', content: 'Identifying memory pressure patterns in logs', status: 'completed' },
      { id: 's2', type: 'Command', content: 'cat memory_logs_prod.txt | grep "heap_used"', status: 'completed', details: 'HEAP MAP:\n0min: 45MB\n5min: 120MB\n10min: 340MB\n15min: 890MB (OOM CRASH)' },
      { id: 's3', type: 'Plan', content: 'Correlate with active connections', status: 'completed' },
      { id: 's4', type: 'Action', content: 'Suggesting heap dump analysis', status: 'completed' }
    ]
  }
];

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = (content: string, files: File[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      files: files.map(f => ({ name: f.name, type: f.type }))
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm looking into the new information you've provided. Processing...",
        timestamp: new Date(),
        steps: [
          { id: 't1', type: 'Thought', content: 'Syncing with previous analysis data', status: 'completed' },
          { id: 't2', type: 'Plan', content: 'Checking file signatures', status: 'running' }
        ]
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'New Investigation',
      date: new Date().toISOString().split('T')[0]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setMessages([]);
  };

  useEffect(() => {
    const container = document.getElementById('app-root');
    if (container) container.scrollTop = 0;
  }, []);

  return (
    <div id="app-root" className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Sidebar 
        sessions={sessions} 
        activeSessionId={activeSessionId} 
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
      />

      <main className="flex-1 flex flex-col relative h-full">
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(139, 92, 246, 0.05)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(59, 130, 246, 0.05)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between px-8 border-b" style={{ height: '64px', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', zIndex: 10, borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Session:</span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {sessions.find(s => s.id === activeSessionId)?.title || 'Investigation'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
              style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Agent Online</span>
            </div>
            <Shield size={20} style={{ color: 'var(--text-tertiary)' }} />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="m-auto" style={{ maxWidth: '900px' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center animate-fade-in" style={{ marginTop: '5rem' }}>
                <div className="flex items-center justify-center rounded-3xl mb-6 shadow-xl" style={{ width: '64px', height: '64px', background: 'linear-gradient(to top right, var(--accent-primary), var(--accent-secondary))' }}>
                  <Sparkles size={32} color="white" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Empowering Your Creativity</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center', marginBottom: '40px' }}>AI-driven insights and code analysis at your fingertips.</p>
                
                <div className="grid md:grid-cols-2 gap-4 w-full">
                  {[
                    { icon: <Zap size={18} />, title: "Rapid Analysis", desc: "Insights in seconds" },
                    { icon: <Terminal size={18} />, title: "Code Guru", desc: "Debugging simplified" },
                    { icon: <Search size={18} />, title: "Precision Search", desc: "Filtered knowledge" },
                    { icon: <Shield size={18} />, title: "Secure Data", desc: "Privacy first" },
                  ].map((card, idx) => (
                    <div key={idx} className="p-5 rounded-3xl transition-all" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', cursor: 'default' }}>
                      <div className="mb-3" style={{ color: 'var(--accent-primary)' }}>{card.icon}</div>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{card.title}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(msg => <ChatMessage key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
