import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getActivity, getDestinationActivities } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function NewDiaryEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { diaries, itineraries, addDiaryEntry } = useStore();
  const diary = diaries.find(d => d.id === id);

  const fileRef = useRef<HTMLInputElement>(null);
  const [dayNumber, setDayNumber] = useState(1);
  const [activityId, setActivityId] = useState('');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!diary) return <AppLayout><div className="p-12 text-center text-muted-foreground">Diary not found.</div></AppLayout>;

  const itinerary = itineraries.find(i => i.id === diary.itineraryId);
  const dayActivities = itinerary?.days.find(d => d.dayNumber === dayNumber)?.activityIds.map(aid => getActivity(aid)).filter(Boolean) || [];
  const allActivities = getDestinationActivities(diary.destinationId);
  const availableActivities = dayActivities.length > 0 ? dayActivities : allActivities;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!activityId) e.activityId = 'Select an activity';
    if (text.trim().length < 10) e.text = 'Write at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    addDiaryEntry({
      id: `de-${Date.now()}`,
      diaryId: diary.id,
      dayNumber,
      activityId,
      text: text.trim(),
      photo: photo || undefined,
      timestamp: new Date().toISOString(),
    });
    toast.success('Entry added to your diary!');
    navigate(`/diary/${id}`);
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-lg mx-auto px-4 py-12">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">New entry</span>
          <h1 className="font-display text-3xl font-semibold mb-8">Write a Memory</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-medium">Day</Label>
              <div className="flex gap-2 flex-wrap">
                {(itinerary?.days || [{ dayNumber: 1 }]).map(day => (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => { setDayNumber(day.dayNumber); setActivityId(''); }}
                    className={`px-4 py-2 rounded-full text-xs font-body transition-colors ${
                      dayNumber === day.dayNumber ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface/80'
                    }`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-sm font-medium">Activity</Label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {availableActivities.map(act => act && (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivityId(act.id)}
                    className={`w-full text-left p-3 rounded-lg text-sm font-body transition-colors ${
                      activityId === act.id ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface/80'
                    }`}
                  >
                    {act.name}
                  </button>
                ))}
              </div>
              {errors.activityId && <p className="text-xs text-destructive">{errors.activityId}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-sm font-medium">Your Memory</Label>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write about your experience..."
                className="min-h-[120px] bg-transparent border border-border focus-visible:border-primary"
              />
              {errors.text && <p className="text-xs text-destructive">{errors.text}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-sm font-medium">Photo</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setPhoto(URL.createObjectURL(file));
                }}
              />
              {!photo ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-6 border-2 border-dashed border-border rounded-xl text-sm font-body text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Choose a photo
                </button>
              ) : (
                <div className="relative">
                  <img src={photo} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => { setPhoto(''); if (fileRef.current) fileRef.current.value = ''; }}
                    className="absolute top-2 right-2 bg-foreground/60 text-background rounded-full p-1 hover:bg-foreground/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              Save Entry
            </Button>
          </form>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
