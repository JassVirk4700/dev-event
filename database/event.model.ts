import { Schema, model, models, type Model, type InferSchemaType, type Document } from 'mongoose';

// Typscript interface for Event attributes
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/* ----------------------------- Helpers ----------------------------- */

// Simple slug generator
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/* ------------------------------ Schema ------------------------------ */

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
)

/* ------------------------------- Hooks ------------------------------- */

eventSchema.pre('save', function () {
  // Required string fields
  const requiredStringFields = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'date',
    'time',
    'mode',
    'audience',
    'organizer',
  ] as const

  for (const field of requiredStringFields) {
    const value = this[field]
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Event ${field} is required and cannot be empty.`)
    }
  }

  // Required array fields
  const requiredArrayFields = ['agenda', 'tags'] as const

  for (const field of requiredArrayFields) {
    const value = this[field]
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error(`Event ${field} must be a non-empty array.`)
    }
    if (!value.every(v => typeof v === 'string' && v.trim().length > 0)) {
      throw new Error(`Event ${field} must contain only non-empty strings.`)
    }
  }
  // Slug generation
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title)
  }
})

/* ------------------------------- Model ------------------------------- */

export type EventDocument = InferSchemaType<typeof eventSchema>
export type EventModel = Model<EventDocument>

export const Event =
  (models.Event as EventModel) ||
  model<EventDocument, EventModel>('Event', eventSchema)

export default Event
