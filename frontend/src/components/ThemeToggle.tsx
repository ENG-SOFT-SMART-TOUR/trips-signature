import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const [dark, setDark] = useTheme();

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
