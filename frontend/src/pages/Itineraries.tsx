import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Plus, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import { roteiroApi } from '@/services/api';
import type { Roteiro } from '@/types/index';

export default function Itineraries() {
  const { user } = useStore();
  const navigate = useNavigate();

  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    roteiroApi.listarPorUsuario(user.id)
      .then(res => setRoteiros(res.data))
      .catch(() => toast.error('Erro ao carregar roteiros'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDeletar = async (roteiro: Roteiro) => {
    if (!user || !confirm('Excluir este roteiro?')) return;
    try {
      await roteiroApi.deletar(roteiro.id, user.id);
      setRoteiros(prev => prev.filter(r => r.id !== roteiro.id));
      toast('Roteiro excluído');
    } catch {
      toast.error('Erro ao deletar roteiro');
    }
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Suas viagens</span>
              <h1 className="font-display text-4xl font-semibold">Meus Roteiros</h1>
            </div>
            <Button
              onClick={() => navigate('/itinerary/new')}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Novo Roteiro
            </Button>
          </div>

          {loading ? (
            <p className="font-body text-sm text-muted-foreground">Carregando roteiros...</p>
          ) : roteiros.length === 0 ? (
            <EmptyState
              icon={Map}
              title="Nenhum roteiro ainda"
              description="Crie seu primeiro roteiro e comece a planejar a viagem dos seus sonhos."
              actionLabel="Criar Roteiro"
              actionTo="/itinerary/new"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roteiros.map((roteiro, i) => (
                <motion.div
                  key={roteiro.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link to={`/itinerary/${roteiro.id}`} className="group hover-lift block">
                    <div className="rounded-xl bg-surface p-6 transition-all duration-300 group-hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Map className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs text-muted-foreground bg-background px-3 py-1 rounded-full">
                            {roteiro.totalDias} {roteiro.totalDias === 1 ? 'dia' : 'dias'}
                          </span>
                          <button
                            onClick={(e) => { e.preventDefault(); handleDeletar(roteiro); }}
                            className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-1">{roteiro.destino.nome}</h3>
                      <p className="font-body text-xs text-muted-foreground mb-1">{roteiro.destino.pais}</p>
                      <p className="font-body text-xs text-muted-foreground mb-4 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {roteiro.dataIda} → {roteiro.dataVolta}
                      </p>
                      <span className="font-body text-xs text-primary group-hover:underline flex items-center gap-1">
                        Ver roteiro <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
