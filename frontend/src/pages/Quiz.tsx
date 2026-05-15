import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, QuizAnswers } from '@/store/useStore';
import { quizApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Check, Waves, Mountain, Building2, TreePine, Compass, Landmark, Palmtree, UtensilsCrossed, Wallet, BadgeDollarSign, CreditCard, Gem, User, Heart, Users, UserPlus, Snail, Scale, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

type HoverAnim = {
  y?: number | number[];
  x?: number | number[];
  scale?: number | number[];
  scaleX?: number[];
  rotate?: number | number[];
  opacity?: number[];
  transition?: { duration?: number; repeat?: number; repeatType?: string; ease?: string };
};

// Option `tag` is the canonical English value sent to the backend (matches the
// tags seeded for destinos). `label` is the localised display text.
const questions = [
  {
    key: 'landscape',
    title: 'Onde você se sente mais vivo?',
    options: [
      { label: 'Praia', tag: 'Beach', icon: Waves, hoverAnim: { y: [0, -3, 0, 2, 0], transition: { duration: 1.2, repeat: Infinity } } },
      { label: 'Montanhas', tag: 'Mountains', icon: Mountain, hoverAnim: { y: -4, transition: { duration: 0.4 } } },
      { label: 'Cidade', tag: 'City', icon: Building2, hoverAnim: { scale: 1.1, transition: { duration: 0.3 } } },
      { label: 'Campo', tag: 'Countryside', icon: TreePine, hoverAnim: { rotate: [0, -3, 3, 0], transition: { duration: 1, repeat: Infinity } } },
    ],
  },
  {
    key: 'style',
    title: 'O que move sua alma?',
    options: [
      { label: 'Aventura', tag: 'Adventure', icon: Compass, hoverAnim: { rotate: 360, transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } } },
      { label: 'Cultura', tag: 'Culture', icon: Landmark, hoverAnim: { scale: [1, 1.08, 1], transition: { duration: 1.2, repeat: Infinity } } },
      { label: 'Relaxamento', tag: 'Relaxation', icon: Palmtree, hoverAnim: { rotate: [0, -5, 5, -2, 0], transition: { duration: 1.5, repeat: Infinity } } },
      { label: 'Gastronomia', tag: 'Gastronomy', icon: UtensilsCrossed, hoverAnim: { y: [0, -4, 0], transition: { duration: 0.6, repeat: Infinity } } },
    ],
  },
  {
    key: 'budget',
    title: 'Sua zona de conforto?',
    options: [
      { label: 'Econômico', tag: 'Budget', icon: Wallet, hoverAnim: { scaleX: [1, 0.9, 1], transition: { duration: 0.5, repeat: Infinity } } },
      { label: 'Moderado', tag: 'Moderate', icon: BadgeDollarSign, hoverAnim: { y: [0, -3, 0], transition: { duration: 0.7, repeat: Infinity } } },
      { label: 'Confortável', tag: 'Comfortable', icon: CreditCard, hoverAnim: { x: [0, 3, 0], transition: { duration: 0.8, repeat: Infinity } } },
      { label: 'Luxo', tag: 'Luxury', icon: Gem, hoverAnim: { scale: [1, 1.12, 1], transition: { duration: 1, repeat: Infinity } } },
    ],
  },
  {
    key: 'companion',
    title: 'Quem compartilha a jornada?',
    options: [
      { label: 'Sozinho', tag: 'Solo', icon: User, hoverAnim: { y: -3, transition: { duration: 0.4 } } },
      { label: 'Casal', tag: 'Couple', icon: Heart, hoverAnim: { scale: [1, 1.15, 1, 1.1, 1], transition: { duration: 0.8, repeat: Infinity } } },
      { label: 'Família', tag: 'Family', icon: Users, hoverAnim: { scale: 1.05, transition: { duration: 0.3 } } },
      { label: 'Amigos', tag: 'Friends', icon: UserPlus, hoverAnim: { y: [0, -5, 0], transition: { duration: 0.5, repeat: Infinity } } },
    ],
  },
  {
    key: 'pace',
    title: 'Seu ritmo de descoberta?',
    options: [
      { label: 'Lento e profundo', tag: 'Slow & deep', icon: Snail, hoverAnim: { x: [0, 4, 0], transition: { duration: 1.2, repeat: Infinity } } },
      { label: 'Equilibrado', tag: 'Balanced', icon: Scale, hoverAnim: { rotate: [0, -5, 5, 0], transition: { duration: 1, repeat: Infinity } } },
      { label: 'Rápido e intenso', tag: 'Fast & packed', icon: Zap, hoverAnim: { opacity: [1, 0.5, 1], transition: { duration: 0.4, repeat: Infinity } } },
    ],
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const setQuizAnswers = useStore(s => s.setQuizAnswers);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [direction, setDirection] = useState(1);

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const user = useStore(s => s.user);
  const isRetake = user?.quizCompleto ?? false;

  const submitQuiz = async (finalAnswers: QuizAnswers) => {
    const tags = Object.values(finalAnswers).filter(Boolean).map(v => v!.toLowerCase());
    try {
      if (user?.id) {
        await quizApi.responder({ usuarioId: user.id, tags });
      }
      setQuizAnswers(finalAnswers);
      if (isRetake) {
        toast.success('Perfil atualizado!');
        navigate('/dashboard');
      } else {
        toast.success('Perfil criado! Aqui estão suas combinações.');
        navigate('/matches');
      }
    } catch {
      toast.error('Falha ao salvar o perfil. Tente novamente.');
    }
  };

  const select = (value: string) => {
    setAnswers(a => {
      const updated = { ...a, [current.key]: value };
      if (step < questions.length - 1) {
        setTimeout(() => {
          setDirection(1);
          setStep(s => s + 1);
        }, 300);
      } else {
        setTimeout(() => submitQuiz(updated), 300);
      }
      return updated;
    });
  };

  const next = () => {
    if (!answers[current.key as keyof QuizAnswers]) {
      toast.error('Selecione uma opção');
      return;
    }
    if (step < questions.length - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      submitQuiz(answers);
    }
  };

  const prev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-xl">
          <div className="mb-10">
            <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">
              Etapa {step + 1} de {questions.length}
            </span>
            <Progress value={progress} className="h-1 bg-surface [&>div]:bg-primary" />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-10 text-foreground">
                {current.title}
              </h2>
              <div className="flex flex-col gap-3">
                {current.options.map(opt => {
                  const selected = answers[current.key as keyof QuizAnswers] === opt.tag;
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.tag}
                      onClick={() => select(opt.tag)}
                      className={`group relative flex items-center justify-between gap-4 px-6 py-5 rounded-xl font-body text-sm font-medium transition-colors duration-200 cursor-pointer ${
                        selected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {selected && <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
                        <span className="text-sm md:text-base">{opt.label}</span>
                      </div>
                      <motion.div
                        whileHover={opt.hoverAnim as HoverAnim}
                      >
                        <Icon
                          className={`h-6 w-6 transition-colors duration-200 ${
                            selected ? 'text-primary-foreground' : 'text-primary'
                          }`}
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-12">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={step === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <Button onClick={next} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              {step === questions.length - 1 ? 'Ver combinações' : 'Próxima'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
