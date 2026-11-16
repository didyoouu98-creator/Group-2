import { NonTaxableBenefit } from '../types';

export const NON_TAXABLE_BENEFITS_CATALOG: NonTaxableBenefit[] = [
  // Category 1: Time Off
  {
    id: 'ben-to-friday-early',
    title: 'Leave 1 Hour Early on Friday',
    description: 'Leaving an hour early on a Friday of your choice with manager coordination.',
    category: 'Time Off',
    pointsCost: 120,
    taxTreatment: 'Non-Taxable Flexible Schedule Perk',
  },
  {
    id: 'ben-to-late-arrival',
    title: 'Flexible Late Arrival (1 Hour)',
    description: 'Arriving an hour later on a given workday without using PTO.',
    category: 'Time Off',
    pointsCost: 100,
    taxTreatment: 'Non-Taxable Flexible Schedule Perk',
  },
  {
    id: 'ben-to-half-day-winner',
    title: 'Half a Day Off (1st-Place Winner)',
    description: 'Half a day of paid recognition time off reserved exclusively for the #1 ranked quiz participant.',
    category: 'Time Off',
    pointsCost: 250,
    taxTreatment: 'Non-Taxable Paid Recognition Leave',
    firstPlaceOnly: true,
  },
  {
    id: 'ben-to-remote-day',
    title: 'Additional Day of Remote Work',
    description: 'One additional remote work day during any standard workweek.',
    category: 'Time Off',
    pointsCost: 140,
    taxTreatment: 'Non-Taxable Workplace Flexibility Benefit',
  },

  // Category 2: Professional Development
  {
    id: 'ben-pd-course-book',
    title: 'Company-Paid Course, Certification, or Book',
    description: 'A course, professional certification exam, or technical book paid for by the company.',
    category: 'Professional Development',
    pointsCost: 200,
    taxTreatment: 'Tax-Exempt Employer-Paid Training Benefit',
  },
  {
    id: 'ben-pd-mentorship',
    title: 'Dedicated Field-of-Interest Mentorship',
    description: 'Structured 1-on-1 mentorship pairing with a senior leader in a field of your interest.',
    category: 'Professional Development',
    pointsCost: 150,
    taxTreatment: 'Non-Taxable Career Development Benefit',
  },
  {
    id: 'ben-pd-conference',
    title: 'Industry Conference or Webinar Pass',
    description: 'Sponsored registration to attend a relevant industry conference or live professional webinar.',
    category: 'Professional Development',
    pointsCost: 220,
    taxTreatment: 'Tax-Exempt Continuing Education Benefit',
  },

  // Category 3: Practical or Fun Rewards
  {
    id: 'ben-pr-merch-gift',
    title: 'Gift Card, Company Merch, or Small Gadget',
    description: 'Choose a small desk gadget, branded company merchandise, or a recognition gift card.',
    category: 'Practical or Fun Rewards',
    pointsCost: 160,
    taxTreatment: 'Non-Cash De Minimis / Recognition Perk (Merch & gadgets tax-exempt under policy limits)',
  },
  {
    id: 'ben-pr-parking',
    title: 'Preferred Parking for a Month',
    description: 'Reserved prime front-row parking spot at the office for one full calendar month.',
    category: 'Practical or Fun Rewards',
    pointsCost: 180,
    taxTreatment: 'Non-Taxable Qualified Parking / Facility Perk',
  },
];

export const MISSED_QUIZ_SURVEY_REASONS: string[] = [
  'Heavy workload or urgent client/project deadlines',
  'Schedule conflict or shift timing constraint',
  'Quiz topics felt unclear or less relevant to daily work',
  'Technical issue or trouble using the quiz interface',
  'Personal reason or needed a mental break today',
];
