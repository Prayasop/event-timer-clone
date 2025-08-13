import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { CountdownEvent } from '@/types/countdown';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Omit<CountdownEvent, 'id' | 'createdAt'>) => void;
  editEvent?: CountdownEvent | null;
}

export const AddEventDialog: React.FC<AddEventDialogProps> = ({
  open,
  onOpenChange,
  onAddEvent,
  editEvent
}) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'personal' as CountdownEvent['category']
  });

  React.useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title,
        description: editEvent.description || '',
        targetDate: editEvent.targetDate.toISOString().split('T')[0],
        category: editEvent.category
      });
    } else {
      setFormData({
        title: '',
        description: '',
        targetDate: '',
        category: 'personal'
      });
    }
  }, [editEvent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetDate) return;

    onAddEvent({
      title: formData.title,
      description: formData.description,
      targetDate: new Date(formData.targetDate),
      category: formData.category
    });

    onOpenChange(false);
    setFormData({
      title: '',
      description: '',
      targetDate: '',
      category: 'personal'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">
            {editEvent ? 'Edit Event' : 'Add New Countdown'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Birthday Party, Vacation, Project Deadline"
              className="bg-secondary border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about your event..."
              className="bg-secondary border-border/50 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Target Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="bg-secondary border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: CountdownEvent['category']) => 
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-secondary border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">🎂 Birthday</SelectItem>
                <SelectItem value="holiday">🎉 Holiday</SelectItem>
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="personal">⭐ Personal</SelectItem>
                <SelectItem value="travel">✈️ Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {editEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};