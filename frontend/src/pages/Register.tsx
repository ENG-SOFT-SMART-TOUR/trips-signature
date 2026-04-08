import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Compass } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function Register() {
  const navigate = useNavigate();
  const register = useStore(s => s.register);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    register(form.name, form.email);
    toast.success('Welcome aboard! Let\'s discover your travel style.');
    navigate('/quiz');
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
            <h1 className="font-display text-3xl font-semibold mb-2">Create your account</h1>
            <p className="text-sm text-muted-foreground font-body">Start your journey with personalized destinations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key} className="space-y-1.5">
                <Label className="font-body text-sm font-medium">{field.label}</Label>
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
                />
                {errors[field.key] && (
                  <p className="text-xs text-destructive font-body">{errors[field.key]}</p>
                )}
              </div>
            ))}
            <Button type="submit" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-body">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
