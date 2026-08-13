import React from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, BarChart2 } from 'lucide-react';

interface ResultModalProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  onReview: () => void;
  onRestart: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  score,
  totalQuestions,
  correctCount,
  incorrectCount,
  unansweredCount,
  timeSpentSeconds,
  onReview,
  onRestart,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} phút ${s} giây`;
  };

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }}>
      <div className="card" style={{
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        animation: 'fadeIn 0.3s ease'
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: percentage >= 70 ? 'var(--success-bg)' : 'var(--warning-bg)',
          color: percentage >= 70 ? 'var(--success)' : 'var(--warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <Award size={40} />
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
          {percentage >= 80 ? 'Xuất sắc 🎉' : percentage >= 50 ? 'Hoàn thành tốt 👍' : 'Cố gắng hơn nhé 💪'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
          Bạn đã hoàn thành bài thi. Dưới đây là kết quả chi tiết:
        </p>

        {/* Score display */}
        <div style={{
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: 24
        }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)' }}>
            {score} / 10 <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>({percentage}%)</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Thời gian hoàn thành: {formatTime(timeSpentSeconds)}
          </div>
        </div>

        {/* Stats breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
            <div style={{ color: 'var(--success)', fontWeight: 800, fontSize: 20 }}>{correctCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Câu đúng</div>
          </div>
          <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}>
            <div style={{ color: 'var(--danger)', fontWeight: 800, fontSize: 20 }}>{incorrectCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Câu sai</div>
          </div>
          <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: 20 }}>{unansweredCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Bỏ qua</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onReview} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <BarChart2 size={16} /> Xem lại đáp án
          </button>
          <button onClick={onRestart} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <RotateCcw size={16} /> Thi lại
          </button>
        </div>
      </div>
    </div>
  );
};
