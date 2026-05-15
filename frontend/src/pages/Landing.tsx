import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Compass, Map, Sparkles, ArrowRight, Mountain, TreePine, Globe,
  Quote, Clock, Heart, Shuffle,
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import PageTransition from '@/components/PageTransition';
import Reveal from '@/components/Reveal';
import StickyDestinations from '@/components/StickyDestinations';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import heroImg from '@/assets/hero-travel.jpg';
import natureImg from '@/assets/section-nature.jpg';
import patagoniaImg from '@/assets/destination-patagonia.jpg';

const destinations = [
  {
    name: 'Kyoto',
    country: 'Japan',
    tag: 'Culture',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&h=1000&fit=crop',
  },
  {
    name: 'Santorini',
    country: 'Greece',
    tag: 'Coastal',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&h=1000&fit=crop',
  },
  {
    name: 'Patagonia',
    country: 'Argentina',
    tag: 'Adventure',
    image: patagoniaImg,
  },
  {
    name: 'Marrakech',
    country: 'Morocco',
    tag: 'Heritage',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1600&h=1000&fit=crop',
  },
];

const testimonials = [
  {
    quote: "I've used three travel apps before. This is the first one that didn't feel like a brochure. The itinerary actually felt mine.",
    name: 'Marina', age: 28, style: 'Slow & cultural', seed: 'marina-traveler',
  },
  {
    quote: "Two minutes of questions, and suddenly I had a 7-day trip to Lisbon that matched my pace. No 14-stops-a-day nonsense.",
    name: 'Rafael', age: 34, style: 'Balanced explorer', seed: 'rafael-traveler',
  },
  {
    quote: "What I loved: I could redo the quiz when I felt different. My summer self and my winter self travel completely differently.",
    name: 'Yuki', age: 31, style: 'Adventure & food', seed: 'yuki-traveler',
  },
];

const principles = [
  { icon: Heart, label: 'Built around who you are' },
  { icon: Shuffle, label: 'Redo the quiz anytime' },
  { icon: Sparkles, label: 'No two trips alike' },
];

const HERO_WORDS = ['Travel', 'that', 'sounds'];

export default function Landing() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(heroProgress, [0, 1], ['0%', '20%']);
  const heroImgScale = useTransform(heroProgress, [0, 1], [1, 1.12]);
  const heroContentY = useTransform(heroProgress, [0, 1], ['0%', '-30%']);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  const natureRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: natureProgress } = useScroll({
    target: natureRef,
    offset: ['start end', 'end start'],
  });
  const natureY = useTransform(natureProgress, [0, 1], ['-8%', '8%']);

  const steps = [
    { icon: Sparkles, title: 'Take the Quiz', desc: 'Tell us about your ideal travel style and preferences.' },
    { icon: Compass, title: 'Get Matched', desc: 'We pair you with destinations that match your personality.' },
    { icon: Map, title: 'Plan Your Trip', desc: 'Build a detailed itinerary with curated local experiences.' },
  ];

  const stats = [
    { icon: Globe, value: '50+', label: 'Destinations' },
    { icon: Mountain, value: '200+', label: 'Activities' },
    { icon: TreePine, value: '1,000+', label: 'Experiences' },
  ];

  return (
    <PageTransition>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-50 origin-left"
        style={{ scaleX: progressX }}
        aria-hidden
      />

      <div className="fixed top-4 right-4 z-50">
        <div className="rounded-full bg-background/60 backdrop-blur-md border border-border/60 shadow-sm">
          <ThemeToggleButton />
        </div>
      </div>

      <div className="min-h-screen bg-background">
        <div
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden grain-overlay"
        >
          <motion.img
            src={heroImg}
            alt="Scenic coastal road winding along turquoise ocean cliffs"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            width={1920}
            height={1080}
            style={reduce ? undefined : { y: heroImgY, scale: heroImgScale }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-background" />

          <motion.div
            className="relative z-10 text-center px-4 max-w-3xl mx-auto"
            style={reduce ? undefined : { y: heroContentY, opacity: heroContentOpacity }}
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
                <Compass className="h-5 w-5 text-accent" />
              </div>
              <span className="font-body text-sm tracking-[0.3em] uppercase text-accent font-medium">
                Signature Trips
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              <span className="block">
                {HERO_WORDS.map((w, i) => (
                  <motion.span
                    key={w}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
              <motion.span
                className="italic block"
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                like you
              </motion.span>
            </h1>

            <motion.p
              className="font-body text-lg text-primary-foreground/80 mb-4 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Not another package. A 2-minute quiz, an itinerary built around your rhythm, your taste, your story.
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-2 mb-10 text-primary-foreground/60 text-xs font-body tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>2 min · No credit card · Free forever</span>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/register">
                <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="rounded-full border-2 border-primary-foreground/60 text-primary-foreground bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 px-8 text-base font-medium">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-2.5 rounded-full bg-primary-foreground/60" />
            </div>
          </motion.div>
        </div>

        <section className="bg-primary py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1} y={16} blur={4} className="text-center">
                <stat.icon className="h-5 w-5 text-primary-foreground/70 mx-auto mb-2" />
                <p className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="font-body text-xs tracking-wide uppercase text-primary-foreground/70">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-20 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-12">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3 block">Why we exist</span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground max-w-3xl mx-auto leading-[1.15]">
                Travel agencies sell <span className="italic text-muted-foreground">packages</span>.
                <br />We design <span className="italic text-primary">signatures</span>.
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {principles.map((p, i) => (
                <Reveal
                  key={p.label}
                  delay={i * 0.1}
                  y={20}
                  className="flex items-center gap-3 justify-center md:justify-start"
                >
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <p.icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
                  </div>
                  <span className="font-body text-sm text-foreground">{p.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-28 px-4 bg-surface">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-16">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-3 block">How it works</span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-[1.15]">
                Three steps to your perfect trip
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.15} className="text-center group">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                    <step.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[520px]">
            <div ref={natureRef} className="relative overflow-hidden">
              <motion.img
                src={natureImg}
                alt="Mountain lake surrounded by pine forests"
                className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
                loading="lazy"
                width={1920}
                height={800}
                style={reduce ? undefined : { y: natureY }}
              />
              <div className="absolute inset-0 bg-foreground/10" />
            </div>
            <div className="flex items-center bg-card px-8 md:px-16 py-16">
              <Reveal y={24}>
                <span className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3 block">Discover</span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                  Adventures tailored to your spirit
                </h2>
                <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                  From misty mountain trails to sun-kissed coastlines, every itinerary is designed around your unique travel personality. Take the quiz and let the journey begin.
                </p>
                <Link to="/register">
                  <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                    Explore Destinations <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <StickyDestinations destinations={destinations} />

        <section className="py-28 px-4 bg-surface">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-3 block">Stories</span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-[1.15]">
                Travelers who stopped settling
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Reveal
                  key={t.name}
                  as="figure"
                  delay={i * 0.12}
                  y={32}
                  className="bg-card rounded-lg p-8 flex flex-col"
                >
                  <Quote className="h-6 w-6 text-accent/60 mb-5" strokeWidth={1.5} />
                  <blockquote className="font-display text-lg text-foreground leading-relaxed mb-8 flex-1 italic">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-5">
                    <img
                      src={`https://i.pravatar.cc/80?u=${t.seed}`}
                      alt={`${t.name}, ${t.age}`}
                      width={40}
                      height={40}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{t.name}, {t.age}</p>
                      <p className="font-body text-xs text-muted-foreground tracking-wide">{t.style}</p>
                    </div>
                  </figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-28 px-4 bg-primary grain-overlay">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <Reveal y={24}>
              <Compass className="h-10 w-10 text-primary-foreground/60 mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-[1.15]">
                Ready to find your perfect trip?
              </h2>
              <p className="font-body text-primary-foreground/70 mb-8">
                Take a 2-minute quiz and get matched with destinations that fit your travel style.
              </p>
              <Link to="/register">
                <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-10 text-base">
                  Get started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://forms.gle/BWHiUicv3VcuWcDm9"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block font-body text-sm text-primary-foreground/60 hover:text-primary-foreground underline underline-offset-4 transition-colors"
              >
                Help shape the product — take our 3-minute survey
              </a>
            </Reveal>
          </div>
        </section>

        <footer className="py-12 px-4 text-center bg-card">
          <p className="text-sm text-muted-foreground font-body">© 2026 Signature Trips. Crafted with wanderlust.</p>
        </footer>
      </div>
    </PageTransition>
  );
}
