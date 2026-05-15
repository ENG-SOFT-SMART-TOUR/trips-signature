import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Compass, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-6xl font-bold mb-2 text-primary">404</h1>
        <p className="font-display text-2xl font-semibold mb-2">Página não encontrada</p>
        <p className="font-body text-sm text-muted-foreground mb-8">
          A página que você procurou não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full">
            <Link to="/">
              <Home className="h-4 w-4 mr-1" /> Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/matches">
              <Compass className="h-4 w-4 mr-1" /> Explorar destinos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
