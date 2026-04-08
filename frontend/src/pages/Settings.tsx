import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Save, LogOut, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Settings() {
  const { user, savedDestinations, logout, updateProfile } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    updateProfile(name.trim(), email.trim());
    toast.success('Profile updated!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quizLabels: Record<string, string> = {
    landscape: 'Landscape',
    style: 'Travel Style',
    budget: 'Budget',
    companion: 'Companion',
    pace: 'Pace',
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-foreground"
        >
          Settings
        </motion.h1>

        {/* Profile */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-display font-semibold text-foreground">Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </motion.section>

        {/* Travel Profile */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-foreground">Travel Profile</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/quiz')}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
          {user?.quizAnswers && Object.keys(user.quizAnswers).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(user.quizAnswers).map(([key, value]) =>
                value ? (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-body text-muted-foreground">
                      {quizLabels[key] || key}
                    </span>
                    <Badge variant="secondary" className="capitalize">
                      {value}
                    </Badge>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-sm font-body text-muted-foreground">
              You haven't taken the quiz yet. Take it to discover your travel personality!
            </p>
          )}
        </motion.section>

        {/* Saved Destinations */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface rounded-xl p-6 space-y-3"
        >
          <h2 className="text-lg font-display font-semibold text-foreground">Saved Destinations</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-body">
              {savedDestinations.length} destination{savedDestinations.length !== 1 ? 's' : ''} saved
            </span>
          </div>
        </motion.section>

        {/* Account */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-xl p-6 space-y-4 border border-destructive/20"
        >
          <h2 className="text-lg font-display font-semibold text-destructive">Account</h2>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </motion.section>
      </div>
    </AppLayout>
  );
}
