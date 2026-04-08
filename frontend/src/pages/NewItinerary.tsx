import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { destinations, getDestination } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function NewItinerary() {
  const navigate = useNavigate();
  const { savedDestinations, addItinerary, addDiary } = useStore();
  const [destId, setDestId] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const saved = savedDestinations.map(id => destinations.find(d => d.id === id)).filter(Boolean);
  const allDests = saved.length > 0 ? saved : destinations;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!destId) e.destId = 'Select a destination';
    if (!departure) e.departure = 'Select departure date';
    if (!returnDate) e.returnDate = 'Select return date';
    const today = new Date().toISOString().split('T')[0];
    if (departure && departure < today) e.departure = 'Departure must be in the future';
    if (departure && returnDate && returnDate <= departure) e.returnDate = 'Return must be after departure';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const dep = new Date(departure);
    const ret = new Date(returnDate);
    const dayCount = Math.ceil((ret.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const days = Array.from({ length: dayCount }, (_, i) => {
      const date = new Date(dep);
      date.setDate(date.getDate() + i);
      return {
        dayNumber: i + 1,
        date: date.toISOString().split('T')[0],
        activityIds: [],
      };
    });

    const id = `it-${Date.now()}`;
    addItinerary({ id, destinationId: destId, departureDate: departure, returnDate, days, createdAt: new Date().toISOString() });

    const diaryId = `di-${Date.now()}`;
    addDiary({
      id: diaryId,
      destinationId: destId,
      itineraryId: id,
      isPublic: false,
      shareToken: Math.random().toString(36).substring(2, 10),
      entries: [],
      createdAt: new Date().toISOString(),
    });

    toast.success('Itinerary created! Start adding activities.');
    navigate(`/itinerary/${id}/edit`);
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-lg mx-auto px-4 py-12">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">New trip</span>
          <h1 className="font-display text-3xl font-semibold mb-8">Create Itinerary</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-medium">Destination</Label>
              <div className="grid grid-cols-2 gap-3">
                {allDests.map(d => d && (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDestId(d.id)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 ${
                      destId === d.id ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface/80'
                    }`}
                  >
                    <span className="font-body text-sm font-medium block">{d.name}</span>
                    <span className="font-body text-xs opacity-70">{d.country}</span>
                  </button>
                ))}
              </div>
              {errors.destId && <p className="text-xs text-destructive">{errors.destId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-body text-sm font-medium">Departure</Label>
                <Input
                  type="date"
                  value={departure}
                  onChange={e => setDeparture(e.target.value)}
                  className="bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
                />
                {errors.departure && <p className="text-xs text-destructive">{errors.departure}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-sm font-medium">Return</Label>
                <Input
                  type="date"
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  className="bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
                />
                {errors.returnDate && <p className="text-xs text-destructive">{errors.returnDate}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              Create Itinerary
            </Button>
          </form>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
