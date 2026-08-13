import React from 'react';
import { Section, Question } from '../types';
import { Layers, RotateCcw, Send, X } from 'lucide-react';

interface SidebarProps {
  sections: Section[];
  activeSectionIndex: number;
  onSelectSection: (index: number) => void;
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  userAnswers: { [key: number]: number[] };
  bookmarks: number[];
  onSubmitQuiz: () => void;
  onResetQuiz: () => void;
  isSubmitted: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSectionIndex,
  onSelectSection,
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  userAnswers,
  bookmarks,
  onSubmitQuiz,
  onResetQuiz,
  isSubmitted,
  onClose,
}) => {
  return (
    <aside className="sidebar">
      {/* Mobile Drawer Close Header */}
      <div className="mobile-sidebar-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Danh sách câu hỏi</span>
        <button onClick={onClose} style={{ padding: 6, borderRadius: '50%', background: 'var(--bg-subtle)' }}>
          <X size={20} />
        </button>
      </div>
      {/* Sections Selector */}
      {sections.length > 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={14} /> Danh sách Phần thi ({sections.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sections.map((sec, idx) => (
              <button
                key={sec.uuid}
                onClick={() => onSelectSection(idx)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: 14,
                  background: activeSectionIndex === idx ? 'var(--primary-light)' : 'var(--bg-subtle)',
                  color: activeSectionIndex === idx ? 'var(--primary)' : 'var(--text-main)',
                  border: activeSectionIndex === idx ? '1px solid var(--primary-hover)' : '1px solid transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{sec.name}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>({sec.questions.length} câu)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Questions Matrix Palette */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>
            Bảng câu hỏi ({questions.length})
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
            {Object.keys(userAnswers).length}/{questions.length} đã chọn
          </span>
        </div>

        <div className="grid-palette">
          {questions.map((q, idx) => {
            const isCurrent = currentQuestionIndex === idx;
            const isAnswered = !!userAnswers[q.id] && userAnswers[q.id].length > 0;
            const isBookmarked = bookmarks.includes(q.id);

            let statusClass = '';
            if (isSubmitted || (userAnswers[q.id] && userAnswers[q.id].length > 0)) {
              const selected = userAnswers[q.id] || [];
              const correctIds = q.answers.filter(a => a.is_correct).map(a => a.id);
              const isCorrect = selected.length === correctIds.length && selected.every(id => correctIds.includes(id));
              if (selected.length > 0) {
                statusClass = isCorrect ? 'correct' : 'incorrect';
              }
            } else if (isAnswered) {
              statusClass = 'answered';
            }

            return (
              <button
                key={q.id}
                onClick={() => onSelectQuestion(idx)}
                className={`q-btn ${isCurrent ? 'active' : ''} ${statusClass} ${isBookmarked ? 'bookmarked' : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
        {!isSubmitted ? (
          <button onClick={onSubmitQuiz} className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
            <Send size={16} /> Nộp bài thi
          </button>
        ) : (
          <button onClick={onResetQuiz} className="btn btn-secondary" style={{ justifyContent: 'center', padding: '12px' }}>
            <RotateCcw size={16} /> Làm lại bài thi
          </button>
        )}
      </div>
    </aside>
  );
};
