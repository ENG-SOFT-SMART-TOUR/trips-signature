import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getDestination, getActivity } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Share2, BookOpen, Image, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function DiaryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { diaries, toggleDiaryPublic, deleteDiary, deleteDiaryEntry } = useStore();
  const diary = diaries.find(d => d.id === id);

  if (!diary) return <AppLayout><div className="p-12 text-center text-muted-foreground">Diary not found.</div></AppLayout>;

  const dest = getDestination(diary.destinationId);
  const groupedByDay = diary.entries.reduce<Record<number, typeof diary.entries>>((acc, entry) => {
    (acc[entry.dayNumber] = acc[entry.dayNumber] || []).push(entry);
    return acc;
  }, {});

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Travel diary</span>
              <h1 className="font-display text-3xl font-semibold">{dest?.name}</h1>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {diary.entries.length} entries</span>
                <span className="flex items-center gap-1"><Image className="h-3 w-3" /> {diary.entries.filter(e => e.photo).length} photos</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-body text-muted-foreground">{diary.isPublic ? 'Public' : 'Private'}</span>
                <Switch checked={diary.isPublic} onCheckedChange={() => {
                  toggleDiaryPublic(diary.id);
                  toast(diary.isPublic ? 'Diary set to private' : 'Diary is now public');
                }} />
              </div>
              <Button
                variant="ghost"
                className="rounded-full text-sm"
                onClick={() => {
                  const url = `${window.location.origin}/share/${diary.shareToken}`;
                  navigator.clipboard.writeText(url);
                  toast.success('Share link copied!');
                }}
              >
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <Button
              onClick={() => navigate(`/diary/${id}/entry/new`)}
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-1" /> New Entry
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Are you sure you want to delete this diary?')) {
                  deleteDiary(diary.id);
                  toast.success('Diary deleted');
                  navigate('/diaries');
                }
              }}
              className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete Diary
            </Button>
          </div>

          {diary.entries.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No entries yet"
              description="Start documenting your travel memories."
              actionLabel="Write First Entry"
              actionTo={`/diary/${id}/entry/new`}
            />
          ) : (
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
                            <img
                              src={entry.photo.startsWith('blob:') || entry.photo.startsWith('data:') ? entry.photo : `https://picsum.photos/seed/${entry.photo}/600/300`}
                              alt=""
                              className="w-full h-40 object-cover rounded-md mb-3"
                            />
                          )}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-body text-sm font-medium mb-1">{act?.name || 'Activity'}</h3>
                              <p className="font-body text-sm text-foreground leading-relaxed">{entry.text}</p>
                              <p className="font-body text-xs text-muted-foreground mt-2">{new Date(entry.timestamp).toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => {
                                if (confirm('Delete this entry?')) {
                                  deleteDiaryEntry(diary.id, entry.id);
                                  toast.success('Entry deleted');
                                }
                              }}
                              className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
