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
      toast.error('Name and description are required');
      return;
    }
    if (editDest.id) {
      setDests(ds => ds.map(d => d.id === editDest.id ? { ...d, ...editDest } as Destination : d));
      toast.success('Destination updated');
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
      toast.success('Destination added');
    }
    setDestModal(false);
    setEditDest({});
  };

  const saveAct = () => {
    if (!editAct.name || !editAct.destinationId) {
      toast.error('Name and destination are required');
      return;
    }
    if (editAct.id) {
      setActs(as2 => as2.map(a => a.id === editAct.id ? { ...a, ...editAct } as Activity : a));
      toast.success('Activity updated');
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
      toast.success('Activity added');
    }
    setActModal(false);
    setEditAct({});
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-semibold mb-8">Admin Panel</h1>

          <Tabs defaultValue="destinations">
            <TabsList className="bg-surface rounded-full p-1 mb-8">
              <TabsTrigger value="destinations" className="rounded-full font-body text-sm">Destinations</TabsTrigger>
              <TabsTrigger value="activities" className="rounded-full font-body text-sm">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="destinations">
              <div className="flex justify-end mb-4">
                <Button onClick={() => { setEditDest({}); setDestModal(true); }} className="rounded-full bg-accent text-accent-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Add Destination
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden bg-surface">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Name</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Tags</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Lat/Lng</th>
                      <th className="text-right p-4 font-medium">Actions</th>
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
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setEditDest(d); setDestModal(true); }}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:text-destructive" onClick={() => { setDests(ds => ds.filter(x => x.id !== d.id)); toast('Deleted'); }}>
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
                  <Plus className="h-4 w-4 mr-1" /> Add Activity
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden bg-surface">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Name</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Category</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Duration</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Shift</th>
                      <th className="text-right p-4 font-medium">Actions</th>
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
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setEditAct(a); setActModal(true); }}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:text-destructive" onClick={() => { setActs(as2 => as2.filter(x => x.id !== a.id)); toast('Deleted'); }}>
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
              <DialogTitle className="font-display">{editDest.id ? 'Edit' : 'Add'} Destination</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {['name', 'description'].map(field => (
                <div key={field} className="space-y-1">
                  <Label className="font-body text-sm capitalize">{field}</Label>
                  <Input
                    value={(editDest as any)[field] || ''}
                    onChange={e => setEditDest(d => ({ ...d, [field]: e.target.value }))}
                    className="bg-transparent border border-border"
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label className="font-body text-sm">Tags (comma-separated)</Label>
                <Input
                  value={Array.isArray(editDest.tags) ? editDest.tags.join(', ') : (editDest.tags as string) || ''}
                  onChange={e => setEditDest(d => ({ ...d, tags: e.target.value as any }))}
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
              <Button onClick={saveDest} className="w-full rounded-full bg-primary text-primary-foreground">Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Activity Modal */}
        <Dialog open={actModal} onOpenChange={setActModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editAct.id ? 'Edit' : 'Add'} Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="font-body text-sm">Name</Label>
                <Input value={editAct.name || ''} onChange={e => setEditAct(a => ({ ...a, name: e.target.value }))} className="bg-transparent border border-border" />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">Destination</Label>
                <select
                  value={editAct.destinationId || ''}
                  onChange={e => setEditAct(a => ({ ...a, destinationId: e.target.value }))}
                  className="w-full h-10 rounded-md border border-border bg-transparent px-3 text-sm font-body"
                >
                  <option value="">Select...</option>
                  {initialDests.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="font-body text-sm">Category</Label>
                  <Input value={editAct.category || ''} onChange={e => setEditAct(a => ({ ...a, category: e.target.value }))} className="bg-transparent border border-border" />
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-sm">Duration</Label>
                  <Input value={editAct.duration || ''} onChange={e => setEditAct(a => ({ ...a, duration: e.target.value }))} className="bg-transparent border border-border" />
                </div>
                <div className="space-y-1">
                  <Label className="font-body text-sm">Shift</Label>
                  <select
                    value={editAct.shift || ''}
                    onChange={e => setEditAct(a => ({ ...a, shift: e.target.value as Activity['shift'] }))}
                    className="w-full h-10 rounded-md border border-border bg-transparent px-3 text-sm font-body"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-body text-sm">Address</Label>
                <Input value={editAct.address || ''} onChange={e => setEditAct(a => ({ ...a, address: e.target.value }))} className="bg-transparent border border-border" />
              </div>
              <Button onClick={saveAct} className="w-full rounded-full bg-primary text-primary-foreground">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
