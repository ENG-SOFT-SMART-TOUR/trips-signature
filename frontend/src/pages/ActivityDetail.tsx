import { useParams } from 'react-router-dom';
import { getActivity } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Lightbulb, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getDestination } from '@/data/mockData';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const activity = getActivity(id || '');
  const { itineraries, updateItinerary } = useStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedIt, setSelectedIt] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);

  if (!activity) return <AppLayout><div className="p-12 text-center text-muted-foreground">Activity not found.</div></AppLayout>;

  const handleAdd = () => {
    const it = itineraries.find(i => i.id === selectedIt);
    if (!it) return;
    const day = it.days[selectedDay];
    if (day.activityIds.length >= 5) {
      toast.error('Day is full (max 5 activities)');
      return;
    }
    if (day.activityIds.includes(activity.id)) {
      toast.error('Activity already added to this day');
      return;
    }
    const newDays = it.days.map((d, i) =>
      i === selectedDay ? { ...d, activityIds: [...d.activityIds, activity.id] } : d
    );
    updateItinerary(it.id, newDays);
    toast.success(`Added to Day ${day.dayNumber}`);
    setAddOpen(false);
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Gallery */}
          <div className="relative rounded-lg overflow-hidden aspect-[16/9] mb-8">
            <img
              src={activity.images[imgIdx]}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
            {activity.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + activity.images.length) % activity.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % activity.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {activity.images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-primary-foreground' : 'bg-primary-foreground/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge variant="secondary" className="rounded-full">{activity.category}</Badge>
                <Badge variant="outline" className="rounded-full capitalize">{activity.shift}</Badge>
              </div>
              <h1 className="font-display text-3xl font-semibold mb-1">{activity.name}</h1>
            </div>
            <Button onClick={() => setAddOpen(true)} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-1" /> Add to Itinerary
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm font-body bg-surface rounded-lg p-4">
              <Clock className="h-4 w-4 text-primary" /> {activity.duration}
            </div>
            <div className="flex items-center gap-2 text-sm font-body bg-surface rounded-lg p-4">
              <MapPin className="h-4 w-4 text-primary" /> {activity.address}
            </div>
            <div className="flex items-center gap-2 text-sm font-body bg-surface rounded-lg p-4">
              <Lightbulb className="h-4 w-4 text-highlight" /> {activity.tips}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="font-body text-base text-foreground leading-relaxed">{activity.description}</p>
          </div>
        </div>

        {/* Add Modal */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add to Itinerary</DialogTitle>
            </DialogHeader>
            {itineraries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No itineraries yet. Create one first.</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">Select Itinerary</label>
                  <div className="space-y-1">
                    {itineraries.map(it => {
                      const d = getDestination(it.destinationId);
                      return (
                        <button
                          key={it.id}
                          onClick={() => { setSelectedIt(it.id); setSelectedDay(0); }}
                          className={`w-full text-left p-3 rounded-lg text-sm font-body transition-colors ${
                            selectedIt === it.id ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface/80'
                          }`}
                        >
                          {d?.name} · {it.days.length} days
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedIt && (
                  <div className="space-y-2">
                    <label className="font-body text-sm font-medium">Select Day</label>
                    <div className="grid grid-cols-4 gap-2">
                      {itineraries.find(i => i.id === selectedIt)?.days.map((day, i) => (
                        <button
                          key={day.dayNumber}
                          onClick={() => setSelectedDay(i)}
                          className={`p-2 rounded-lg text-xs font-body text-center transition-colors ${
                            i === selectedDay ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface/80'
                          }`}
                        >
                          Day {day.dayNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={handleAdd} disabled={!selectedIt} className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Add Activity
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
