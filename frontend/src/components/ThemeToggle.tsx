import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const STORAGE_KEY = 'theme';

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

function readInitial(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  // first visit: follow the OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(readInitial);

  useEffect(() => {
    applyTheme(dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {dark ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
        <span className="text-sm font-body">{dark ? 'Modo escuro' : 'Modo claro'}</span>
      </div>
      <Switch checked={dark} onCheckedChange={setDark} aria-label="Alternar tema" />
    </div>
  );
}
