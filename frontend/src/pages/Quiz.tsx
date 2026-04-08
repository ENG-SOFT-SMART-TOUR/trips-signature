import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, QuizAnswers } from '@/store/useStore';
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

const questions = [
  {
    key: 'landscape',
    title: 'Where do you feel most alive?',
    options: [
      { label: 'Beach', icon: Waves, hoverAnim: { y: [0, -3, 0, 2, 0], transition: { duration: 1.2, repeat: Infinity } } },
      { label: 'Mountains', icon: Mountain, hoverAnim: { y: -4, transition: { duration: 0.4 } } },
      { label: 'City', icon: Building2, hoverAnim: { scale: 1.1, transition: { duration: 0.3 } } },
      { label: 'Countryside', icon: TreePine, hoverAnim: { rotate: [0, -3, 3, 0], transition: { duration: 1, repeat: Infinity } } },
    ],
  },
  {
    key: 'style',
    title: 'What moves your soul?',
    options: [
      { label: 'Adventure', icon: Compass, hoverAnim: { rotate: 360, transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } } },
      { label: 'Culture', icon: Landmark, hoverAnim: { scale: [1, 1.08, 1], transition: { duration: 1.2, repeat: Infinity } } },
      { label: 'Relaxation', icon: Palmtree, hoverAnim: { rotate: [0, -5, 5, -2, 0], transition: { duration: 1.5, repeat: Infinity } } },
      { label: 'Gastronomy', icon: UtensilsCrossed, hoverAnim: { y: [0, -4, 0], transition: { duration: 0.6, repeat: Infinity } } },
    ],
  },
  {
    key: 'budget',
    title: 'Your comfort zone?',
    options: [
      { label: 'Budget', icon: Wallet, hoverAnim: { scaleX: [1, 0.9, 1], transition: { duration: 0.5, repeat: Infinity } } },
      { label: 'Moderate', icon: BadgeDollarSign, hoverAnim: { y: [0, -3, 0], transition: { duration: 0.7, repeat: Infinity } } },
      { label: 'Comfortable', icon: CreditCard, hoverAnim: { x: [0, 3, 0], transition: { duration: 0.8, repeat: Infinity } } },
      { label: 'Luxury', icon: Gem, hoverAnim: { scale: [1, 1.12, 1], transition: { duration: 1, repeat: Infinity } } },
    ],
  },
  {
    key: 'companion',
    title: 'Who shares the journey?',
    options: [
      { label: 'Solo', icon: User, hoverAnim: { y: -3, transition: { duration: 0.4 } } },
      { label: 'Couple', icon: Heart, hoverAnim: { scale: [1, 1.15, 1, 1.1, 1], transition: { duration: 0.8, repeat: Infinity } } },
      { label: 'Family', icon: Users, hoverAnim: { scale: 1.05, transition: { duration: 0.3 } } },
      { label: 'Friends', icon: UserPlus, hoverAnim: { y: [0, -5, 0], transition: { duration: 0.5, repeat: Infinity } } },
    ],
  },
  {
    key: 'pace',
    title: 'Your rhythm of discovery?',
    options: [
      { label: 'Slow & deep', icon: Snail, hoverAnim: { x: [0, 4, 0], transition: { duration: 1.2, repeat: Infinity } } },
      { label: 'Balanced', icon: Scale, hoverAnim: { rotate: [0, -5, 5, 0], transition: { duration: 1, repeat: Infinity } } },
      { label: 'Fast & packed', icon: Zap, hoverAnim: { opacity: [1, 0.5, 1], transition: { duration: 0.4, repeat: Infinity } } },
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

  const select = (value: string) => {
    setAnswers(a => {
      const updated = { ...a, [current.key]: value };
      if (step < questions.length - 1) {
        setTimeout(() => {
          setDirection(1);
          setStep(s => s + 1);
        }, 300);
      } else {
        setTimeout(() => {
          setQuizAnswers(updated);
          toast.success('Profile created! Here are your matches.');
          navigate('/matches');
        }, 300);
      }
      return updated;
    });
  };

  const next = () => {
    if (!answers[current.key as keyof QuizAnswers]) {
      toast.error('Please select an option');
      return;
    }
    if (step < questions.length - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      setQuizAnswers(answers);
      toast.success('Profile created! Here are your matches.');
      navigate('/matches');
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
              Step {step + 1} of {questions.length}
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
                  const selected = answers[current.key as keyof QuizAnswers] === opt.label;
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.label}
                      onClick={() => select(opt.label)}
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
                        whileHover={opt.hoverAnim as any}
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
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={next} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              {step === questions.length - 1 ? 'See Matches' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
