import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  /** Optional message shown below the spinner. */
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <Loader2 className="h-6 w-6 text-primary animate-spin" />
      <span className="font-body text-sm text-muted-foreground">{message}</span>
    </div>
  );
}
