import type { ReactNode } from 'react';
import { Testimonial, Step, Feature } from '../types/index';

export const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export const features: Feature[] = [
  {
    icon: '⚡',
    title: 'Electricity',
    desc: 'Find out about power supply reliability before signing any lease. Know actual daily hours, not agent promises.',
  },
  {
    icon: '💧',
    title: 'Water Supply',
    desc: "Know if water runs 24/7 or if you'll need constant refills. Check borehole access and water board ratings.",
  },
  {
    icon: '🤝',
    title: 'Landlord',
    desc: "Real stories from tenants about landlord responsiveness and fairness. Don't get trapped with a nightmare landlord.",
  },
  {
    icon: '💸',
    title: 'Rent History',
    desc: 'Discover patterns of unfair rent hikes before you commit. See year-on-year rent data from past tenants.',
  },
  {
    icon: '🗑️',
    title: 'Sanitation',
    desc: 'Check waste disposal, drainage, and general cleanliness. Avoid flooding zones and poor drainage estates.',
  },
  {
    icon: '🛣️',
    title: 'Road & Network',
    desc: 'Learn about road conditions, traffic patterns, and mobile network quality near any address.',
  },
];

export const steps: Step[] = [
  {
    n: '01',
    title: 'Search Any Address',
    desc: 'Type in a street, estate, or area in Lagos to find existing properties and their tenant reviews.',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Read Tenant Reviews',
    desc: 'Browse categorized reviews from verified past and current tenants covering every aspect of life there.',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Make Your Decision',
    desc: 'Use AI-powered summaries and interactive maps to choose your next home with full confidence.',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export const testimonials: Testimonial[] = [
  {
    initials: 'AO',
    name: 'Adebayo O.',
    area: 'Ikeja GRA',
    tenure: '2 yrs',
    stars: 5,
    text: 'Finally found a place with stable electricity. The reviews here saved me from signing a 2-year lease on a property with 8hrs daily power.',
    tag: '⚡ Electricity',
    accent: 'text-amber-300 bg-amber-500/10 ring-amber-500/20',
  },
  {
    initials: 'CU',
    name: 'Chioma U.',
    area: 'Lekki Phase 1',
    tenure: '3 yrs',
    stars: 4,
    text: 'The landlord rating feature is gold. My previous landlord increased rent 40% with 2 weeks notice. Checked his rating here before my next search.',
    tag: '🤝 Landlord',
    accent: 'text-sky-300 bg-sky-500/10 ring-sky-500/20',
  },
  {
    initials: 'EO',
    name: 'Emeka O.',
    area: 'Surulere',
    tenure: '1 yr',
    stars: 5,
    text: 'Water supply is checked. Road conditions are checked. I moved in knowing exactly what I was getting. This is what every Nigerian renter needs.',
    tag: '💧 Water',
    accent: 'text-emerald-300 bg-emerald-500/10 ring-emerald-500/20',
  },
];

export const marqueeItems: string[] = [
  '⚡ Electricity Reports',
  '💧 Water Supply',
  '🤝 Landlord Behavior',
  '💸 Rent History',
  '🗑️ Sanitation',
  '🛣️ Road & Network',
  '🏘️ Neighborhood Safety',
  '📶 Internet Coverage',
  '🔒 Security',
  '🚌 Transport Access',
];

export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export const LAGOS_HINTS = [
  { emoji: '🏖️', label: 'Lekki Phase 1', coords: '6.4281, 3.4219' },
  { emoji: '🏙️', label: 'Victoria Island', coords: '6.4698, 3.4270' },
  { emoji: '🎓', label: 'Yaba', coords: '6.5059, 3.3760' },
  { emoji: '🌇', label: 'Surulere', coords: '6.4983, 3.3563' },
  { emoji: '🏘️', label: 'Ikeja', coords: '6.5954, 3.3353' },
];

export const NIGERIAN_STATE_COORDS: {
  lat: number;
  lng: number;
  name: string;
}[] = [
  { lat: 6.5244, lng: 3.3792, name: 'Lagos' },
  { lat: 7.1608, lng: 3.3473, name: 'Ogun' },
  { lat: 7.8489, lng: 3.947, name: 'Oyo' },
  { lat: 9.0765, lng: 7.3986, name: 'FCT' },
  { lat: 4.8156, lng: 7.0498, name: 'Rivers' },
  { lat: 12.0022, lng: 8.592, name: 'Kano' },
  { lat: 10.5105, lng: 7.4165, name: 'Kaduna' },
  { lat: 6.2104, lng: 6.9623, name: 'Anambra' },
  { lat: 6.4584, lng: 7.5464, name: 'Enugu' },
  { lat: 5.8904, lng: 5.68, name: 'Delta' },
  { lat: 6.335, lng: 5.627, name: 'Edo' },
  { lat: 7.25, lng: 5.195, name: 'Ondo' },
  { lat: 7.719, lng: 5.311, name: 'Ekiti' },
  { lat: 7.5629, lng: 4.52, name: 'Osun' },
  { lat: 8.4966, lng: 4.5421, name: 'Kwara' },
  { lat: 7.3369, lng: 8.74, name: 'Benue' },
  { lat: 9.2182, lng: 9.5179, name: 'Plateau' },
  { lat: 5.8702, lng: 8.5881, name: 'Cross River' },
  { lat: 5.0077, lng: 7.8536, name: 'Akwa Ibom' },
  { lat: 5.4895, lng: 7.0269, name: 'Imo' },
  { lat: 5.4527, lng: 7.5248, name: 'Abia' },
  { lat: 6.2649, lng: 8.0137, name: 'Ebonyi' },
  { lat: 4.7719, lng: 6.0699, name: 'Bayelsa' },
  { lat: 7.7337, lng: 6.6906, name: 'Kogi' },
  { lat: 9.9309, lng: 5.5983, name: 'Niger' },
  { lat: 8.5378, lng: 8.3206, name: 'Nasarawa' },
  { lat: 7.9994, lng: 10.774, name: 'Taraba' },
  { lat: 9.3265, lng: 12.3984, name: 'Adamawa' },
  { lat: 10.2791, lng: 11.167, name: 'Gombe' },
  { lat: 11.8333, lng: 13.15, name: 'Borno' },
  { lat: 12.0, lng: 11.5, name: 'Yobe' },
  { lat: 10.3158, lng: 9.8442, name: 'Bauchi' },
  { lat: 12.228, lng: 9.5616, name: 'Jigawa' },
  { lat: 12.9889, lng: 7.6006, name: 'Katsina' },
  { lat: 12.4539, lng: 4.1975, name: 'Kebbi' },
  { lat: 13.0059, lng: 5.2476, name: 'Sokoto' },
  { lat: 12.1704, lng: 6.6624, name: 'Zamfara' },
];
