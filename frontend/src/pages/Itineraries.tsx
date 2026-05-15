import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';
import ItemCard from '@/components/ItemCard';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
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
              <PageHeader label="Suas viagens" title="Meus Roteiros" />
            </div>
            <Button
              onClick={() => navigate('/itinerary/new')}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Novo Roteiro
            </Button>
          </div>

          {loading ? (
            <LoadingState message="Carregando roteiros..." />
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
                <ItemCard
                  key={roteiro.id}
                  to={`/itinerary/${roteiro.id}`}
                  icon={Map}
                  title={roteiro.destino.nome}
                  badge={`${roteiro.totalDias} ${roteiro.totalDias === 1 ? 'dia' : 'dias'}`}
                  subtitle={
                    <>
                      <span className="block mb-1">{roteiro.destino.pais}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {roteiro.dataIda} → {roteiro.dataVolta}
                      </span>
                    </>
                  }
                  footerLabel="Ver roteiro"
                  onDelete={() => handleDeletar(roteiro)}
                  deleteAriaLabel="Excluir roteiro"
                  delay={i * 0.08}
                />
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
