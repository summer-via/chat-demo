import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BrainCircuit, 
  Search, 
  Terminal, 
  Zap, 
  ListTodo,
  Loader2
} from 'lucide-react';

export type TraceType = 'Thought' | 'Action' | 'Search' | 'Command' | 'Plan';

export interface TraceStep {
  id: string;
  type: TraceType;
  content: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
}

const getIcon = (type: TraceType, status: string) => {
  if (status === 'running') return <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />;
  
  switch (type) {
    case 'Thought': return <BrainCircuit size={16} style={{ color: '#60a5fa' }} />;
    case 'Action': return <Zap size={16} style={{ color: '#fbbf24' }} />;
    case 'Search': return <Search size={16} style={{ color: '#22d3ee' }} />;
    case 'Command': return <Terminal size={16} style={{ color: '#10b981' }} />;
    case 'Plan': return <ListTodo size={16} style={{ color: '#f472b6' }} />;
  }
};

export const ThoughtProcess: React.FC<{ steps: TraceStep[] }> = ({ steps }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 my-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1" style={{ height: '1px', background: 'var(--border-color)' }} />
        <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>
          Chain of Thought
        </span>
        <div className="flex-1" style={{ height: '1px', background: 'var(--border-color)' }} />
      </div>

      <div className="flex flex-col gap-2">
        {steps.map((step) => {
          const isExpanded = expandedIds.includes(step.id);
          return (
            <div 
              key={step.id} 
              className="rounded-xl transition-all"
              style={{ 
                border: isExpanded ? '1px solid var(--border-color)' : '1px solid transparent',
                background: isExpanded ? 'var(--subtle-bg)' : 'transparent'
              }}
            >
              <button
                onClick={() => toggleExpand(step.id)}
                className="w-full flex items-center gap-3 p-2 transition-all hover:bg-subtle-bg rounded-xl"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--hover-bg)' }}>
                  {getIcon(step.type, step.status)}
                </div>
                
                <div className="flex-1 flex items-center gap-2">
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}>
                    {step.type}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    {step.content}
                  </span>
                </div>

                <div style={{ color: 'var(--text-tertiary)' }}>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>

              {isExpanded && step.details && (
                <div style={{ padding: '4px 12px 12px 48px' }}>
                  <div style={{ background: 'var(--subtle-bg)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', border: '1px solid var(--border-color)' }}>
                    {step.details}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
