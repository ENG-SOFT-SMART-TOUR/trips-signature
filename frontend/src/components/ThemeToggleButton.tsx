import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleButtonProps {
  className?: string;
}

export default function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const [dark, setDark] = useTheme();
  const label = dark ? 'Mudar para modo claro' : 'Mudar para modo escuro';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            aria-label={label}
            className={`rounded-full ${className ?? ''}`}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
