import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getDestinationActivities, getActivity, getDestination } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function EditItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { itineraries, updateItinerary } = useStore();
  const itinerary = itineraries.find(it => it.id === id);
  const [selectedDay, setSelectedDay] = useState(0);

  if (!itinerary) return <AppLayout><div className="p-12 text-center text-muted-foreground">Itinerary not found.</div></AppLayout>;

  const dest = getDestination(itinerary.destinationId);
  const allActivities = getDestinationActivities(itinerary.destinationId);
  const currentDay = itinerary.days[selectedDay];
  const dayActivities = currentDay?.activityIds.map(aid => getActivity(aid)).filter(Boolean) || [];
  const allAddedIds = itinerary.days.flatMap(d => d.activityIds);

  const addActivity = (actId: string) => {
    if (currentDay.activityIds.length >= 5) {
      toast.error('Maximum 5 activities per day');
      return;
    }
    const newDays = itinerary.days.map((d, i) =>
      i === selectedDay ? { ...d, activityIds: [...d.activityIds, actId] } : d
    );
    updateItinerary(itinerary.id, newDays);
    toast.success('Activity added');
  };

  const removeActivity = (actId: string) => {
    const newDays = itinerary.days.map((d, i) =>
      i === selectedDay ? { ...d, activityIds: d.activityIds.filter(a => a !== actId) } : d
    );
    updateItinerary(itinerary.id, newDays);
    toast('Activity removed');
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary bar */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/itinerary/${id}`)} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="font-display text-2xl font-semibold">{dest?.name}</h1>
              <p className="font-body text-xs text-muted-foreground">
                {itinerary.departureDate} → {itinerary.returnDate} · {itinerary.days.length} days
              </p>
            </div>
            <Button onClick={() => navigate(`/itinerary/${id}`)} className="ml-auto rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4 mr-1" /> Done
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Day list */}
            <div className="lg:col-span-3 space-y-1">
              {itinerary.days.map((day, i) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-body text-sm transition-all ${
                    i === selectedDay ? 'bg-primary text-primary-foreground' : 'hover:bg-surface'
                  }`}
                >
                  <span className="font-medium">Day {day.dayNumber}</span>
                  <span className="block text-xs opacity-70">{day.date} · {day.activityIds.length}/5</span>
                </button>
              ))}
            </div>

            {/* Right panel */}
            <div className="lg:col-span-9">
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">
                  Day {currentDay?.dayNumber} Activities
                </h2>
                {dayActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-body">No activities yet. Add some below.</p>
                ) : (
                  <div className="space-y-3">
                    {dayActivities.map(act => act && (
                      <div key={act.id} className="flex items-center justify-between bg-surface rounded-lg p-4">
                        <div>
                          <span className="font-body text-sm font-medium">{act.name}</span>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs rounded-full">{act.category}</Badge>
                            <span className="text-xs text-muted-foreground">{act.duration} · {act.shift}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeActivity(act.id)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold mb-4">Available Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allActivities.map(act => {
                    const isAdded = currentDay?.activityIds.includes(act.id);
                    const isFull = (currentDay?.activityIds.length || 0) >= 5;
                    return (
                      <div key={act.id} className="flex items-center justify-between bg-card rounded-lg p-4">
                        <div>
                          <span className="font-body text-sm font-medium">{act.name}</span>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs rounded-full">{act.category}</Badge>
                            <span className="text-xs text-muted-foreground">{act.duration} · {act.shift}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isAdded || isFull}
                          onClick={() => addActivity(act.id)}
                          className="rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
