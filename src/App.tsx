import React, { useState, useEffect } from 'react';
import { Section, Question, QuizMode, UserAnswers } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuestionCard } from './components/QuestionCard';
import { ResultModal } from './components/ResultModal';
import { ArrowLeft, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Persistence Keys
  const STORAGE_KEY_ANSWERS = 'quiz_master_user_answers';
  const STORAGE_KEY_BOOKMARKS = 'quiz_master_bookmarks';
  const STORAGE_KEY_SECTION = 'quiz_master_section_index';
  const STORAGE_KEY_QUESTION = 'quiz_master_question_index';
  const STORAGE_KEY_TIMER = 'quiz_master_timer';
  const STORAGE_KEY_SUBMITTED = 'quiz_master_is_submitted';

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SECTION);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_QUESTION);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [userAnswers, setUserAnswers] = useState<UserAnswers>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
    return saved ? JSON.parse(saved) : {};
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TIMER);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUBMITTED);
    return saved === 'true';
  });

  const [mode, setMode] = useState<QuizMode>('practice');
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Auto save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SECTION, activeSectionIndex.toString());
  }, [activeSectionIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUESTION, currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIMER, timerSeconds.toString());
  }, [timerSeconds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUBMITTED, isSubmitted.toString());
  }, [isSubmitted]);

  // Fetch quiz data with 7-day localStorage cache
  useEffect(() => {
    const CACHE_KEY_DATA = 'quiz_master_cached_data';
    const CACHE_KEY_TIME = 'quiz_master_cached_time';
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    const cachedData = localStorage.getItem(CACHE_KEY_DATA);
    const cachedTime = localStorage.getItem(CACHE_KEY_TIME);
    const now = Date.now();

    if (cachedData && cachedTime && (now - parseInt(cachedTime, 10)) < SEVEN_DAYS_MS) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed && Array.isArray(parsed)) {
          setSections(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached quiz data', e);
      }
    }

    // Fetch from API or public json file if cache is expired or missing
    fetch('/quiz_data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu bài thi');
        return res.json();
      })
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setSections(data.data);
          localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(data.data));
          localStorage.setItem(CACHE_KEY_TIME, now.toString());
        } else {
          throw new Error('Định dạng dữ liệu không hợp lệ');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Lỗi khi tải bài thi');
        setLoading(false);
      });
  }, []);

  // Timer tick
  useEffect(() => {
    if (loading || isSubmitted) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, isSubmitted]);

  const activeSection = sections[activeSectionIndex];
  const questions = activeSection ? activeSection.questions : [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (answerId: number) => {
    if (isSubmitted) return; // Locked when submitted

    if (!currentQuestion) return;

    setUserAnswers((prev) => {
      const qId = currentQuestion.id;
      const currentSelected = prev[qId] || [];

      if (currentQuestion.type === 'SINGLE') {
        return { ...prev, [qId]: [answerId] };
      } else {
        // MULTIPLE
        if (currentSelected.includes(answerId)) {
          return { ...prev, [qId]: currentSelected.filter((id) => id !== answerId) };
        } else {
          return { ...prev, [qId]: [...currentSelected, answerId] };
        }
      }
    });
  };

  const handleToggleBookmark = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    setBookmarks((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowResultModal(true);

    // Trigger confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setBookmarks([]);
    setIsSubmitted(false);
    setShowResultModal(false);
    setTimerSeconds(0);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);

    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
    localStorage.removeItem(STORAGE_KEY_SECTION);
    localStorage.removeItem(STORAGE_KEY_QUESTION);
    localStorage.removeItem(STORAGE_KEY_TIMER);
    localStorage.removeItem(STORAGE_KEY_SUBMITTED);
  };

  // Calculate statistics
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  if (questions.length > 0) {
    questions.forEach((q) => {
      const selected = userAnswers[q.id] || [];
      if (selected.length === 0) {
        unansweredCount++;
      } else {
        const correctIds = q.answers.filter((a) => a.is_correct).map((a) => a.id);
        const isCorrect =
          selected.length === correctIds.length &&
          selected.every((id) => correctIds.includes(id));
        if (isCorrect) correctCount++;
        else incorrectCount++;
      }
    });
  }

  const score = questions.length > 0 ? Number(((correctCount / questions.length) * 10).toFixed(1)) : 0;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <RefreshCw size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Đang tải bài thi Quiz...</div>
        </div>
      </div>
    );
  }

  if (error || !sections.length) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: 12 }}>Lỗi tải dữ liệu</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{error || 'Không tìm thấy dữ liệu bài thi.'}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ margin: '0 auto' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        examTitle={activeSection ? activeSection.name : 'Bài Quiz'}
        activeSectionName={activeSection ? activeSection.name : ''}
        totalQuestions={questions.length}
        completedCount={Object.keys(userAnswers).length}
        mode={mode}
        setMode={setMode}
        timerSeconds={timerSeconds}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="mobile-drawer-overlay-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
          <Sidebar
            sections={sections}
            activeSectionIndex={activeSectionIndex}
            onSelectSection={(idx) => {
              setActiveSectionIndex(idx);
              setCurrentQuestionIndex(0);
              setShowExplanation(false);
              setIsSidebarOpen(false);
            }}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onSelectQuestion={(idx) => {
              setCurrentQuestionIndex(idx);
              setShowExplanation(false);
              setIsSidebarOpen(false);
            }}
            userAnswers={userAnswers}
            bookmarks={bookmarks}
            onSubmitQuiz={handleSubmitQuiz}
            onResetQuiz={handleResetQuiz}
            isSubmitted={isSubmitted}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <section className="quiz-workspace">
          {currentQuestion ? (
            <>
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedAnswers={userAnswers[currentQuestion.id] || []}
                onSelectAnswer={handleSelectAnswer}
                isBookmarked={bookmarks.includes(currentQuestion.id)}
                onToggleBookmark={handleToggleBookmark}
                showExplanation={
                  isSubmitted ||
                  showExplanation ||
                  (mode === 'practice' && (userAnswers[currentQuestion.id] || []).length > 0)
                }
                isSubmitted={isSubmitted}
              />

              {/* Action Toolbar Desktop */}
              <div className="desktop-only-toolbar" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-surface)',
                padding: '16px 24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-secondary"
                  style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                >
                  <ArrowLeft size={16} /> Câu trước
                </button>

                {mode === 'practice' && !isSubmitted && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="btn btn-outline"
                  >
                    <Eye size={16} /> {showExplanation ? 'Ẩn đáp án' : 'Xem đáp án'}
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="btn btn-primary"
                  style={{ opacity: currentQuestionIndex === questions.length - 1 ? 0.5 : 1 }}
                >
                  Câu tiếp <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              Chưa chọn câu hỏi nào.
            </div>
          )}
        </section>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="mobile-bottom-bar">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary mobile-bottom-btn"
          style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowLeft size={16} /> Trước
        </button>

        {mode === 'practice' && !isSubmitted && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="btn btn-outline mobile-bottom-btn"
            style={{ padding: '0 8px' }}
          >
            <Eye size={16} /> {showExplanation ? 'Ẩn' : 'Giải thích'}
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className="btn btn-primary mobile-bottom-btn"
          style={{ opacity: currentQuestionIndex === questions.length - 1 ? 0.5 : 1 }}
        >
          Sau <ArrowRight size={16} />
        </button>
      </div>

      {showResultModal && (
        <ResultModal
          score={score}
          totalQuestions={questions.length}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          unansweredCount={unansweredCount}
          timeSpentSeconds={timerSeconds}
          onReview={() => setShowResultModal(false)}
          onRestart={handleResetQuiz}
        />
      )}
    </div>
  );
};
