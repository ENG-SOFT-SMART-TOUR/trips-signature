import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

type Destination = {
  name: string;
  country: string;
  tag: string;
  image?: string;
};

type Props = {
  destinations: Destination[];
};

/**
 * Apple-style pinned scroll sequence with overlapping cross-fade.
 * Each image's opacity peaks at the center of its segment and fades into
 * the neighbours, so two slides are always blending — no hard cuts.
 */
export default function StickyDestinations({ destinations }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const slides = destinations.length;
  // Generous height — ~1.6 viewport per slide gives time for slow cross-fades.
  const totalHeight = `${slides * 160 + 60}vh`;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      className="relative bg-foreground"
      style={{ height: totalHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Eyebrow + heading — fixed during the whole sequence */}
        <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-10 md:pt-16 text-center pointer-events-none">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/70 mb-3 block">
            By mood
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-primary-foreground max-w-2xl mx-auto leading-[1.15]">
            Find a place that matches the day you're having
          </h2>
        </div>

        {destinations.map((dest, i) => (
          <DestSlide
            key={dest.name}
            destination={dest}
            index={i}
            total={slides}
            scrollYProgress={scrollYProgress}
            reduce={!!reduce}
          />
        ))}

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {destinations.map((_, i) => (
            <Dot key={i} index={i} total={slides} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestSlide({
  destination,
  index,
  total,
  scrollYProgress,
  reduce,
}: {
  destination: Destination;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  // Each slide peaks at its center; fades into neighbours' centers.
  // This guarantees adjacent slides cross-fade smoothly with no flash gap.
  const seg = 1 / total;
  const center = (index + 0.5) * seg;
  const prev = center - seg;
  const next = center + seg;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Input + output arrays for opacity. Edges hold full opacity for first/last.
  const opacityInput = [
    isFirst ? 0 : prev,
    isFirst ? 0 : prev + seg * 0.4,
    center,
    isLast ? 1 : next - seg * 0.4,
    isLast ? 1 : next,
  ];
  const opacityOutput = [
    isFirst ? 1 : 0,
    isFirst ? 1 : 1,
    1,
    isLast ? 1 : 1,
    isLast ? 1 : 0,
  ];

  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput);

  // Very gentle Ken-Burns zoom across the slide's full lifetime.
  const scaleStart = isFirst ? 0 : prev;
  const scaleEnd = isLast ? 1 : next;
  const scale = useTransform(scrollYProgress, [scaleStart, scaleEnd], [1.06, 1.0]);

  // Caption slides up softly as slide enters peak.
  const textY = useTransform(
    scrollYProgress,
    [isFirst ? 0 : prev, center],
    [isFirst ? 0 : 30, 0],
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [isFirst ? 0 : prev + seg * 0.3, center, isLast ? 1 : next - seg * 0.3],
    [isFirst ? 1 : 0, 1, isLast ? 1 : 0],
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-[opacity]"
      style={reduce ? { opacity: isFirst ? 1 : 0 } : { opacity }}
    >
      <motion.img
        src={destination.image ?? `https://picsum.photos/seed/${destination.name.toLowerCase()}/1600/1000`}
        alt={`${destination.name}, ${destination.country}`}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        loading={index === 0 ? 'eager' : 'lazy'}
        style={reduce ? undefined : { scale }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-foreground/40" />

      <motion.div
        className="absolute inset-x-0 bottom-24 z-20 px-6 text-center will-change-transform"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-body font-medium mb-4">
          {destination.tag}
        </span>
        <h3 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-2">
          {destination.name}
        </h3>
        <p className="font-body text-sm md:text-base tracking-[0.2em] uppercase text-primary-foreground/80">
          {destination.country}
        </p>
      </motion.div>
    </motion.div>
  );
}

function Dot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const center = (index + 0.5) * seg;
  const width = useTransform(
    scrollYProgress,
    [center - seg * 0.5, center, center + seg * 0.5],
    [8, 28, 8],
  );
  const opacity = useTransform(
    scrollYProgress,
    [center - seg * 0.5, center, center + seg * 0.5],
    [0.4, 1, 0.4],
  );
  return (
    <motion.span
      className="h-1.5 rounded-full bg-primary-foreground"
      style={{ width, opacity }}
    />
  );
}
