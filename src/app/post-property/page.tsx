'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { LAGOS_HINTS, NIGERIAN_STATES } from '@/lib';
import {
  X,
  UploadCloud,
  MapPin,
  Home,
  FileText,
  Navigation,
} from 'lucide-react';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
        {label}
        {required && <span className="text-amber-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
          {icon}
        </div>
        <h2 className="text-sm sm:text-base font-semibold text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-xs placeholder:text-zinc-500 outline-none transition-all focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10';

export default function PostPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    address: '',
    town: '',
    community: '',
    nearestBusStop: '',
    postalCode: '',
    state: 'Lagos',
    latitude: '',
    longitude: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState('');

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGeocodeAddress = async () => {
    if (!form.address) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your-google-maps-api-key') {
      toast.error('Add Google Maps API key');
      return;
    }

    setGeocoding(true);

    try {
      const parts = [
        form.address,
        form.community,
        form.town,
        `${form.state} State`,
        'Nigeria',
      ]
        .filter(Boolean)
        .join(', ');

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(parts)}&key=${apiKey}`,
      );

      const data = await res.json();

      if (data.results?.[0]) {
        const { lat, lng } = data.results[0].geometry.location;

        setForm((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));

        toast.success('Coordinates found');
      } else {
        toast.error('Address not found');
      }
    } catch {
      toast.error('Geocoding failed');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.town) {
      setError('Please enter town / area.');
      return;
    }

    if (!form.latitude || !form.longitude) {
      setError('Please add coordinates.');
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      if (imageFile) fd.append('image', imageFile);

      const res = await fetch('/api/properties', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success('Property added!');
      router.push(`/properties/${data.property.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6">
        <Link
          href="/login"
          className="rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-black"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-amber-400">
            New Listing
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold">Post Property</h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400">
            Add a property and collect tenant insights.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs sm:text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section icon={<Home size={18} />} title="Property Details">
            <Field label="Property Name" required>
              <input
                value={form.name}
                onChange={set('name')}
                className={inputCls}
                placeholder="Sunshine Apartments"
              />
            </Field>
          </Section>

          <Section icon={<UploadCloud size={18} />} title="Property Photo">
            {imagePreview ? (
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-2"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-700 py-10 hover:border-amber-400"
              >
                <UploadCloud size={26} />
                <span className="text-xs sm:text-sm text-zinc-400">
                  Upload property image
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
          </Section>

          <Section icon={<MapPin size={18} />} title="Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street Address" required>
                <input
                  value={form.address}
                  onChange={set('address')}
                  className={inputCls}
                />
              </Field>

              <Field label="State">
                <select
                  value={form.state}
                  onChange={set('state')}
                  className={inputCls}
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Town / Area" required>
                <input
                  value={form.town}
                  onChange={set('town')}
                  className={inputCls}
                />
              </Field>

              <Field label="Community">
                <input
                  value={form.community}
                  onChange={set('community')}
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section icon={<Navigation size={18} />} title="Coordinates">
            <button
              type="button"
              onClick={handleGeocodeAddress}
              disabled={geocoding}
              className="rounded-xl bg-amber-400 px-4 py-3 text-xs sm:text-sm font-semibold text-black"
            >
              {geocoding ? 'Locating...' : 'Get Coordinates'}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <input
                value={form.latitude}
                onChange={set('latitude')}
                className={inputCls}
                placeholder="Latitude"
              />
              <input
                value={form.longitude}
                onChange={set('longitude')}
                className={inputCls}
                placeholder="Longitude"
              />
            </div>
          </Section>

          <Section icon={<FileText size={18} />} title="Description">
            <textarea
              rows={5}
              value={form.description}
              onChange={set('description')}
              className={`${inputCls} resize-none`}
              placeholder="Describe this property..."
            />
          </Section>

          <div className="sticky bottom-0 left-0 right-0 border-t border-white/5 bg-black/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
              <Link
                href="/properties"
                className="flex-1 rounded-lg border border-zinc-700/70 px-3 py-2 text-center text-xs sm:text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-amber-400 px-3 py-2 text-xs sm:text-sm font-semibold text-black transition active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Property'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
