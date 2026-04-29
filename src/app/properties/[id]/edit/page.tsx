'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { LAGOS_HINTS, NIGERIAN_STATES } from '@/lib';
import { X, UploadCloud } from 'lucide-react';
import { Property } from '@/types';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {label}
        {required && <span className="ml-1 text-amber-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 ring-1 ring-white/[0.08] outline-none transition focus:bg-white/[0.06] focus:ring-amber-500/40';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [property, setProperty] = useState<Property | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

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

  // Image state
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then(({ property: p }) => {
        if (!p) return;
        setProperty(p);
        setForm({
          name: p.name ?? '',
          address: p.address ?? '',
          town: p.town ?? '',
          community: p.community ?? '',
          nearestBusStop: p.nearestBusStop ?? '',
          postalCode: p.postalCode ?? '',
          state: p.state ?? 'Lagos',
          latitude: String(p.latitude ?? ''),
          longitude: String(p.longitude ?? ''),
          description: p.description ?? '',
        });
        setExistingImageUrl(p.imageUrl ?? null);
      })
      .finally(() => setPageLoading(false));
  }, [id]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGeocodeAddress = async () => {
    if (!form.address) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your-google-maps-api-key') {
      toast.error('Add Google Maps API key to geocode addresses');
      return;
    }
    setGeocoding(true);
    try {
      const parts = [form.address, form.community, form.town, `${form.state} State`, 'Nigeria']
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
        toast.success(`Found: ${data.results[0].formatted_address}`);
      } else {
        toast.error('Address not found.');
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
      setError('Please enter the town or area for this property.');
      return;
    }
    if (!form.latitude || !form.longitude) {
      setError("Please add coordinates. Click 'Get Coordinates' or enter manually.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (removeImage) fd.append('removeImage', 'true');

      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update property');
      toast.success('Property updated!');
      router.push(`/properties/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0c0f14]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />
      </div>
    );
  }

  if (!user || (property && (property as any).userId !== (user as any).id)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0f14] px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-5xl opacity-20">🔒</div>
          <p className="text-base font-semibold text-white/50">Access denied</p>
          <Link href="/properties" className="text-sm text-amber-400 hover:text-amber-300">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const displayImage = removeImage ? null : (imagePreview ?? existingImageUrl);

  return (
    <div className="min-h-screen bg-[#0c0f14] font-['Geist_Mono','IBM_Plex_Mono',monospace] text-white">
      <div className="border-b border-white/6 bg-[#0e1117]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link
            href={`/properties/${id}`}
            className="mb-2 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          >
            ← Property
          </Link>
          <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-white/30">Edit Listing</p>
          <h1 className="text-2xl font-bold text-white/90">Edit Property</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-4">
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <span className="mt-0.5 text-red-400">⚠</span>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white/3 ring-1 ring-white/[0.07] divide-y divide-white/5"
        >
          {/* Identity */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">Property Identity</p>
            <Field label="Property Name" required>
              <input type="text" value={form.name} onChange={set('name')} required className={inputCls} />
            </Field>
          </div>

          {/* Photo */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">
              Photo <span className="normal-case font-normal text-white/20">(optional)</span>
            </p>

            {displayImage ? (
              <div
                className="relative w-full rounded-xl overflow-hidden ring-1 ring-white/[0.08]"
                style={{ aspectRatio: '16/9' }}
              >
                <Image src={displayImage} alt="Property" fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-black/80 transition-all"
                  >
                    <UploadCloud size={12} />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white/80 hover:bg-red-500/80 hover:text-white transition-all"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/[0.12] py-8 text-center transition-all hover:border-amber-500/40 hover:bg-white/[0.02]"
              >
                <UploadCloud size={24} className="text-white/20" />
                <span className="text-xs text-white/30">Click to upload a photo</span>
                <span className="text-[11px] text-white/15">JPG, PNG, WEBP · max 5 MB</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Location */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">Location</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field label="Street Address" required>
                  <input type="text" value={form.address} onChange={set('address')} required className={inputCls} />
                </Field>
              </div>
              <Field label="State" required>
                <select value={form.state} onChange={set('state')} required className={inputCls}>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s} className="bg-[#0e1117]">
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Town / Area" required>
                <input type="text" value={form.town} onChange={set('town')} required className={inputCls} />
              </Field>
              <Field label="Community / Estate">
                <input type="text" value={form.community} onChange={set('community')} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nearest Bus Stop / Landmark">
                <input type="text" value={form.nearestBusStop} onChange={set('nearestBusStop')} className={inputCls} />
              </Field>
              <Field label="Postal Code">
                <input type="text" value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Coordinates */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">Coordinates</p>

            <button
              type="button"
              onClick={handleGeocodeAddress}
              disabled={geocoding || !form.address}
              className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white/60 ring-1 ring-white/[0.09] transition-all hover:bg-white/[0.09] hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {geocoding ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/20 border-t-white/60" />
                  Locating…
                </>
              ) : (
                <>📍 Get Coordinates from Address</>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude" required>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={set('latitude')}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Longitude" required>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={set('longitude')}
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            {form.latitude && form.longitude && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3.5 py-2 ring-1 ring-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-300">
                  {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">Description</p>
            <Field label="About this property">
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <Link
              href={`/properties/${id}`}
              className="rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/30 transition-all hover:text-white/60"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-black/20 border-t-black/70" />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

        {/* Lagos coordinate hints */}
        <div className="rounded-xl bg-amber-500/[0.05] px-6 py-5 ring-1 ring-amber-500/20">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-amber-400/70">
            💡 Lagos Coordinate Hints
          </p>
          <ul className="space-y-2">
            {LAGOS_HINTS.map(({ emoji, label, coords }) => (
              <li key={label} className="flex items-center justify-between gap-4">
                <span className="text-xs text-white/40">
                  {emoji} {label}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const [lat, lng] = coords.split(',').map((s) => s.trim());
                    setForm((prev) => ({
                      ...prev,
                      latitude: lat,
                      longitude: lng,
                    }));
                    toast.success(`Coordinates set to ${label}`);
                  }}
                  className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-400/80 ring-1 ring-amber-500/20 transition hover:bg-amber-500/20 hover:text-amber-300"
                >
                  {coords}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
