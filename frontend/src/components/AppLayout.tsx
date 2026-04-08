import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Map, Heart, BookOpen, LayoutDashboard, LogOut, Menu, X, Compass, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/matches', label: 'Matches', icon: Compass },
    { to: '/itineraries', label: 'Itineraries', icon: Map },
    { to: '/diaries', label: 'Diaries', icon: BookOpen },
  ];

  const getIsActive = (link: typeof links[0]) => {
    return location.pathname === link.to;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <Compass className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-45" />
              <span className="font-display text-xl font-semibold text-foreground">Signature Trips</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 group ${
                    getIsActive(link)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <link.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate('/quiz')}
                className="relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(150,80%,38%)] text-white text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[hsl(150,80%,38%)]/30 group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180 relative z-10" />
                <span className="relative z-10">Redo Quiz</span>
              </button>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface hover:bg-surface/80 transition-colors duration-200 group"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-foreground">{user?.name}</span>
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-surface transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-card"
            >
              <div className="px-4 py-4 space-y-1">
                {links.map(link => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-surface"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>{children}</main>
    </div>
  );
}
