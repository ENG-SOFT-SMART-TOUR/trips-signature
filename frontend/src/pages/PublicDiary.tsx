import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getDestination, getActivity } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Compass, Calendar, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

export default function PublicDiary() {
  const { token } = useParams<{ token: string }>();
  const { diaries } = useStore();
  const diary = diaries.find(d => d.shareToken === token && d.isPublic);

  if (!diary) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <Compass className="h-12 w-12 text-primary mb-4" />
          <h1 className="font-display text-2xl font-semibold mb-2">Diary Not Found</h1>
          <p className="text-sm text-muted-foreground font-body mb-6">This diary may be private or doesn't exist.</p>
          <Link to="/register">
            <Button className="rounded-full bg-accent text-accent-foreground">Create Your Journey</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const dest = getDestination(diary.destinationId);
  const groupedByDay = diary.entries.reduce<Record<number, typeof diary.entries>>((acc, entry) => {
    (acc[entry.dayNumber] = acc[entry.dayNumber] || []).push(entry);
    return acc;
  }, {});

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="relative h-64 overflow-hidden">
          <img src={dest?.image} alt={dest?.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="font-display text-3xl font-semibold">{dest?.name}</h1>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground font-body">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {diary.entries.length} entries</span>
              <span className="flex items-center gap-1"><Image className="h-3 w-3" /> {diary.entries.filter(e => e.photo).length} photos</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-8">
            {Object.entries(groupedByDay).sort(([a], [b]) => Number(a) - Number(b)).map(([dayNum, entries]) => (
              <div key={dayNum}>
                <h2 className="font-display text-lg font-semibold mb-4">Day {dayNum}</h2>
                <div className="space-y-4">
                  {entries.map((entry, i) => {
                    const act = getActivity(entry.activityId);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-lg bg-surface p-5"
                      >
                        {entry.photo && (
                          <img src={`https://picsum.photos/seed/${entry.photo}/600/300`} alt="" className="w-full h-40 object-cover rounded-md mb-3" />
                        )}
                        <h3 className="font-body text-sm font-medium mb-1">{act?.name || 'Activity'}</h3>
                        <p className="font-body text-sm text-foreground leading-relaxed">{entry.text}</p>
                        <p className="font-body text-xs text-muted-foreground mt-2">{new Date(entry.timestamp).toLocaleString()}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center py-12 rounded-lg bg-surface">
            <Compass className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold mb-2">Create your own journey</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">Discover personalized destinations and plan unforgettable trips.</p>
            <Link to="/register">
              <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
