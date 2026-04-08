import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getActivity, getDestination } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function DayPreview() {
  const { id, dayNumber } = useParams<{ id: string; dayNumber: string }>();
  const navigate = useNavigate();
  const { itineraries } = useStore();
  const itinerary = itineraries.find(it => it.id === id);
  const dayNum = parseInt(dayNumber || '1');

  if (!itinerary) return <AppLayout><div className="p-12 text-center text-muted-foreground">Not found.</div></AppLayout>;

  const day = itinerary.days.find(d => d.dayNumber === dayNum);
  const dest = getDestination(itinerary.destinationId);
  const acts = day?.activityIds.map(aid => getActivity(aid)).filter(Boolean) || [];
  const hasPrev = dayNum > 1;
  const hasNext = dayNum < itinerary.days.length;

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/itinerary/${id}`)} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="font-display text-2xl font-semibold">Day {dayNum}</h1>
              <p className="font-body text-xs text-muted-foreground">{day?.date} · {dest?.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            {acts.map((act, i) => act && (
              <div key={act.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/activity/${act.id}`} className="block group hover-lift">
                    <div className="rounded-lg overflow-hidden bg-surface">
                      <img src={act.images[0]} alt={act.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="rounded-full text-xs">{act.category}</Badge>
                          <span className="text-xs text-muted-foreground capitalize">{act.shift}</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold mb-1">{act.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {act.duration}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                {i < acts.length - 1 && (
                  <div className="flex items-center justify-center py-3">
                    <div className="h-6 w-px bg-border" />
                    <span className="mx-3 text-xs text-muted-foreground font-body">~15 min travel</span>
                    <div className="h-6 w-px bg-border" />
                  </div>
                )}
              </div>
            ))}
            {acts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm font-body">
                No activities planned for this day.
              </div>
            )}
          </div>

          <div className="flex justify-between mt-10">
            <Button
              variant="ghost"
              disabled={!hasPrev}
              onClick={() => navigate(`/itinerary/${id}/day/${dayNum - 1}`)}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Day {dayNum - 1}
            </Button>
            <Button
              variant="ghost"
              disabled={!hasNext}
              onClick={() => navigate(`/itinerary/${id}/day/${dayNum + 1}`)}
              className="rounded-full"
            >
              Day {dayNum + 1} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
