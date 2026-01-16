import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';

/* ----------------------------- Helpers ----------------------------- */

// Simple slug generator
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Normalize date to ISO string
const normalizeDateToIso = (value: string): string => {
  const parsed = new Date(value.trim())

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid event date; expected a parsable date string.')
  }

  return parsed.toISOString()
}

// 24-hour HH:MM format
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

const normalizeTime = (value: string): string => {
  const trimmed = value.trim()

  if (!TIME_PATTERN.test(trimmed)) {
    throw new Error('Invalid event time; expected HH:MM in 24-hour format.')
  }

  return trimmed
}

/* ------------------------------ Schema ------------------------------ */

const eventSchema = new Schema(
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

  // Normalize date & time
  if (this.isModified('date')) {
    this.date = normalizeDateToIso(this.date)
  }

  if (this.isModified('time')) {
    this.time = normalizeTime(this.time)
  }
})

/* ------------------------------- Model ------------------------------- */

export type EventDocument = InferSchemaType<typeof eventSchema>
export type EventModel = Model<EventDocument>

export const Event =
  (models.Event as EventModel) ||
  model<EventDocument, EventModel>('Event', eventSchema)

export default Event
