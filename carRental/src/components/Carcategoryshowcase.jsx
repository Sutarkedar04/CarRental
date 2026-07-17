import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(CustomEase, ScrollTrigger);

CustomEase.create("smoothCustom", "M0,0 C0.65,0 0.35,1 1,1");

const CATEGORIES = [
  { name: "Hatchback", image: "/Car1.png", gradient: "radial-gradient(60% 60% at 50% 45%, #3a3a3a 0%, #050505 100%)", offsetY: -2 },
  { name: "Sedan", image: "/Car2.png", gradient: "radial-gradient(60% 60% at 50% 45%, #d13b3b 0%, #4a0f0f 100%)", offsetY: 0 },
  { name: "SUV", image: "/Car3.png", gradient: "radial-gradient(60% 60% at 50% 45%, #4f5a3d 0%, #10130c 100%)", offsetY: -6 },
  { name: "MPV", image: "/Car4.png", gradient: "radial-gradient(60% 60% at 50% 45%, #5a6268 0%, #1a1c1e 100%)", offsetY: -6 },
  { name: "Off-roader", image: "/Car5.png", gradient: "radial-gradient(60% 60% at 50% 45%, #a67c4e 0%, #241b0e 100%)", offsetY: -6 },
];

const AUTOPLAY_MS = 4000;
const DRAG_THRESHOLD = 60;
const VELOCITY_THRESHOLD = 0.5;
const EXIT_BUFFER = 1.15;

const PARALLAX = {
  headline: { x: 18, y: 10 },
  car: { x: -28, y: -16, rotate: 3 },
  nav: { x: 8, y: 5 },
};

const SCROLL_PARALLAX = {
  headline: 60,
  car: -90,
  nav: 30,
};

export default function CarCategoryShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const containerRef = useRef(null);

  const headlineRef = useRef(null);
  const carRef = useRef(null);

  const headlineParallaxRef = useRef(null);
  const carParallaxRef = useRef(null);
  const navParallaxRef = useRef(null);

  const headlineScrollRef = useRef(null);
  const carScrollRef = useRef(null);
  const navScrollRef = useRef(null);

  const timerRef = useRef(null);
  const isAnimating = useRef(false);
  const exitDist = useRef(400);

  const bgLayerARef = useRef(null);
  const bgLayerBRef = useRef(null);
  const activeLayer = useRef("a");

  const dragState = useRef({ dragging: false, startX: 0, startT: 0 });
  const quickSetters = useRef(null);

  const active = CATEGORIES[index];

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        exitDist.current = containerRef.current.offsetWidth * EXIT_BUFFER;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (bgLayerARef.current) {
      gsap.set(bgLayerARef.current, { background: CATEGORIES[0].gradient, opacity: 1 });
    }
    if (bgLayerBRef.current) {
      gsap.set(bgLayerBRef.current, { opacity: 0 });
    }
  }, []);

  useEffect(() => {
    quickSetters.current = {
      headlineX: gsap.quickTo(headlineParallaxRef.current, "x", { duration: 0.7, ease: "power3.out" }),
      headlineY: gsap.quickTo(headlineParallaxRef.current, "y", { duration: 0.7, ease: "power3.out" }),
      carX: gsap.quickTo(carParallaxRef.current, "x", { duration: 0.6, ease: "power3.out" }),
      carY: gsap.quickTo(carParallaxRef.current, "y", { duration: 0.6, ease: "power3.out" }),
      carRotate: gsap.quickTo(carParallaxRef.current, "rotate", { duration: 0.6, ease: "power3.out" }),
      navX: gsap.quickTo(navParallaxRef.current, "x", { duration: 0.8, ease: "power3.out" }),
      navY: gsap.quickTo(navParallaxRef.current, "y", { duration: 0.8, ease: "power3.out" }),
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const layers = [
        { el: headlineScrollRef.current, dist: SCROLL_PARALLAX.headline },
        { el: carScrollRef.current, dist: SCROLL_PARALLAX.car },
        { el: navScrollRef.current, dist: SCROLL_PARALLAX.nav },
      ];

      layers.forEach(({ el, dist }) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: -dist },
          {
            y: dist,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const crossfadeTo = (targetGradient, duration) => {
    const showingLayer = activeLayer.current === "a" ? bgLayerARef.current : bgLayerBRef.current;
    const hiddenLayer = activeLayer.current === "a" ? bgLayerBRef.current : bgLayerARef.current;

    gsap.set(hiddenLayer, { background: targetGradient });
    gsap.to(hiddenLayer, { opacity: 1, duration, ease: "smoothCustom" }, 0);
    gsap.to(showingLayer, { opacity: 0, duration, ease: "smoothCustom" }, 0);

    activeLayer.current = activeLayer.current === "a" ? "b" : "a";
  };

  const goToIndex = (newIndex) => {
    const total = CATEGORIES.length;
    const target = ((newIndex % total) + total) % total;
    if (isAnimating.current || target === index) return;
    isAnimating.current = true;

    const dist = exitDist.current;

    // NOTE: no gsap.set(..., {x:0}) reset before this — tweens always
    // animate FROM the element's current position (even mid-drag),
    // so motion continues seamlessly instead of snapping back first.
    const tl = gsap.timeline({
      defaults: { ease: "smoothCustom", duration: 1.1 },
      onComplete: () => setIndex(target),
    });

    tl.to(headlineRef.current, { x: dist }, 0);
    tl.to(carRef.current, { x: -dist }, 0);

    crossfadeTo(CATEGORIES[target].gradient, 1.1);
  };

  useLayoutEffect(() => {
    if (!headlineRef.current || !carRef.current) return;

    const dist = exitDist.current;

    gsap.killTweensOf([headlineRef.current, carRef.current]);
    gsap.set(headlineRef.current, { x: -dist });
    gsap.set(carRef.current, { x: dist });

    const tl = gsap.timeline({
      defaults: { ease: "smoothCustom", duration: 1.3 },
      onComplete: () => { isAnimating.current = false; },
    });
    tl.to(headlineRef.current, { x: 0 }, 0);
    tl.to(carRef.current, { x: 0 }, 0);
  }, [index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      goToIndex(index + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, index]);

  const onContainerMouseMove = (e) => {
    if (dragState.current.dragging || !quickSetters.current) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    quickSetters.current.headlineX(nx * PARALLAX.headline.x);
    quickSetters.current.headlineY(ny * PARALLAX.headline.y);
    quickSetters.current.carX(nx * PARALLAX.car.x);
    quickSetters.current.carY(ny * PARALLAX.car.y);
    quickSetters.current.carRotate(nx * PARALLAX.car.rotate);
    quickSetters.current.navX(nx * PARALLAX.nav.x);
    quickSetters.current.navY(ny * PARALLAX.nav.y);
  };

  const resetParallax = () => {
    if (!quickSetters.current) return;
    quickSetters.current.headlineX(0);
    quickSetters.current.headlineY(0);
    quickSetters.current.carX(0);
    quickSetters.current.carY(0);
    quickSetters.current.carRotate(0);
    quickSetters.current.navX(0);
    quickSetters.current.navY(0);
  };

  const onPointerDown = (e) => {
    setPaused(true);
    dragState.current = { dragging: true, startX: e.clientX, startT: performance.now() };
    // freeze mouse-parallax at its current offset while dragging, so it
    // doesn't fight the drag-follow transform on the slide layer
  };

  const onPointerMove = (e) => {
    onContainerMouseMove(e); // no-ops automatically while dragging (guard inside)

    if (!dragState.current.dragging || isAnimating.current) return;
    const deltaX = e.clientX - dragState.current.startX;
    // use quickTo-style direct set for the drag-follow so it tracks the
    // finger 1:1 with zero lag — this is the "grabbed" feel
    gsap.set(headlineRef.current, { x: -deltaX * 0.35 });
    gsap.set(carRef.current, { x: deltaX * 0.35 });
  };

  const onPointerUp = (e) => {
    if (!dragState.current.dragging) return;
    const deltaX = e.clientX - dragState.current.startX;
    const dt = Math.max(1, performance.now() - dragState.current.startT);
    const velocity = Math.abs(deltaX) / dt;
    dragState.current.dragging = false;
    setPaused(false);

    const shouldCommit = Math.abs(deltaX) > DRAG_THRESHOLD || velocity > VELOCITY_THRESHOLD;

    if (!shouldCommit) {
      // snap back to center smoothly — no instant jump
      gsap.to(headlineRef.current, { x: 0, duration: 0.6, ease: "smoothCustom" });
      gsap.to(carRef.current, { x: 0, duration: 0.6, ease: "smoothCustom" });
      return;
    }

    // Commit: DO NOT reset position first. goToIndex's tween will pick up
    // from wherever the drag left the element and continue in the same
    // direction — this is what removes the "snap back then slide" glitch.
    if (deltaX < 0) {
      goToIndex(index + 1);
    } else {
      goToIndex(index - 1);
    }
  };

  const onPointerLeave = (e) => {
    onPointerUp(e);
    resetParallax();
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className="relative w-full max-w-[1482px] aspect-[1482/900] select-none touch-pan-y"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden"
          style={{ containerType: "inline-size", perspective: 1000 }}
        >
          <div ref={bgLayerARef} className="absolute inset-0 pointer-events-none" />
          <div ref={bgLayerBRef} className="absolute inset-0 pointer-events-none" />

          <svg
            viewBox="0 0 1359 471"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-1/2 -translate-x-1/2 bottom-[6cqw] w-[92cqw] h-[38cqw] opacity-[0.18] pointer-events-none"
          >
            <path
              d="M413.33 553.888L173.83 819.388H1036.83L1097.83 553.888L1296.83 343.388L838.33 76.3884L323.83 111.388L676.83 343.388H189.33L413.33 553.888Z"
              stroke="white"
              strokeWidth="150"
            />
          </svg>

          {/* Headline — now huge + bold, still 3 nested layers */}
          <div ref={headlineScrollRef} className="absolute inset-x-0 top-[7cqw] will-change-transform">
            <div ref={headlineParallaxRef} className="will-change-transform">
              <p
                ref={headlineRef}
                className="font-anton text-white uppercase text-center leading-[0.8] tracking-[-0.02em]
                           text-[19cqw] whitespace-nowrap will-change-transform"
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.15)",
                  fontWeight: 500,
                }}
              >
                {active.name}
              </p>
            </div>
          </div>

          <div ref={carScrollRef} className="absolute inset-x-0 bottom-[8cqw] will-change-transform pointer-events-none">
            <div
              className="flex justify-center z-10"
              style={{ transform: `translateY(${active.offsetY}cqw)` }}
            >
              <div ref={carParallaxRef} className="will-change-transform">
                <img
                  ref={carRef}
                  src={active.image}
                  alt={`${active.name} car`}
                  className="w-[68cqw] max-w-full h-auto object-contain
                             drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)] will-change-transform"
                />
              </div>
            </div>
          </div>

          <div ref={navScrollRef} className="absolute bottom-[10cqw] inset-x-0 z-20 will-change-transform">
            <div
              ref={navParallaxRef}
              className="flex justify-center flex-wrap gap-[2.5cqw] will-change-transform"
            >
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => goToIndex(i)}
                  className={`font-anton uppercase text-[1.4cqw] leading-none tracking-wide transition-colors duration-300
                    ${i === index ? "text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}