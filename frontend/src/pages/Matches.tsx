import { useStore } from '@/store/useStore';
import { destinations, calculateMatch } from '@/data/mockData';
import { Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function Matches() {
  const { user, savedDestinations, toggleSaveDestination } = useStore();
  const userTags = user?.tags || [];

  const sorted = [...destinations]
    .map(d => ({ ...d, match: calculateMatch(userTags, d.tags) }))
    .sort((a, b) => b.match - a.match);

  const handleSave = (id: string, name: string) => {
    toggleSaveDestination(id);
    const saving = !savedDestinations.includes(id);
    toast(saving ? `${name} saved to your collection` : `${name} removed`);
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Your matches</span>
            <h1 className="font-display text-4xl font-semibold">Destinations for you</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group hover-lift"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[3/2]">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold font-body">
                      {dest.match}% match
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); handleSave(dest.id, dest.name); }}
                    className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        savedDestinations.includes(dest.id)
                          ? 'fill-accent text-accent'
                          : 'text-foreground'
                      }`}
                    />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-xl font-semibold text-primary-foreground">{dest.name}</h3>
                    <p className="font-body text-xs text-primary-foreground/80">{dest.country}</p>
                  </div>
                </div>
                <Link to={`/matches`} className="block mt-3">
                  <p className="font-body text-sm text-muted-foreground line-clamp-2">{dest.description}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {dest.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-surface text-xs font-body text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
