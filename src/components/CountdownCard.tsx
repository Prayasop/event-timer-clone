import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { CountdownEvent } from '@/types/countdown';
import { useCountdown } from '@/hooks/useCountdown';
import { CircularProgress } from './CircularProgress';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface CountdownCardProps {
  event: CountdownEvent;
  onEdit: (event: CountdownEvent) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  birthday: '🎂',
  holiday: '🎉',
  work: '💼',
  personal: '⭐',
  travel: '✈️'
};

export const CountdownCard: React.FC<CountdownCardProps> = ({
  event,
  onEdit,
  onDelete
}) => {
  const timeRemaining = useCountdown(event.targetDate);
  
  // Calculate progress (percentage of time passed)
  const totalDays = Math.ceil((event.targetDate.getTime() - event.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = timeRemaining.days;
  const progress = totalDays > 0 ? Math.max(0, ((totalDays - remainingDays) / totalDays) * 100) : 0;

  const formatTimeUnit = (value: number, unit: string) => (
    <div className="text-center">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{unit}</div>
    </div>
  );

  return (
    <div className="countdown-card rounded-xl p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[event.category]}</span>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(event)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(event.id)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {timeRemaining.isExpired ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive mb-1">Expired!</div>
              <div className="text-sm text-muted-foreground">
                Event was {formatDistanceToNow(event.targetDate)} ago
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {formatTimeUnit(timeRemaining.days, 'days')}
              {formatTimeUnit(timeRemaining.hours, 'hrs')}
              {formatTimeUnit(timeRemaining.minutes, 'min')}
              {formatTimeUnit(timeRemaining.seconds, 'sec')}
            </div>
          )}
        </div>

        <div className="ml-6">
          <CircularProgress
            progress={timeRemaining.isExpired ? 100 : progress}
            size={100}
            strokeWidth={6}
            color={event.category}
          >
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">
                {timeRemaining.isExpired ? '0' : timeRemaining.days}
              </div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
          </CircularProgress>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{event.targetDate.toLocaleDateString()}</span>
        </div>
        <div className="px-2 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-medium capitalize">
          {event.category}
        </div>
      </div>
    </div>
  );
};