import React from 'react';
import { QuizMode } from '../types';
import { Clock, Grid, ChevronDown } from 'lucide-react';

interface HeaderProps {
  examTitle: string;
  activeSectionName: string;
  totalQuestions: number;
  completedCount: number;
  mode: QuizMode;
  setMode: (mode: QuizMode) => void;
  timerSeconds: number;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  examTitle,
  activeSectionName,
  totalQuestions,
  completedCount,
  mode,
  setMode,
  timerSeconds,
  onToggleSidebar,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="header">
      {/* Left section: Logo & Sidebar toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={onToggleSidebar}
          className="mobile-only-btn"
          title="Danh sách câu hỏi"
          style={{
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none'
          }}
        >
          <Grid size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: 16,
            flexShrink: 0
          }}>
            Q
          </div>
          <div className="header-title-box" style={{ whiteSpace: 'nowrap' }}>
            <h1 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>Quiz Master</h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>{activeSectionName || 'Bài thi'}</span>
          </div>
        </div>
      </div>

      {/* Right section: Timer & Mode Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Timer with tabular numbers & fixed width */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          color: 'var(--primary)',
          fontSize: 13,
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          minWidth: 74,
          justifyContent: 'center'
        }}>
          <Clock size={14} />
          <span>{formatTime(timerSeconds)}</span>
        </div>

        {/* Mode Dropdown Select */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as QuizMode)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid var(--primary-ring)',
              padding: '5px 24px 5px 10px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="practice">📖 Luyện tập</option>
            <option value="exam">🏆 Thi thử</option>
          </select>
          <ChevronDown size={14} color="var(--primary)" style={{ position: 'absolute', right: 7, pointerEvents: 'none' }} />
        </div>
      </div>
    </header>
  );
};
