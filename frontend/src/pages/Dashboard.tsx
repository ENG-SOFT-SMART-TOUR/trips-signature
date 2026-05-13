import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Map, BookOpen, Heart, ArrowRight, Compass, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import { destinoApi } from '@/services/api';
import type { Destino } from '@/types/index';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay: number;
}

function StatCard({ icon, value, label, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl bg-surface p-6 group hover-lift"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, itineraries, diaries } = useStore();
  const navigate = useNavigate();

  const [savedDestinos, setSavedDestinos] = useState<Destino[]>([]);

  useEffect(() => {
    if (!user) return;
    destinoApi.listarSalvos(user.id)
      .then(res => setSavedDestinos(res.data))
      .catch(() => {});
  }, [user]);

  const totalDays = itineraries.reduce((sum, it) => sum + it.days.length, 0);
  const totalEntries = diaries.reduce((sum, d) => sum + d.entries.length, 0);

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Welcome back</span>
            <h1 className="font-display text-4xl font-semibold">{user?.name || 'Traveler'}</h1>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            <StatCard icon={<Heart className="h-5 w-5 text-primary" />} value={savedDestinos.length} label="Saved Destinations" delay={0.1} />
            <StatCard icon={<Map className="h-5 w-5 text-primary" />} value={itineraries.length} label="Itineraries" delay={0.2} />
            <StatCard icon={<Calendar className="h-5 w-5 text-primary" />} value={totalDays} label="Days Planned" delay={0.3} />
            <StatCard icon={<BookOpen className="h-5 w-5 text-primary" />} value={totalEntries} label="Diary Entries" delay={0.4} />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14"
          >
            <button
              onClick={() => navigate('/matches')}
              className="group rounded-xl bg-primary/5 p-6 text-left transition-all duration-300 hover:bg-primary/10 hover-lift"
            >
              <Compass className="h-6 w-6 text-primary mb-3 transition-transform duration-300 group-hover:rotate-45" />
              <h3 className="font-display text-lg font-semibold mb-1">Explore Matches</h3>
              <p className="font-body text-xs text-muted-foreground">Discover destinations tailored to your style</p>
            </button>
            <button
              onClick={() => navigate('/itinerary/new')}
              className="group rounded-xl bg-primary/5 p-6 text-left transition-all duration-300 hover:bg-primary/10 hover-lift"
            >
              <Map className="h-6 w-6 text-primary mb-3 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="font-display text-lg font-semibold mb-1">Plan a Trip</h3>
              <p className="font-body text-xs text-muted-foreground">Create a new itinerary for your next adventure</p>
            </button>
            <button
              onClick={() => navigate('/itineraries')}
              className="group rounded-xl bg-primary/5 p-6 text-left transition-all duration-300 hover:bg-primary/10 hover-lift"
            >
              <TrendingUp className="h-6 w-6 text-primary mb-3 transition-transform duration-300 group-hover:translate-y-[-2px]" />
              <h3 className="font-display text-lg font-semibold mb-1">My Trips</h3>
              <p className="font-body text-xs text-muted-foreground">View your itineraries and diaries</p>
            </button>
          </motion.div>

          {/* Saved Destinations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold">Saved Destinations</h2>
              <Link to="/matches" className="text-sm text-primary font-body hover:underline flex items-center gap-1">
                Explore more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {savedDestinos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-surface p-10 text-center"
              >
                <Heart className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold mb-1">No saved destinations yet</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">Explore our curated matches and save the ones that speak to you.</p>
                <Button onClick={() => navigate('/matches')} className="rounded-full">
                  Find Destinations
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDestinos.map((dest, i) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                    className="group hover-lift"
                  >
                    <div className="relative overflow-hidden rounded-xl aspect-[3/2]">
                      <img
                        src={dest.foto}
                        alt={dest.nome}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-display text-lg font-semibold text-primary-foreground">{dest.nome}</h3>
                        <p className="font-body text-xs text-primary-foreground/80">{dest.pais}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate('/itinerary/new')}
                      variant="ghost"
                      className="rounded-full mt-3 text-sm w-full hover:bg-primary/10 hover:text-primary"
                    >
                      Plan Trip <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
