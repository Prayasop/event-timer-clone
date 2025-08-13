import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountdownCard } from '@/components/CountdownCard';
import { AddEventDialog } from '@/components/AddEventDialog';
import { CountdownEvent } from '@/types/countdown';

const Index = () => {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<CountdownEvent | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('countdownEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        targetDate: new Date(event.targetDate),
        createdAt: new Date(event.createdAt)
      }));
      setEvents(parsedEvents);
    } else {
      // Add some sample events for demo
      const sampleEvents: CountdownEvent[] = [
        {
          id: '1',
          title: 'Birthday Party',
          description: 'My 25th birthday celebration',
          targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          category: 'birthday',
          createdAt: new Date()
        },
        {
          id: '2',
          title: 'Summer Vacation',
          description: 'Trip to Bali',
          targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
          category: 'travel',
          createdAt: new Date()
        },
        {
          id: '3',
          title: 'Project Launch',
          description: 'New product release',
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          category: 'work',
          createdAt: new Date()
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('countdownEvents', JSON.stringify(sampleEvents));
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('countdownEvents', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (eventData: Omit<CountdownEvent, 'id' | 'createdAt'>) => {
    if (editEvent) {
      // Update existing event
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === editEvent.id
            ? { ...eventData, id: editEvent.id, createdAt: editEvent.createdAt }
            : event
        )
      );
      setEditEvent(null);
    } else {
      // Add new event
      const newEvent: CountdownEvent = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
  };

  const handleEditEvent = (event: CountdownEvent) => {
    setEditEvent(event);
    setIsAddDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setEditEvent(null);
    }
  };

  const activeEvents = events.filter(event => new Date(event.targetDate) > new Date());
  const expiredEvents = events.filter(event => new Date(event.targetDate) <= new Date());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Countdown</h1>
                <p className="text-sm text-muted-foreground">Track your important events</p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">No Events Yet</h2>
            <p className="text-muted-foreground mb-6">Create your first countdown to get started!</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Event
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Events */}
            {activeEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Active Countdowns</h2>
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    {activeEvents.length}
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeEvents.map(event => (
                    <div key={event.id} className="group">
                      <CountdownCard
                        event={event}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Expired Events */}
            {expiredEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold text-foreground">Past Events</h2>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {expiredEvents.length}
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {expiredEvents.map(event => (
                    <div key={event.id} className="group opacity-60">
                      <CountdownCard
                        event={event}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Event Dialog */}
      <AddEventDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        onAddEvent={handleAddEvent}
        editEvent={editEvent}
      />
    </div>
  );
};

export default Index;
