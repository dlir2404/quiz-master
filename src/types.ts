export interface Answer {
  id: number;
  option: string;
  is_correct: boolean;
}

export interface Question {
  uuid: string;
  section_id: string;
  id: number;
  name: string;
  type: 'SINGLE' | 'MULTIPLE' | string;
  parent_id: number;
  reason?: string | null;
  sort_order: number;
  answers: Answer[];
  files?: any;
  children_questions?: Question[];
}

export interface Section {
  uuid: string;
  id: number;
  exam_id: number;
  name: string;
  description: string | null;
  total_question: number;
  total_question_queue: number;
  is_active: boolean;
  questions: Question[];
}

export interface QuizApiResponse {
  data: Section[];
}

export type QuizMode = 'practice' | 'exam' | 'review';

export interface UserAnswers {
  [questionId: number]: number[]; // array of selected answer IDs
}
