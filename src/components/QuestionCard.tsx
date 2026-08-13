import React from 'react';
import { Question, Answer } from '../types';
import { Bookmark, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswers: number[];
  onSelectAnswer: (answerId: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  showExplanation: boolean;
  isSubmitted: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswers,
  onSelectAnswer,
  isBookmarked,
  onToggleBookmark,
  showExplanation,
  isSubmitted,
}) => {
  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            padding: '4px 12px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: 14
          }}>
            Câu {currentIndex + 1} / {totalQuestions}
          </span>
          <span style={{
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            fontWeight: 600
          }}>
            {question.type === 'SINGLE' ? 'Một đáp án' : 'Nhiều đáp án'}
          </span>
        </div>

        <button
          onClick={onToggleBookmark}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: isBookmarked ? 'var(--warning)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          <Bookmark size={18} fill={isBookmarked ? 'var(--warning)' : 'none'} />
          {isBookmarked ? 'Đã đánh dấu' : 'Đánh dấu'}
        </button>
      </div>

      {/* Question Title / Content */}
      <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, color: 'var(--text-main)' }}>
        {question.name}
      </div>

      {/* Answers Options */}
      <div className="options-list">
        {question.answers.map((answer: Answer, idx: number) => {
          const isSelected = selectedAnswers.includes(answer.id);
          const isCorrect = answer.is_correct;

          let optionStyleClass = '';
          if (showExplanation || isSubmitted) {
            if (isCorrect) {
              optionStyleClass = 'correct-reveal';
            } else if (isSelected && !isCorrect) {
              optionStyleClass = 'incorrect-reveal';
            }
          } else if (isSelected) {
            optionStyleClass = 'selected';
          }

          return (
            <div
              key={answer.id}
              className={`option-item ${optionStyleClass}`}
              onClick={() => onSelectAnswer(answer.id)}
            >
              <div className="option-badge">
                {getOptionLetter(idx)}
              </div>
              <div style={{ flex: 1 }}>{answer.option}</div>
              {(showExplanation || isSubmitted) && isCorrect && (
                <CheckCircle2 size={20} color="var(--success)" />
              )}
              {(showExplanation || isSubmitted) && isSelected && !isCorrect && (
                <XCircle size={20} color="var(--danger)" />
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation Section */}
      {(showExplanation || isSubmitted) && question.reason && (
        <div style={{
          marginTop: 12,
          padding: 16,
          background: 'var(--primary-light)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '4px solid var(--primary)',
          fontSize: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
            <HelpCircle size={16} /> Giải thích / Hướng dẫn:
          </div>
          <div style={{ color: 'var(--text-main)' }}>{question.reason}</div>
        </div>
      )}
    </div>
  );
};
