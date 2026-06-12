import { useState } from 'react';
import { destinations as initialDests, activities as initialActs, Destination, Activity } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function Admin() {
  const [dests, setDests] = useState<Destination[]>([...initialDests]);
  const [acts, setActs] = useState<Activity[]>([...initialActs]);
  const [destModal, setDestModal] = useState(false);
  const [actModal, setActModal] = useState(false);
  const [editDest, setEditDest] = useState<Partial<Destination>>({});
  const [editAct, setEditAct] = useState<Partial<Activity>>({});

  const saveDest = () => {
    if (!editDest.name || !editDest.description) {
      toast.error('Nome e descrição são obrigatórios');
      return;
    }
    if (editDest.id) {
      setDests(ds => ds.map(d => d.id === editDest.id ? { ...d, ...editDest } as Destination : d));
      toast.success('Destino atualizado');
    } else {
      const newDest: Destination = {
        id: `d-${Date.now()}`,
        name: editDest.name || '',
        country: '',
        description: editDest.description || '',
        tags: (editDest.tags as unknown as string)?.split(',').map(t => t.trim()) || [],
        image: `https://picsum.photos/seed/${Date.now()}/800/600`,
        latitude: editDest.latitude || 0,
        longitude: editDest.longitude || 0,
      };
      setDests(ds => [...ds, newDest]);
      toast.success('Destino adicionado');
    }
    setDestModal(false);
    setEditDest({});
  };

  const saveAct = () => {
    if (!editAct.name || !editAct.destinationId) {
      toast.error('Nome e destino são obrigatórios');
      return;
    }
    if (editAct.id) {
      setActs(as2 => as2.map(a => a.id === editAct.id ? { ...a, ...editAct } as Activity : a));
      toast.success('Atividade atualizada');
    } else {
      const newAct: Activity = {
        id: `a-${Date.now()}`,
        destinationId: editAct.destinationId || '',
        name: editAct.name || '',
        category: editAct.category || 'Sightseeing',
        duration: editAct.duration || '2h',
        shift: (editAct.shift as Activity['shift']) || 'morning',
        description: '',
        address: editAct.address || '',
        tips: '',
        images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
        latitude: 0,
        longitude: 0,
      };
      setActs(as2 => [...as2, newAct]);
      toast.success('Atividade adicionada');
    }
    setActModal(false);
    setEditAct({});
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-semibold mb-8">Painel Admin</h1>

          <Tabs defaultValue="destinations">
            <TabsList className="bg-surface rounded-full p-1 mb-8">
              <TabsTrigger value="destinations" className="rounded-full font-body text-sm">Destinos</TabsTrigger>
              <TabsTrigger value="activities" className="rounded-full font-body text-sm">Atividades</TabsTrigger>
            </TabsList>

            <TabsContent value="destinations">
              <div className="flex justify-end mb-4">
                <Button onClick={() => { setEditDest({}); setDestModal(true); }} className="rounded-full bg-accent text-accent-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Adicionar destino
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden bg-surface">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Nome</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Tags</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Lat/Lng</th>
                      <th className="text-right p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dests.map(d => (
                      <tr key={d.id} className="border-b border-border/50 last:border-0">
                        <td className="p-4">{d.name}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{d.tags.join(', ')}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{d.latitude}, {d.longitude}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" aria-label={`Editar ${d.name}`} className="rounded-full" onClick={() => { setEditDest(d); setDestModal(true); }}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label={`Excluir ${d.name}`} className="rounded-full hover:text-destructive" onClick={() => { setDests(ds => ds.filter(x => x.id !== d.id)); toast('Excluído'); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="activities">
              <div className="flex justify-end mb-4">
                <Button onClick={() => { setEditAct({}); setActModal(true); }} className="rounded-full bg-accent text-accent-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Adicionar atividade
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden bg-surface">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Nome</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Categoria</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Duração</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Turno</th>
                      <th className="text-right p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acts.slice(0, 20).map(a => (
                      <tr key={a.id} className="border-b border-border/50 last:border-0">
                        <td className="p-4">{a.name}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{a.category}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{a.duration}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground capitalize">{a.shift}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" aria-label={`Editar ${a.name}`} className="rounded-full" onClick={() => { setEditAct(a); setActModal(true); }}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label={`Excluir ${a.name}`} className="rounded-full hover:text-destructive" onClick={() => { setActs(as2 => as2.filter(x => x.id !== a.id)); toast('Excluído'); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Destination Modal */}
        <Dialog open={destModal} onOpenChange={setDestModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editDest.id ? 'Editar' : 'Adicionar'} destino</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {[
                { field: 'name', label: 'Nome' },
                { field: 'description', label: 'Descrição' },
              ].map(({ field, label }) => (
                <div key={field} className="space-y-1">
                  <Label className="font-body text-sm">{label}</Label>
                  <Input
                    value={(editDest as Record<string, unknown>)[field] as string || ''}
                    onChange={e => setEditDest(d => ({ ...d, [field]: e.target.value }))}
                    className="bg-transparent border border-border"
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label className="font-body text-sm">Tags (separadas por vírgula)</Label>
                <Input
                  value={Array.isArray(editDest.tags) ? editDest.tags.join(', ') : (editDest.tags as string) || ''}
                  onChange={e => setEditDest(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                  className="bg-transparent border border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-body text-sm">Latitude</Label>
                  <Input
                    type="number"
                    value={editDest.latitude || ''}
                    onChange={e => setEditDest(d => ({ ...d, latitude: parseFloat(e.target.value) }))}
                    className="bg-transparent border border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-sm">Longitude</Label>
                  <Input
                    type="number"
                    value={editDest.longitude || ''}
                    onChange={e => setEditDest(d => ({ ...d, longitude: parseFloat(e.target.value) }))}
                    className="bg-transparent border border-border"
                  />
                </div>
              </div>
              <Button onClick={saveDest} className="w-full rounded-full bg-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Activity Modal */}
        <Dialog open={actModal} onOpenChange={setActModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editAct.id ? 'Editar' : 'Adicionar'} atividade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="font-body text-sm">Nome</Label>
                <Input value={editAct.name || ''} onChange={e => setEditAct(a => ({ ...a, name: e.target.value }))} className="bg-transparent border border-border" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">Destino</Label>
                <select
                  value={editAct.destinationId || ''}
                  onChange={e => setEditAct(a => ({ ...a, destinationId: e.target.value }))}
                  className="w-full h-10 rounded-md border border-border bg-transparent px-3 text-sm font-body"
                >
                  <option value="">Selecionar...</option>
                  {initialDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="font-body text-sm">Categoria</Label>
                  <Input value={editAct.category || ''} onChange={e => setEditAct(a => ({ ...a, category: e.target.value }))} className="bg-transparent border border-border" />
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-sm">Duração</Label>
                  <Input value={editAct.duration || ''} onChange={e => setEditAct(a => ({ ...a, duration: e.target.value }))} className="bg-transparent border border-border" />
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-sm">Turno</Label>
                  <select
                    value={editAct.shift || ''}
                    onChange={e => setEditAct(a => ({ ...a, shift: e.target.value as Activity['shift'] }))}
                    className="w-full h-10 rounded-md border border-border bg-transparent px-3 text-sm font-body"
                  >
                    <option value="morning">Manhã</option>
                    <option value="afternoon">Tarde</option>
                    <option value="evening">Noite</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">Endereço</Label>
                <Input value={editAct.address || ''} onChange={e => setEditAct(a => ({ ...a, address: e.target.value }))} className="bg-transparent border border-border" />
              </div>
              <Button onClick={saveAct} className="w-full rounded-full bg-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
