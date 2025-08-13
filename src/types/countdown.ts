export interface CountdownEvent {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  category: 'birthday' | 'holiday' | 'work' | 'personal' | 'travel';
  icon?: string;
  createdAt: Date;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}