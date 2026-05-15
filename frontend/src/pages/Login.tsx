import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { authApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Compass } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function Login() {
  const navigate = useNavigate();
  const login = useStore(s => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail válido é obrigatório';
    if (!form.password) e.password = 'Senha é obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await authApi.login({
        email: form.email,
        senha: form.password,
      });
      login(data.email, data.nome, data.id, data.quizCompleto);
      toast.success('Bem-vindo de volta!');
      navigate(data.quizCompleto ? '/dashboard' : '/quiz');
    } catch {
      toast.error('E-mail ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-semibold">Signature Trips</span>
            </Link>
            <h1 className="font-display text-3xl font-semibold mb-2">Bem-vindo de volta</h1>
            <p className="text-sm text-muted-foreground font-body">Continue sua jornada de viagem</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-medium">E-mail</Label>
              <Input
                type="email"
                placeholder="joao@exemplo.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-medium">Senha</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-body">
            Ainda não tem conta?{' '}
            <Link to="/register" className="text-primary hover:underline">Criar uma</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
