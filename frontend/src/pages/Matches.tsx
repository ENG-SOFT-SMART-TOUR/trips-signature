import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import EmptyState from '@/components/EmptyState';
import { destinoApi } from '@/services/api';
import type { Destino } from '@/types/index';

function calculateMatch(userTags: string[], destTags: string[]): number {
  if (userTags.length === 0) return Math.floor(Math.random() * 30 + 60);
  const matches = destTags.filter(t => userTags.includes(t)).length;
  return Math.min(100, Math.floor((matches / Math.max(destTags.length, userTags.length)) * 100 + 30));
}

export default function Matches() {
  const { user } = useStore();
  const userTags = user?.tags || [];

  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [salvos, setSalvos] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todosRes, salvosRes] = await Promise.all([
          destinoApi.listar(),
          user ? destinoApi.listarSalvos(user.id) : Promise.resolve({ data: [] }),
        ]);

        const todos: Destino[] = todosRes.data;
        const salvosIds = new Set<number>(salvosRes.data.map((d: Destino) => d.id));

        const comMatch = todos
          .map(d => ({ ...d, matchPercentual: calculateMatch(userTags, d.tags) }))
          .sort((a, b) => (b.matchPercentual ?? 0) - (a.matchPercentual ?? 0));

        setDestinos(comMatch);
        setSalvos(salvosIds);
      } catch {
        toast.error('Erro ao carregar destinos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSalvar = async (destino: Destino) => {
    if (!user) return;
    const jaSalvo = salvos.has(destino.id);

    try {
      if (jaSalvo) {
        await destinoApi.remover(destino.id, user.id);
        setSalvos(prev => { const s = new Set(prev); s.delete(destino.id); return s; });
        toast(`${destino.nome} removido dos salvos`);
      } else {
        await destinoApi.salvar(destino.id, user.id);
        setSalvos(prev => new Set(prev).add(destino.id));
        toast(`${destino.nome} salvo na sua coleção`);
      }
    } catch {
      toast.error('Erro ao salvar destino');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <span className="font-body text-sm text-muted-foreground">Carregando destinos...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Suas combinações</span>
            <h1 className="font-display text-4xl font-semibold">Destinos para você</h1>
          </div>

          {destinos.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="Nenhum destino disponível"
              description="Ainda não há destinos cadastrados para sugerir. Volte mais tarde para descobrir novas combinações."
              actionLabel="Refazer quiz"
              actionTo="/quiz"
            />
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinos.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group hover-lift"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[3/2]">
                  <img
                    src={dest.foto}
                    alt={dest.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold font-body">
                      {dest.matchPercentual}% match
                    </span>
                  </div>
                  <button
                    onClick={() => handleSalvar(dest)}
                    className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        salvos.has(dest.id) ? 'fill-accent text-accent' : 'text-foreground'
                      }`}
                    />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-xl font-semibold text-primary-foreground">{dest.nome}</h3>
                    <p className="font-body text-xs text-primary-foreground/80">{dest.pais}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-body text-sm text-muted-foreground line-clamp-2">{dest.descricao}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {dest.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-surface text-xs font-body text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
