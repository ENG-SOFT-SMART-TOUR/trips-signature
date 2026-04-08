import { useStore } from '@/store/useStore';
import { getDestination } from '@/data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Plus, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function Itineraries() {
  const { itineraries, deleteItinerary } = useStore();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Your trips</span>
              <h1 className="font-display text-4xl font-semibold">My Itineraries</h1>
            </div>
            <Button
              onClick={() => navigate('/itinerary/new')}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" /> New Itinerary
            </Button>
          </div>

          {itineraries.length === 0 ? (
            <EmptyState
              icon={Map}
              title="No itineraries yet"
              description="Create your first itinerary and start planning your dream trip."
              actionLabel="Create Itinerary"
              actionTo="/itinerary/new"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((it, i) => {
                const dest = getDestination(it.destinationId);
                return (
                  <motion.div
                    key={it.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Link to={`/itinerary/${it.id}`} className="group hover-lift block">
                      <div className="rounded-xl bg-surface p-6 transition-all duration-300 group-hover:shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Map className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-body text-xs text-muted-foreground bg-background px-3 py-1 rounded-full">
                              {it.days.length} days
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (confirm('Delete this itinerary?')) {
                                  deleteItinerary(it.id);
                                  toast('Itinerary deleted');
                                }
                              }}
                              className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-display text-lg font-semibold mb-1">{dest?.name || 'Unknown'}</h3>
                        <p className="font-body text-xs text-muted-foreground mb-4 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {it.departureDate} → {it.returnDate}
                        </p>
                        <span className="font-body text-xs text-primary group-hover:underline flex items-center gap-1">
                          View itinerary <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
