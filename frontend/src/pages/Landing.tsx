import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Map, Sparkles, ArrowRight, Mountain, TreePine, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import heroImg from '@/assets/hero-travel.jpg';
import natureImg from '@/assets/section-nature.jpg';

const destinations = [
  { name: 'Kyoto', country: 'Japan', tag: 'Culture' },
  { name: 'Santorini', country: 'Greece', tag: 'Coastal' },
  { name: 'Patagonia', country: 'Argentina', tag: 'Adventure' },
  { name: 'Marrakech', country: 'Morocco', tag: 'Heritage' },
];

export default function Landing() {
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
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden grain-overlay">
          <img
            src={heroImg}
            alt="Scenic coastal road winding along turquoise ocean cliffs"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-background" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
                  <Compass className="h-5 w-5 text-accent" />
                </div>
                <span className="font-body text-sm tracking-[0.3em] uppercase text-accent font-medium">
                  Signature Trips
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                Your journey,
                <br />
                <span className="italic">your signature</span>
              </h1>
              <p className="font-body text-lg text-primary-foreground/80 mb-10 max-w-lg mx-auto">
                Personalized itineraries crafted around who you are. Every trip tells your story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
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

        {/* Stats bar */}
        <section className="bg-primary py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-5 w-5 text-primary-foreground/70 mx-auto mb-2" />
                <p className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="font-body text-xs tracking-wide uppercase text-primary-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-4 bg-surface">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-3 block">How it works</span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">Three steps to your perfect trip</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="text-center group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                    <step.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nature CTA split */}
        <section className="relative overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[500px]">
            <div className="relative">
              <img
                src={natureImg}
                alt="Mountain lake surrounded by pine forests"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                width={1920}
                height={800}
              />
              <div className="absolute inset-0 bg-foreground/10" />
            </div>
            <div className="flex items-center bg-card px-8 md:px-16 py-16">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Destination peek */}
        <section className="py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-3 block">Popular</span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">Destinations travelers love</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden hover-lift cursor-pointer"
                >
                  <img
                    src={`https://picsum.photos/seed/${dest.name.toLowerCase()}/600/800`}
                    alt={`${dest.name}, ${dest.country}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-body font-medium">
                      {dest.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-lg font-semibold text-primary-foreground">{dest.name}</h3>
                    <p className="font-body text-xs text-primary-foreground/80">{dest.country}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 bg-primary grain-overlay">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Compass className="h-10 w-10 text-primary-foreground/60 mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to find your perfect trip?
              </h2>
              <p className="font-body text-primary-foreground/70 mb-8">
                Take a 2-minute quiz and get matched with destinations that fit your travel style.
              </p>
              <Link to="/register">
                <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-10 text-base">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 text-center bg-card">
          <p className="text-sm text-muted-foreground font-body">© 2026 Signature Trips. Crafted with wanderlust.</p>
        </footer>
      </div>
    </PageTransition>
  );
}
