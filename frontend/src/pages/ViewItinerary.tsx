import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getDestination, getActivity } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Edit, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import ItineraryMap from '@/components/ItineraryMap';

export default function ViewItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { itineraries } = useStore();
  const itinerary = itineraries.find(it => it.id === id);
  const [exportOpen, setExportOpen] = useState(false);
  const [openDays, setOpenDays] = useState<number[]>([1]);

  if (!itinerary) return <AppLayout><div className="p-12 text-center text-muted-foreground">Itinerary not found.</div></AppLayout>;

  const dest = getDestination(itinerary.destinationId);
  const totalActivities = itinerary.days.reduce((sum, d) => sum + d.activityIds.length, 0);

  const toggleDay = (dayNum: number) => {
    setOpenDays(prev => prev.includes(dayNum) ? prev.filter(d => d !== dayNum) : [...prev, dayNum]);
  };

  const exportText = itinerary.days.map(day => {
    const acts = day.activityIds.map(aid => getActivity(aid)).filter(Boolean);
    return `Day ${day.dayNumber} — ${day.date}\n${acts.map(a => `  • ${a!.name} (${a!.shift}, ${a!.duration})`).join('\n') || '  No activities'}`;
  }).join('\n\n');

  return (
    <AppLayout>
      <PageTransition>
        {/* Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={dest?.image} alt={dest?.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{dest?.name}</h1>
            <p className="font-body text-sm text-muted-foreground">{dest?.country}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm font-body">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{itinerary.days.length} days</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-body">
              <Clock className="h-4 w-4 text-primary" />
              <span>{totalActivities} activities</span>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" onClick={() => navigate(`/itinerary/${id}/edit`)} className="rounded-full text-sm">
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="ghost" onClick={() => setExportOpen(true)} className="rounded-full text-sm">
                <FileText className="h-4 w-4 mr-1" /> Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="bg-surface rounded-full p-1 mb-8">
              <TabsTrigger value="list" className="rounded-full text-sm font-body">List View</TabsTrigger>
              <TabsTrigger value="map" className="rounded-full text-sm font-body">Map View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {itinerary.days.map(day => {
                const acts = day.activityIds.map(aid => getActivity(aid)).filter(Boolean);
                const isOpen = openDays.includes(day.dayNumber);
                return (
                  <div key={day.dayNumber} className="rounded-lg bg-surface overflow-hidden">
                    <button
                      onClick={() => toggleDay(day.dayNumber)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div>
                        <span className="font-display text-lg font-semibold">Day {day.dayNumber}</span>
                        <span className="font-body text-xs text-muted-foreground ml-3">{day.date} · {acts.length} activities</span>
                      </div>
                      <Link
                        to={`/itinerary/${id}/day/${day.dayNumber}`}
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-primary font-body hover:underline"
                      >
                        Full preview →
                      </Link>
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-5 pb-5 space-y-3"
                      >
                        {acts.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No activities planned.</p>
                        ) : acts.map(act => act && (
                          <Link
                            key={act.id}
                            to={`/activity/${act.id}`}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-card transition-colors"
                          >
                            <img src={act.images[0]} alt={act.name} className="w-12 h-12 rounded-md object-cover" />
                            <div>
                              <span className="font-body text-sm font-medium">{act.name}</span>
                              <div className="flex gap-2 mt-0.5">
                                <Badge variant="secondary" className="text-xs rounded-full">{act.category}</Badge>
                                <span className="text-xs text-muted-foreground">{act.shift} · {act.duration}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="map">
              <ItineraryMap days={itinerary.days} destinationName={dest?.name} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Export Modal */}
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Export Itinerary</DialogTitle>
            </DialogHeader>
            <pre className="text-xs font-body whitespace-pre-wrap bg-surface rounded-lg p-4 max-h-96 overflow-y-auto">
              {`${dest?.name}, ${dest?.country}\n${itinerary.departureDate} to ${itinerary.returnDate}\n\n${exportText}`}
            </pre>
            <Button
              onClick={() => { navigator.clipboard.writeText(exportText); toast.success('Copied to clipboard!'); }}
              className="rounded-full bg-primary text-primary-foreground"
            >
              Copy to Clipboard
            </Button>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
