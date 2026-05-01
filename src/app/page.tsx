'use client';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';
import PropertyCard from '@/components/PropertyCard';
import { features, marqueeItems, steps, testimonials } from '../lib/index';
import { useEffect, useState, useCallback } from 'react';
import { Property } from '@/types';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useProperties } from '@/hooks/useProperties';

const FONT_SERIF = "'Instrument Serif', 'Playfair Display', serif";
const FONT_SANS = "'Instrument Sans', 'DM Sans', sans-serif";
const FONT_MONO = "'Instrument Mono', 'JetBrains Mono', monospace";

export default function HomePage() {
  const [query, setQuery] = useState('');
  // @ts-ignore
  const { properties: featuredProperties, loading, status, detectedState, clearLocation } = useProperties(query);

  return (
    <div className="min-h-screen bg-[#080a0e] text-white overflow-x-hidden w-full" style={{ fontFamily: FONT_SANS }}>
      <ScrollReveal />
      <section className="relative flex items-center px-6 py-24 sm:px-12 lg:px-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 10% 40%, rgba(251,191,36,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 90% 80%, rgba(251,191,36,0.04) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Tenant Intelligence · Nigeria
                </span>
              </div>

              <h1
                className="mb-6 leading-none tracking-tight"
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 'clamp(52px, 8vw, 96px)',
                  fontStyle: 'italic',
                }}
              >
                Rent
                <span className="text-amber-400 not-italic block" style={{ fontFamily: FONT_SANS, fontWeight: 800 }}>
                  Smarter.
                </span>
                <span
                  className="block text-white"
                  style={{
                    fontSize: 'clamp(22px, 3.5vw, 42px)',
                    fontStyle: 'italic',
                    lineHeight: 1.3,
                  }}
                >
                  Know before you move.
                </span>
              </h1>

              <p className="mb-10 max-w-md text-[15px] leading-[1.75] text-white">
                Real reviews from verified tenants across Nigeria. Uncover hidden issues agents and landlords won't tell
                you — before you sign the apartment.
              </p>

              <div className="flex flex-wrap gap-3 mb-14">
                <Link
                  href="/properties"
                  className="group flex items-center gap-2.5 rounded-2xl bg-amber-500 px-7 py-3.5 text-[13px] font-bold tracking-wide text-black transition-all duration-200 hover:bg-amber-400 active:scale-[0.98]"
                >
                  <svg
                    width="15"
                    height="15"
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
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/4 px-7 py-3.5 text-[13px] font-semibold text-white/80 transition-all duration-200 hover:border-white/20 hover:text-white/80"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                  Explore Map
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { target: 500, label: 'Properties listed' },
                  { target: 2000, label: 'Verified reviews' },
                  { target: 20, label: 'Areas covered' },
                ].map(({ target, label }) => (
                  <div
                    key={label}
                    className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/3 px-5 py-4"
                  >
                    <AnimatedCounter target={target} className="text-2xl font-black text-amber-400" />
                    <span className="mt-0.5 text-[11px] text-white/30">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-4">
              <PreviewCard />
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/6 bg-white/2 py-4 w-full">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-4 pr-10 text-[11px] tracking-widest font-medium text-white"
              style={{ fontFamily: FONT_MONO }}
            >
              {item}
              <span className="text-white/10">◆</span>
            </span>
          ))}
        </div>
      </div>

      <section className="w-full px-6 py-24 sm:px-12 lg:px-20 border-b border-white/6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex text-white items-end justify-between gap-6 flex-wrap">
            <div>
              <p
                className="mb-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-400"
                style={{ fontFamily: FONT_MONO }}
              >
                Featured Listings
              </p>

              <h2
                className="leading-[1.05] tracking-tight text-white"
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(32px, 4.5vw, 58px)',
                }}
              >
                Properties near you
              </h2>

              <p className="mt-2 text-sm text-white/70">
                {detectedState && !query
                  ? `${detectedState} State`
                  : query
                    ? `Search results for "${query}"`
                    : 'All Nigeria'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertySkeletonCard key={i} />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProperties.map((p) => (
              
                <div key={p.id}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.07] bg-white/2 py-20 text-center">
              <span className="mb-4 text-4xl">🏠</span>
              <p className="text-[15px] font-semibold text-white/40">No properties found</p>
              <p className="mt-1 text-[13px] text-white/20">
                {query ? `Try a different search term` : `No listings available yet in this area`}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="mt-6 rounded-xl border border-white/10 px-5 py-2.5 text-[12px] font-semibold text-white/40 transition hover:border-white/20 hover:text-white/70"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="w-full px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-16 max-w-2xl">
            <p
              className="mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-500/80"
              style={{ fontFamily: FONT_MONO }}
            >
              What You Can Discover
            </p>
            <h2
              className="leading-[1.05] tracking-tight text-white/90"
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(36px, 5vw, 64px)',
              }}
            >
              Everything tenants{' '}
              <span className="text-white not-italic" style={{ fontFamily: FONT_SANS, fontWeight: 800 }}>
                wish they knew
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 border border-gray rounded-3xl overflow-hidden">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`reveal d${i + 1} group relative bg-[#080a0e] p-7 sm:p-8 transition-colors duration-300 hover:bg-white/3`}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                  <span className="text-lg">{f.icon}</span>
                </div>
                <h3 className="mb-2 text-[15px] font-bold text-white">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-white">{f.desc}</p>
                <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  View reports
                  <svg
                    width="11"
                    height="11"
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


      <section className="w-full border-t border-white/6 px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-16 max-w-2xl">
            <p
              className="mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-500/90"
              style={{ fontFamily: FONT_MONO }}
            >
              How It Works
            </p>
            <h2
              className="leading-[1.05] tracking-tight text-white/90"
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(36px, 5vw, 64px)',
              }}
            >
              Three steps to{' '}
              <span className="text-white not-italic" style={{ fontFamily: FONT_SANS, fontWeight: 800 }}>
                rent with confidence
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`reveal d${i + 1} relative rounded-3xl border border-white/[0.07] bg-white/2 p-8 overflow-hidden`}
              >
                <span
                  className="pointer-events-none absolute -right-4 -top-4 select-none text-[100px] font-black leading-none text-amber"
                  style={{ fontFamily: FONT_SANS }}
                >
                  {s.n}
                </span>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                  {s.icon}
                </div>
                <p
                  className="mb-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-500"
                  style={{ fontFamily: FONT_MONO }}
                >
                  Step {s.n}
                </p>
                <h3 className="mb-3 text-[20px] font-bold text-white">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-white">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-t border-white/6 px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-16 max-w-2xl">
            <p
              className="mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-500"
              style={{ fontFamily: FONT_MONO }}
            >
              Real Reviews
            </p>
            <h2
              className="leading-[1.05] tracking-tight text-white/90"
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(36px, 5vw, 64px)',
              }}
            >
              What tenants{' '}
              <span className="text-white not-italic" style={{ fontFamily: FONT_SANS, fontWeight: 800 }}>
                are saying
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((r, i) => (
              <div key={r.name} className={`reveal d${i + 1} rounded-3xl border border-white/[0.07] bg-white/2 p-7`}>
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ring-1 ${r.accent}`}
                  >
                    {r.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-white/75">{r.name}</p>
                    <p className="text-[11px] text-white/25">
                      {r.area} · {r.tenure}
                    </p>
                  </div>
                  <div className="ml-auto shrink-0 text-[13px] tracking-wide text-amber-400">
                    {'★'.repeat(r.stars)}
                    <span className="text-white/10">{'★'.repeat(5 - r.stars)}</span>
                  </div>
                </div>
                <p className="mb-5 text-[13px] leading-relaxed text-white">"{r.text}"</p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ring-1 ${r.accent}`}
                >
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden border-t border-white/6 px-6 py-28 sm:px-12 lg:px-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(251,191,36,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="reveal relative z-10 mx-auto max-w-2xl text-center">
          <p
            className="mb-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-500"
            style={{ fontFamily: FONT_MONO }}
          >
            Share Your Experience
          </p>
          <h2
            className="mb-4 leading-none tracking-tight text-white/90"
            style={{
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(48px, 7vw, 88px)',
            }}
          >
            Know a property?
          </h2>
          <p className="mb-4 text-[17px] text-white" style={{ fontFamily: FONT_SERIF, fontStyle: 'italic' }}>
            Help fellow renters avoid bad deals.
          </p>
          <p className="mx-auto mb-10 max-w-sm text-[13px] leading-relaxed text-white">
            Your review can save someone from months of frustration. Join thousands of tenants making smarter renting
            decisions across Nigeria.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="flex items-center gap-2.5 rounded-2xl bg-amber-500 px-8 py-4 text-[13px] font-bold tracking-wide text-black transition-all hover:bg-amber-400 active:scale-[0.98]"
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
              className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/4 px-8 py-4 text-[13px] font-semibold text-white transition-all hover:border-white/20 hover:text-white/80"
            >
              Post a Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PreviewCard() {
  return (
    <>
      <div className="rounded-3xl border border-white/8 bg-white/3 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-base ring-1 ring-amber-500/20">
              ⚡
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white/75">Power Supply</p>
              <p className="text-[11px] text-white">Lekki Phase 1</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-500/20">
            Good
          </span>
        </div>
        <div className="mb-2 flex gap-1">
          {[1, 0.85, 0.9, 0.4, 0.3].map((h, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${h > 0.5 ? 'bg-amber-500' : 'bg-white/[0.07]'}`} />
          ))}
        </div>
        <p className="text-[11px] text-white/20">18 hrs avg daily · 34 reviews</p>
      </div>

      <div className="rounded-3xl border border-white/8 bg-white/3 p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-base ring-1 ring-amber-500/20">
            🤝
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white/75">Landlord Rating</p>
            <p className="text-[11px] text-white">Victoria Island</p>
          </div>
        </div>
        <p className="mb-1 text-[15px] text-amber-400 tracking-wide">
          ★★★★<span className="text-white/10">★</span>
        </p>
        <p className="text-[11px] text-white">"Responds within 24 hrs" · 12 tenants</p>
      </div>

      <div className="rounded-3xl border border-white/8 bg-white/3 p-5">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.12em] uppercase text-white">Recent Review</p>
        <p className="mb-3 text-[12px] leading-relaxed text-white/80">
          "Water supply is consistent, security is good, but the landlord takes weeks to fix issues..."
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/25">Surulere · 2 yrs</span>
          <span className="text-[12px] text-amber-400">★★★</span>
        </div>
      </div>
    </>
  );
}

function PropertySkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-white/[0.07] bg-white/3">
      <div className="h-48 bg-white/5" />
      <div className="space-y-4 p-4">
        <div className="h-4 w-3/4 rounded bg-white/5" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-full bg-white/5" />
          <div className="h-8 w-20 rounded-full bg-white/5" />
        </div>
        <div className="h-10 w-full rounded-xl bg-white/5" />
      </div>
    </div>
  );
}
