'use client';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';
import { features, marqueeItems, steps, testimonials } from '../lib/index';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0f14] font-['Geist_Mono','IBM_Plex_Mono',monospace] text-white overflow-x-hidden w-full">
      <ScrollReveal />
      <section className="relative flex min-h-[62vh] items-center overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
        {/* Background glows — clipped to section so they never cause overflow */}
        <div className="pointer-events-none absolute -left-48 -top-48 h-125 w-125 rounded-full bg-amber-500/[0.07] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-90 w-90 rounded-full bg-amber-500/4 blur-[100px]" />

        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="animate-fadeslide a-d0 opacity-0 mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/[0.09]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 sm:text-[11px]">
                🇳🇬 Tenant Insights for Nigeria
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fadeslide a-d1 opacity-0 mb-5 font-['Cabinet_Grotesk','Syne',sans-serif] text-[48px] font-black uppercase leading-[0.88] tracking-tight sm:text-[72px] lg:text-[104px]">
              Rent
              <br />
              <span className="text-amber-400">Smarter.</span>
              <br />
              <em className="block font-['Lora','Georgia',serif] text-[28px] font-normal italic leading-tight text-white/40 sm:text-[40px] lg:text-[58px]">
                Know Before You Move.
              </em>
            </h1>

            {/* Subtitle */}
            <p className="animate-fadeslide a-d2 opacity-0 mb-8 max-w-md text-[13px] leading-relaxed text-white/40 sm:text-[15px]">
              Real reviews from real tenants across Lagos. Uncover hidden issues
              agents and landlords won't tell you — before you sign.
            </p>

            {/* CTAs */}
            <div className="animate-fadeslide a-d3 opacity-0 mb-10 flex flex-wrap gap-2.5">
              <Link
                href="/properties"
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-[13px]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search Properties
              </Link>
              <Link
                href="/map"
                className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/60 ring-1 ring-white/[0.09] transition-all hover:bg-white/[0.09] hover:text-white/80 sm:px-7 sm:py-3.5 sm:text-[13px]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                View Map
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fadeslide a-d4 opacity-0 flex flex-wrap gap-2">
              {[
                { target: 500, label: 'Properties', sub: 'Listed' },
                { target: 2000, label: 'Reviews', sub: 'Verified' },
                { target: 20, label: 'Areas', sub: 'Covered' },
              ].map(({ target, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white/3 px-4 py-3 ring-1 ring-white/[0.07]"
                >
                  <AnimatedCounter
                    target={target}
                    className="font-['Cabinet_Grotesk','Syne',sans-serif] text-2xl font-black text-amber-400 sm:text-3xl"
                  />
                  <div>
                    <div className="text-[11px] font-semibold text-white/60 sm:text-xs">
                      {label}
                    </div>
                    <div className="text-[10px] text-white/25 sm:text-[11px]">
                      {sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="animate-fadeslide a-d5 opacity-0 absolute right-0 top-1/2 hidden w-65 -translate-y-1/2 space-y-3 lg:block">
            <PreviewCard />
          </div>
        </div>
      </section>
      <div className="overflow-hidden border-y border-white/6 bg-[#0e1117] py-3.5 w-full">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-3 pr-8 text-[11px] font-medium text-white/30 sm:text-[12px]"
            >
              {item}
              <span className="text-white/10">◆</span>
            </span>
          ))}
        </div>
      </div>

      <section className="w-full px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-12">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/70 sm:text-[11px]">
              What You Can Discover
            </p>
            <h2 className="font-['Cabinet_Grotesk','Syne',sans-serif] text-[32px] font-black uppercase leading-none tracking-tight text-white/90 sm:text-[48px] lg:text-[64px]">
              Everything tenants
              <br />
              <span className="text-white/30">wish they knew</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`reveal d${i + 1} group rounded-xl bg-white/3 p-5 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.05] sm:p-6`}
              >
                <span className="mb-4 block text-2xl sm:text-3xl">
                  {f.icon}
                </span>
                <h3 className="mb-1.5 font-['Cabinet_Grotesk','Syne',sans-serif] text-base font-black uppercase tracking-wide text-white/85 sm:text-lg">
                  {f.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-white/35 sm:text-[13px]">
                  {f.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-amber-400/60 opacity-0 transition-all duration-200 group-hover:opacity-100 sm:text-[11px]">
                  View reports
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="w-full border-t border-white/6 px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-12">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/70 sm:text-[11px]">
              How It Works
            </p>
            <h2 className="font-['Cabinet_Grotesk','Syne',sans-serif] text-[32px] font-black uppercase leading-none tracking-tight text-white/90 sm:text-[48px] lg:text-[64px]">
              Three steps
              <br />
              <em className="block font-['Lora','Georgia',serif] text-[20px] font-normal not-italic italic text-white/30 sm:text-[28px] lg:text-[38px]">
                to rent with confidence
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`reveal d${i + 1} relative overflow-hidden rounded-xl bg-white/3 p-5 ring-1 ring-white/[0.07] sm:p-8`}
              >
                {/* Ghost number */}
                <span className="pointer-events-none absolute -right-2 -top-2 select-none font-['Cabinet_Grotesk','Syne',sans-serif] text-[72px] font-black leading-none text-amber-500/[0.06] sm:text-[88px]">
                  {s.n}
                </span>

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 sm:h-12 sm:w-12">
                  {s.icon}
                </div>

                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/60 sm:text-[11px]">
                  Step {s.n}
                </p>
                <h3 className="mb-2 font-['Cabinet_Grotesk','Syne',sans-serif] text-[18px] font-black uppercase leading-tight tracking-wide text-white/85 sm:text-[22px]">
                  {s.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-white/35 sm:text-[13px]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="w-full border-t border-white/[0.06] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-12">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/70 sm:text-[11px]">
              Real Reviews
            </p>
            <h2 className="font-['Cabinet_Grotesk',_'Syne',_sans-serif] text-[32px] font-black uppercase leading-none tracking-tight text-white/90 sm:text-[48px] lg:text-[58px]">
              What tenants are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {testimonials.map((r, i) => (
              <div
                key={r.name}
                className={`reveal d${i + 1} rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.07] sm:p-6`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-1 sm:h-9 sm:w-9 sm:text-[12px] ${r.accent}`}
                  >
                    {r.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-white/75 sm:text-[13px]">
                      {r.name}
                    </p>
                    <p className="text-[10px] text-white/25 sm:text-[11px]">
                      {r.area} · {r.tenure}
                    </p>
                  </div>
                  <div className="ml-auto shrink-0 text-[12px] text-amber-400 sm:text-[13px]">
                    {'★'.repeat(r.stars)}
                    <span className="text-white/10">
                      {'★'.repeat(5 - r.stars)}
                    </span>
                  </div>
                </div>

                <p className="mb-4 text-[12px] leading-relaxed text-white/40 sm:text-[13px]">
                  "{r.text}"
                </p>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ring-1 ${r.accent}`}
                >
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ══ */}
      <section className="relative w-full overflow-hidden border-t border-white/[0.06] px-4 py-20 text-center sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/[0.08] blur-[100px]" />

        <div className="reveal relative z-10 mx-auto max-w-lg">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/70 sm:text-[11px]">
            Share Your Experience
          </p>
          <h2 className="mb-3 font-['Cabinet_Grotesk',_'Syne',_sans-serif] text-[40px] font-black uppercase leading-none tracking-tight text-white/90 sm:text-[64px] lg:text-[80px]">
            Know a<br />
            property?
          </h2>
          <p className="mb-4 font-['Lora',_'Georgia',_serif] text-[18px] italic text-white/30 sm:text-[22px]">
            Help fellow renters avoid bad deals.
          </p>
          <p className="mx-auto mb-8 max-w-sm text-[12px] leading-relaxed text-white/25 sm:text-[13px]">
            Your review can save someone from months of frustration. Join
            thousands of tenants making smarter renting decisions across Lagos.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98] sm:px-8 sm:py-3.5 sm:text-[13px]"
            >
              Create Free Account
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/post-review"
              className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/50 ring-1 ring-white/[0.09] transition-all hover:bg-white/[0.09] sm:px-8 sm:py-3.5 sm:text-[13px]"
            >
              Post a Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Floating preview cards ─── */
function PreviewCard() {
  return (
    <>
      <div className="rounded-xl bg-[#0e1117] text-white p-4 ring-1 ring-white/[0.08]">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-base ring-1 ring-amber-500/20">
            ⚡
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-white/75">
              Power Supply
            </p>
            <p className="text-[10px] text-white/25">Lekki Phase 1</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-500/20">
            Good
          </span>
        </div>
        <div className="mb-1.5 flex gap-1">
          {[1, 0.85, 0.9, 0.4, 0.3].map((h, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${h > 0.5 ? 'bg-amber-500' : 'bg-white/[0.08]'}`}
            />
          ))}
        </div>
        <p className="text-[10px] text-white/20">
          18 hrs avg daily · 34 reviews
        </p>
      </div>

      <div className="rounded-xl bg-[#0e1117] p-4 ring-1 ring-white/[0.08]">
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-base ring-1 ring-amber-500/20">
            🤝
          </div>
          <div>
            <p className="text-[12px] font-semibold text-white/75">
              Landlord Rating
            </p>
            <p className="text-[10px] text-white/25">Victoria Island</p>
          </div>
        </div>
        <p className="mb-1 text-[13px] text-amber-400">
          ★★★★<span className="text-white/10">★</span>
        </p>
        <p className="text-[10px] text-white/20">
          "Responds within 24 hrs" · 12 tenants
        </p>
      </div>
    </>
  );
}
