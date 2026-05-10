import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Booking from './models/Booking.js';
import Expert from './models/Expert.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

/** Two mock experts per category — full coverage of all 8 enums */
const MOCK_EXPERTS = [
  {
    name: 'James Mitchell',
    category: 'Technology',
    experience: 10,
    rating: 4.9,
    reviewCount: 142,
    bio: 'Staff engineer and solution architect. Helps teams ship reliable cloud systems, APIs, and developer workflows through pragmatic architecture reviews and pair sessions.',
  },
  {
    name: 'Sana Rahman',
    category: 'Technology',
    experience: 6,
    rating: 4.7,
    reviewCount: 88,
    bio: 'Full-stack developer focused on performance, testing, and shipping incrementally. Ideal for debugging tricky production issues and leveling up code quality.',
  },
  {
    name: 'Priya Sharma',
    category: 'Business',
    experience: 12,
    rating: 4.8,
    reviewCount: 203,
    bio: 'Former operator turned advisor on GTM, positioning, and execution cadence. Works with founders and leads on strategy that sticks beyond the slide deck.',
  },
  {
    name: 'Daniel Okonkwo',
    category: 'Business',
    experience: 8,
    rating: 4.6,
    reviewCount: 76,
    bio: 'Business coach on stakeholder alignment, prioritization, and metrics that matter. Practical frameworks you can reuse weekly.',
  },
  {
    name: 'Elena Vasquez',
    category: 'Design',
    experience: 9,
    rating: 4.9,
    reviewCount: 164,
    bio: 'Product designer specializing in UX flows, research synthesis, and UI craft. Great for critique sessions and tightening onboarding journeys.',
  },
  {
    name: 'Marcus Chen',
    category: 'Design',
    experience: 5,
    rating: 4.5,
    reviewCount: 54,
    bio: 'Brand and visual systems designer. Helps teams unify typography, color, and components so everything feels cohesive across web and marketing.',
  },
  {
    name: 'Olivia Bennett',
    category: 'Marketing',
    experience: 11,
    rating: 4.8,
    reviewCount: 131,
    bio: 'Growth marketer focused on messaging, lifecycle campaigns, and experimentation. Strong on narrative and measurable funnel improvements.',
  },
  {
    name: 'Ahmed Farouk',
    category: 'Marketing',
    experience: 7,
    rating: 4.6,
    reviewCount: 61,
    bio: 'SEO and content strategist who connects editorial calendars with technical basics—ideal when you need clarity on content ops and distribution.',
  },
  {
    name: 'Sophie Laurent',
    category: 'Finance',
    experience: 14,
    rating: 4.9,
    reviewCount: 219,
    bio: 'Finance leader experienced in FP&A, forecasting, and investor-ready reporting. Helps leaders read numbers confidently and plan runway intentionally.',
  },
  {
    name: 'Ryan Cooper',
    category: 'Finance',
    experience: 6,
    rating: 4.5,
    reviewCount: 49,
    bio: 'Accounting fundamentals for startups: bookkeeping hygiene, cash discipline, and simple dashboards operators can trust.',
  },
  {
    name: 'Meera Patel',
    category: 'Legal',
    experience: 13,
    rating: 4.8,
    reviewCount: 97,
    bio: 'Corporate counsel-style guidance on contracts, vendor risk, and compliance basics—education-focused sessions, not formal legal representation.',
  },
  {
    name: 'Victor Reyes',
    category: 'Legal',
    experience: 9,
    rating: 4.6,
    reviewCount: 71,
    bio: 'IP and brand protection fundamentals for product teams: trademarks, licensing basics, and practical documentation hygiene.',
  },
  {
    name: 'Anna Lindstrom',
    category: 'Health',
    experience: 11,
    rating: 4.9,
    reviewCount: 182,
    bio: 'Registered dietitian focused on sustainable habits, energy, and performance nutrition for busy professionals—science-backed and judgment-free.',
  },
  {
    name: 'Kim Nguyen',
    category: 'Health',
    experience: 8,
    rating: 4.7,
    reviewCount: 115,
    bio: 'Mindfulness and stress resilience coach. Short sessions that fit real schedules—breathwork, boundaries, and recovery routines that stick.',
  },
  {
    name: 'David Okoro',
    category: 'Education',
    experience: 15,
    rating: 4.9,
    reviewCount: 256,
    bio: 'Learning designer and educator: curriculum structure, assessments, and facilitation skills for trainers and internal academies.',
  },
  {
    name: 'Laura Fischer',
    category: 'Education',
    experience: 7,
    rating: 4.6,
    reviewCount: 63,
    bio: 'Career educator helping professionals pivot—resume positioning, interview storytelling, and negotiation practice with actionable feedback.',
  },
];

function initialsFromName(name) {
  const parts = name.split(' ').filter(Boolean);
  return `${parts[0]?.[0] ?? '?'}${parts[1]?.[0] ?? ''}`.toUpperCase();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getNextSevenDateStrings() {
  const out = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

async function seed() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI is missing in backend/.env');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  await Booking.deleteMany({});
  await Expert.deleteMany({});

  const dates = getNextSevenDateStrings();

  const docs = MOCK_EXPERTS.map((mock) => {
    const pairs = [];
    for (const date of dates) {
      for (const time of TIMES) {
        pairs.push({ date, time });
      }
    }
    shuffle(pairs);
    const slotCount = 6 + Math.floor(Math.random() * 3);
    const slots = pairs.slice(0, slotCount).map((p) => ({
      date: p.date,
      time: p.time,
      isBooked: false,
    }));

    return {
      name: mock.name,
      category: mock.category,
      experience: mock.experience,
      rating: mock.rating,
      reviewCount: mock.reviewCount,
      bio: mock.bio,
      avatar: initialsFromName(mock.name),
      availableSlots: slots,
    };
  });

  await Expert.insertMany(docs);
  process.stdout.write(
    `Seeded ${docs.length} mock experts (all categories covered).\n`
  );
  await mongoose.disconnect();
}

seed().catch((e) => {
  process.stderr.write(String(e) + '\n');
  process.exit(1);
});
